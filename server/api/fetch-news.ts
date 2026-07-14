import { defineEventHandler, getQuery, getRequestHeader, getMethod, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { getAdminEmails, requireAdmin } from '../utils/adminAuth'

function assertOrigin(event: any) {
  const origin = getRequestHeader(event, 'origin') || getRequestHeader(event, 'referer') || ''
  const siteOrigin = process.env.NUXT_APP_ORIGIN || process.env.NUXT_PUBLIC_SITE_URL || ''
  if (siteOrigin) {
    let expected: string
    try {
      expected = new URL(siteOrigin).origin
    } catch {
      return
    }
    if (!origin) {
      throw createError({ statusCode: 403, statusMessage: 'Missing origin' })
    }
    let actual: string
    try {
      actual = new URL(origin).origin
    } catch {
      throw createError({ statusCode: 403, statusMessage: 'Missing origin' })
    }
    if (actual !== expected) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden origin' })
    }
  }
}

// RSS feed sources mapped to our categories
const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'general', source: 'BBC News' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'general', source: 'BBC News' },
  { url: 'https://www.theguardian.com/world/rss', category: 'general', source: 'The Guardian' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'technology', source: 'BBC Tech' },
  { url: 'https://www.theguardian.com/technology/rss', category: 'technology', source: 'The Guardian Tech' },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'sports', source: 'BBC Sport' },
  { url: 'https://www.theguardian.com/sport/rss', category: 'sports', source: 'The Guardian Sport' },
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'science', source: 'BBC Science' },
  { url: 'https://www.theguardian.com/science/rss', category: 'science', source: 'The Guardian Science' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'business', source: 'BBC Business' },
  { url: 'https://www.theguardian.com/business/rss', category: 'business', source: 'The Guardian Business' },
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', category: 'health', source: 'BBC Health' },
  { url: 'https://www.theguardian.com/society/health/rss', category: 'health', source: 'The Guardian Health' },
]

const FALLBACK_IMAGES: Record<string, string> = {
  general: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=90&w=1600&fm=webp',
  technology: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=90&w=1600&fm=webp',
  sports: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=90&w=1600&fm=webp',
  science: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=90&w=1600&fm=webp',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=90&w=1600&fm=webp',
  health: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=90&w=1600&fm=webp'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  assertOrigin(event)

  const adminEmails = getAdminEmails()
  if (!adminEmails.length) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Missing Supabase service role key. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local' }
  }

  let userEmail = ''
  try {
    const adminUser = await requireAdmin(event)
    userEmail = adminUser.email || ''
  } catch {
    return { success: false, error: 'Authentication required' }
  }

  if (!userEmail || !adminEmails.map(e => e.toLowerCase()).includes(userEmail.toLowerCase())) {
    return { success: false, error: 'Admin role required' }
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey)

    // Dynamic import of rss-parser
    const Parser = (await import('rss-parser')).default
    const parser = new Parser({
      timeout: 15000,
      headers: { 'User-Agent': 'AtlasReport/1.0' },
      customFields: {
        item: [
          ['media:content', 'mediaContent', { keepArray: true }],
          ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
          ['media:group', 'mediaGroup', { keepArray: true }],
        ]
      }
    })

    const results = { total: 0, new: 0, skipped: 0, errors: 0, feedErrors: [] as string[] }
    const seenTitles = new Set<string>()

    for (const feed of RSS_FEEDS) {
      let parsed
      try {
        parsed = await parser.parseURL(feed.url)
      } catch (feedErr) {
        results.feedErrors.push(`${feed.url}: ${feedErr instanceof Error ? feedErr.message : 'Unknown error'}`)
        results.errors++
        continue
      }

      const items = parsed.items || []
      results.total += items.length

      for (const item of items) {
        if (!item.title) continue

        const title = item.title.trim()

        // Skip duplicates already seen in this run (same story across feeds)
        const titleKey = title.toLowerCase()
        if (seenTitles.has(titleKey)) {
          results.skipped++
          continue
        }

        // Check for duplicate by title
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('title', title)
          .maybeSingle()

        if (existing) {
          results.skipped++
          continue
        }

        seenTitles.add(titleKey)

        // Extract content
        const description = item.contentSnippet || item.description || ''
        const contentText = item.content || item.contentSnippet || description
        const paragraphs = contentText
          .split(/\n+/)
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 20 && p.length < 2000)

        const contentArray = paragraphs.length >= 2 
          ? paragraphs.slice(0, 10) 
          : [description.substring(0, 500) || item.title]

        // Extract image with custom fields support
        let imageUrl = ''
        const mediaItem = item as any

        // 1) Check enclosure
        if (item.enclosure?.url?.startsWith('http')) {
          imageUrl = item.enclosure.url
          // Skip non-image enclosures (e.g. video/*)
          if (item.enclosure.type && !item.enclosure.type.startsWith('image/')) {
            imageUrl = ''
          }
        }

        // 2) Check media:content (now parsed via customFields)
        if (!imageUrl && mediaItem.mediaContent && mediaItem.mediaContent.length > 0) {
          const mc = mediaItem.mediaContent[0]
          const url = mc?.$?.url || (typeof mc === 'string' ? mc : '')
          // Accept image urls, or any media URL if no type restriction
          if (url && (!mc?.$?.type || mc?.$?.type.startsWith('image/'))) {
            imageUrl = url
          }
        }

        // 3) Check media:thumbnail (now parsed via customFields)
        if (!imageUrl && mediaItem.mediaThumbnail && mediaItem.mediaThumbnail.length > 0) {
          const mt = mediaItem.mediaThumbnail[0]
          imageUrl = mt?.$?.url || (typeof mt === 'string' ? mt : '')
        }

        // 4) Check media:group for nested media:content
        if (!imageUrl && mediaItem.mediaGroup && mediaItem.mediaGroup.length > 0) {
          const group = mediaItem.mediaGroup[0]
          if (group?.mediaContent && group.mediaContent.length > 0) {
            const url = group.mediaContent[0]?.$?.url || ''
            if (url) imageUrl = url
          }
        }

        // 5) Try to extract from content HTML (some feeds embed <img> in content)
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i)
          if (imgMatch && imgMatch[1].startsWith('http')) {
            imageUrl = imgMatch[1]
          }
        }

        // 6) Fallback to Unsplash
        if (!imageUrl || !imageUrl.startsWith('http')) {
          imageUrl = FALLBACK_IMAGES[feed.category] || FALLBACK_IMAGES.general
        }

        // Insert article
        const { error: insertError } = await supabase
          .from('articles')
          .insert({
            category: feed.category,
            title,
            description: description.substring(0, 300),
            content: contentArray,
            image: imageUrl,
            author: feed.source,
            published: item.isoDate || item.pubDate || new Date().toISOString()
          })

        if (insertError) {
          results.errors++
        } else {
          results.new++
        }
      }
    }

    return {
      success: true,
      message: `Fetched ${results.total} items → ${results.new} new, ${results.skipped} duplicates, ${results.errors} errors`,
      results
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown error'
    }
  }
})