import { defineEventHandler, readBody, createError, getRequestHost } from 'h3'
import Stripe from 'stripe'

const config = useRuntimeConfig()

if (!config.stripeSecretKey) {
  throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured' })
}

const stripe = new Stripe(config.stripeSecretKey as string)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const rawAmount = Number(body?.amount)
  const email = body?.email?.trim()?.toLowerCase() || undefined

  const amount = Math.round(rawAmount)
  if (!amount || amount < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Minimum donation is $1' })
  }
  if (amount > 100000) {
    throw createError({ statusCode: 400, statusMessage: 'Donation amount is too large' })
  }

  const siteUrl = (config.public.siteUrl as string)?.replace(/\/$/, '') ||
    `https://${getRequestHost(event, { xForwardedHost: true })}`

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: amount * 100,
          product_data: {
            name: 'Donation to Atlas Report',
            description: 'Support independent, verified journalism.'
          }
        }
      }
    ],
    allow_promotion_codes: false,
    metadata: {
      source: 'donation',
      amount: String(amount)
    },
    return_url: `${siteUrl}/?donated=success`
  })

  if (!session.client_secret) {
    throw createError({ statusCode: 500, statusMessage: 'Could not create checkout session' })
  }

  return { clientSecret: session.client_secret }
})
