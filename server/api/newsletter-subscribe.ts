import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body?.email?.trim()?.toLowerCase()

  if (!email) {
    return { success: false, error: 'Email is required' }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email format' }
  }

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Server configuration error. Please contact support.' }
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey)

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      if (existing.is_active) {
        return { success: true, message: "You're already subscribed!" }
      } else {
        // Re-activate unsubscribed user
        const { error: reactivateError } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (reactivateError) {
          return { success: false, error: 'Failed to reactivate subscription. Try again later.' }
        }

        return { success: true, message: 'Welcome back! Your subscription has been reactivated.' }
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: true, message: "You're already subscribed!" }
      }
      if (insertError.message?.includes('relation') || insertError.code === '42P01') {
        return { success: false, error: 'Newsletter is not configured yet. Check back soon!' }
      }
      return { success: false, error: 'Something went wrong. Try again later.' }
    }

    return { success: true, message: 'Subscribed! Check your inbox for confirmation.' }
  } catch (e) {
    return { success: false, error: 'Something went wrong. Try again later.' }
  }
})