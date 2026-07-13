import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { subject, content, testEmail } = body

  if (!subject || !content) {
    return { success: false, error: 'Subject and content are required' }
  }

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_KEY
  const resendApiKey = process.env.RESEND_API_KEY

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Server configuration error' }
  }

  if (!resendApiKey) {
    return { success: false, error: 'Email service not configured. Set RESEND_API_KEY in .env' }
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey)

    // If test email, just send to that one email
    if (testEmail) {
      const emailResult = await sendEmail(resendApiKey, testEmail, subject, buildEmailContent(content, `${getBaseUrl(event)}/unsubscribe`))
      if (!emailResult.success) {
        return { success: false, error: emailResult.error }
      }
      return { success: true, message: `Test email sent to ${testEmail}` }
    }

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, unsubscribe_token')
      .eq('is_active', true)

    if (subError) {
      return { success: false, error: 'Failed to fetch subscribers' }
    }

    if (!subscribers || subscribers.length === 0) {
      return { success: false, error: 'No active subscribers' }
    }

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .insert({
        subject,
        content,
        status: 'sending',
        sent_count: 0
      })
      .select()
      .single()

    if (campaignError) {
      return { success: false, error: 'Failed to create campaign' }
    }

    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50
    let sentCount = 0
    const errors: string[] = []

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const promises = batch.map(async (sub) => {
        const unsubscribeUrl = `${getBaseUrl(event)}/unsubscribe?token=${sub.unsubscribe_token}`
        const emailContent = buildEmailContent(content, unsubscribeUrl)
        return sendEmail(resendApiKey, sub.email, subject, emailContent)
      })

      const results = await Promise.allSettled(promises)
      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value.success) {
          sentCount++
        } else {
          const sub = batch[idx]
          errors.push(`Failed to send to ${sub.email}`)
        }
      })
    }

    // Update campaign status
    await supabase
      .from('newsletter_campaigns')
      .update({
        status: sentCount > 0 ? 'sent' : 'failed',
        sent_count: sentCount,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaign.id)

    return {
      success: true,
      message: `Newsletter sent to ${sentCount} of ${subscribers.length} subscribers`,
      campaignId: campaign.id,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined
    }
  } catch (e) {
    return { success: false, error: 'Something went wrong. Try again later.' }
  }
})

async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  try {
    const fromAddress = process.env.NUXT_NEWSLETTER_FROM
      || process.env.NUXT_PUBLIC_NEWSLETTER_FROM
      || 'Atlas Report <newsletter@atlasreport.com>'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html
      })
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.message || 'Failed to send email' }
    }
    return { success: true, id: data.id }
  } catch (e) {
    return { success: false, error: 'Network error sending email' }
  }
}

function buildEmailContent(content: string, unsubscribeUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Georgia', serif; background-color: #fcfbf7; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fcfbf7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #111111; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-family: 'Cinzel', serif; font-size: 28px; margin: 0; letter-spacing: 2px;">ATLAS REPORT</h1>
              <p style="color: #888888; font-size: 11px; margin: 5px 0 0; letter-spacing: 3px; text-transform: uppercase;">Global Intelligence Feed</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px; color: #333333; font-size: 16px; line-height: 1.8;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                You're receiving this because you subscribed to the Atlas Report newsletter.
              </p>
              <p style="margin: 10px 0 0;">
                <a href="${unsubscribeUrl}" style="color: #a30000; font-size: 12px; text-decoration: underline;">
                  Unsubscribe from this list
                </a>
              </p>
              <p style="color: #bbbbbb; font-size: 11px; margin: 10px 0 0;">
                &copy; ${new Date().getFullYear()} Atlas Report. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function getBaseUrl(event: any): string {
  const configured = process.env.NUXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')
  const headers = event.node?.req?.headers
  const host = headers?.host || 'localhost:3000'
  const protocol = headers?.['x-forwarded-proto'] || 'http'
  return `${protocol}://${host}`
}