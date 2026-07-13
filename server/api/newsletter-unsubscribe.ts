import { defineEventHandler, getQuery, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const method = event.method || 'GET'
  const body = method === 'POST' ? await readBody(event) : {}
  const token = (body.token || query.token) as string
  const email = (body.email || query.email) as string

  if (!token && !email) {
    return { success: false, error: 'Missing required parameters' }
  }

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Server configuration error' }
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey)

    let query_builder = supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })

    if (token) {
      query_builder = query_builder.eq('unsubscribe_token', token)
    } else if (email) {
      query_builder = query_builder.eq('email', email.toLowerCase().trim())
    }

    const { data, error } = await query_builder.select('id')

    if (error) {
      return { success: false, error: 'Failed to unsubscribe. Try again later.' }
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Subscriber not found' }
    }

    return { success: true, message: 'You have been unsubscribed successfully.' }
  } catch (e) {
    return { success: false, error: 'Something went wrong. Try again later.' }
  }
})