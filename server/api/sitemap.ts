import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { error: 'Missing Supabase credentials' }
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: articles } = await supabase
    .from('articles')
    .select('id, published, category')
    .order('published', { ascending: false })

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'hourly' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/auth', priority: '0.4', changefreq: 'monthly' },
    { loc: '/community', priority: '0.6', changefreq: 'daily' },
    { loc: '/search', priority: '0.8', changefreq: 'daily' },
    { loc: '/archives', priority: '0.7', changefreq: 'daily' },
    { loc: '/forgot-password', priority: '0.3', changefreq: 'monthly' }
  ]

  const articlePages = (articles || []).map(a => ({
    loc: `/news/${a.id}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: a.published
  }))

  const allPages = [...staticPages, ...articlePages]

  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://atlasreport.com').replace(/\/$/, '')

  const escapeXml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

  const safeIsoDate = (value: unknown): string => {
    if (!value) return ''
    const time = Date.parse(String(value))
    return Number.isNaN(time) ? '' : new Date(time).toISOString()
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => {
    const lastmod = safeIsoDate((p as { lastmod?: unknown }).lastmod)
    return `  <url>
    <loc>${escapeXml(siteUrl + p.loc)}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>`
  }).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  event.node.res.end(sitemap)
})