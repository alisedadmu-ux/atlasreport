import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Missing Supabase keys' }
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, image, category')
    .limit(20)

  if (error) return { success: false, error: error.message }

  const samples = articles.map(a => ({
    id: a.id,
    category: a.category,
    image: a.image,
    hasUnsplash: a.image?.includes('unsplash') || false,
    hasBBC: a.image?.includes('bbci') || false,
    hasGuardian: a.image?.includes('guim') || false,
    hasOther: !a.image?.includes('unsplash') && !a.image?.includes('bbci') && !a.image?.includes('guim')
  }))

  return { success: true, samples, total: articles.length }
})