import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

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
  general: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
  technology: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800',
  sports: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
  science: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
  health: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const apiKey = query.key as string
  
  // Auth check
  const secretKey = process.env.NUXT_RSS_SECRET || 'atlas-rss-secret'
  if (apiKey !== secretKey) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Use Supabase service role client (bypasses RLS)
    const supabase = await serverSupabaseServiceRole(event)

    // Dynamic import of rss-parser
    const Parser = (await import('rss-parser')).default
    const parser = new Parser({
      timeout: 15000,
      headers: { 'User-Agent': 'AtlasReport/1.0' }
    })

    const results = { total: 0, new: 0, skipped: 0, errors: 0, feedErrors: [] as string[] }

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

        // Check for duplicate by title
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('title', item.title.substring(0, 200))
          .maybeSingle()

        if (existing) {
          results.skipped++
          continue
        }

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

        // Extract image
        let imageUrl = ''
        if (item.enclosure?.url?.startsWith('http')) {
          imageUrl = item.enclosure.url
        }
        
        const mediaContent = (item as any)['media:content']
        if (!imageUrl && mediaContent) {
          imageUrl = Array.isArray(mediaContent) 
            ? mediaContent[0]?.$?.url || ''
            : mediaContent.$?.url || ''
        }

        if (!imageUrl) {
          const mediaThumbnail = (item as any)['media:thumbnail']
          if (mediaThumbnail) {
            imageUrl = Array.isArray(mediaThumbnail) 
              ? mediaThumbnail[0]?.$?.url || ''
              : mediaThumbnail.$?.url || ''
          }
        }

        if (!imageUrl) {
          imageUrl = FALLBACK_IMAGES[feed.category] || FALLBACK_IMAGES.general
        }

        // Insert article
        const { error: insertError } = await supabase
          .from('articles')
          .insert({
            category: feed.category,
            title: item.title,
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