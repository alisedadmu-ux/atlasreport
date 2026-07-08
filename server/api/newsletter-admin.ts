import { defineEventHandler, getQuery } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const action = query.action as string || 'subscribers'

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Server configuration error' }
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    switch (action) {
      case 'subscribers': {
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 50
        const offset = (page - 1) * limit
        const search = query.search as string

        let countQuery = supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true })

        let dataQuery = supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (search) {
          countQuery = countQuery.ilike('email', `%${search}%`)
          dataQuery = dataQuery.ilike('email', `%${search}%`)
        }

        const { count } = await countQuery
        const { data: subscribers, error } = await dataQuery

        if (error) throw error

        return {
          success: true,
          subscribers,
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }

      case 'subscriber-stats': {
        const { data: stats, error } = await supabase
          .from('newsletter_subscribers')
          .select('is_active')

        if (error) throw error

        const total = stats.length
        const active = stats.filter(s => s.is_active).length
        const inactive = total - active

        return {
          success: true,
          stats: { total, active, inactive }
        }
      }

      case 'campaigns': {
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 20
        const offset = (page - 1) * limit

        const { count } = await supabase
          .from('newsletter_campaigns')
          .select('*', { count: 'exact', head: true })

        const { data: campaigns, error } = await supabase
          .from('newsletter_campaigns')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error

        return {
          success: true,
          campaigns,
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }

      case 'campaign': {
        const campaignId = query.id as string
        if (!campaignId) {
          return { success: false, error: 'Campaign ID required' }
        }

        const { data: campaign, error } = await supabase
          .from('newsletter_campaigns')
          .select('*')
          .eq('id', campaignId)
          .single()

        if (error) throw error

        return { success: true, campaign }
      }

      case 'delete-subscriber': {
        const id = query.id as string
        if (!id) {
          return { success: false, error: 'Subscriber ID required' }
        }

        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', id)

        if (error) throw error

        return { success: true, message: 'Subscriber deleted' }
      }

      default:
        return { success: false, error: 'Unknown action' }
    }
  } catch (e) {
    return { success: false, error: 'Failed to fetch data' }
  }
})