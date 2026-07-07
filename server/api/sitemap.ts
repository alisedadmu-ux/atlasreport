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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>https://atlasreport.com${p.loc}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
    ${p.lastmod ? `<lastmod>${new Date(p.lastmod).toISOString()}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  event.node.res.end(sitemap)
})