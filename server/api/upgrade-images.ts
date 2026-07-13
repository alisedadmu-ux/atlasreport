import { defineEventHandler, readBody, getRequestHeader, getMethod, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

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

const FALLBACK_IMAGES: Record<string, string> = {
  general: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=90&w=1600&fm=webp',
  technology: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=90&w=1600&fm=webp',
  sports: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=90&w=1600&fm=webp',
  science: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=90&w=1600&fm=webp',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=90&w=1600&fm=webp',
  health: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=90&w=1600&fm=webp'
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  assertOrigin(event)

  await requireAdmin(event)

  const body = method === 'POST' ? await readBody(event) : {}
  const _csrf = (body as any)?.csrf_token

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Missing Supabase keys' }
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, image, category')

  if (error) return { success: false, error: error.message }

  let updated = 0
  for (const article of articles) {
    let newImage = article.image

    // Force-upgrade ALL Unsplash images to high quality
    if (article.image && article.image.includes('images.unsplash.com')) {
      const baseUrl = article.image.split('?')[0]
      newImage = `${baseUrl}?q=90&w=1600&fm=webp`
    }

    // Force-upgrade ALL BBC/Guardian images to use larger size
    if (article.image && article.image.includes('ichef.bbci.co.uk')) {
      newImage = article.image.replace(/\d+/g, (match) => {
        // Replace width/height numbers with larger values
        if (match === '800' || match === '640' || match === '480' || match === '320') return '1600'
        if (match === '600' || match === '450' || match === '300') return '1200'
        return match
      })
    }

    if (article.image && article.image.includes('media.guim.co.uk')) {
      newImage = article.image.replace(/\d+\.jpg/g, '1600.jpg')
    }

    if (newImage !== article.image) {
      await supabase
        .from('articles')
        .update({ image: newImage })
        .eq('id', article.id)
      updated++
    }
  }

  return {
    success: true,
    message: `Upgraded ${updated} article images to high quality`,
    total: articles.length,
    updated
  }
})
