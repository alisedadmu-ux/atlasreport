import { defineEventHandler, readBody, createError, getRequestHost } from 'h3'
import Stripe from 'stripe'

const config = useRuntimeConfig()

if (!config.stripeSecretKey) {
  throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured' })
}

const stripe = new Stripe(config.stripeSecretKey as string)

const PLANS = {
  monthly: {
    amount: 700,
    interval: 'month',
    label: 'Atlas Report Premium — Monthly'
  },
  yearly: {
    amount: 7000,
    interval: 'year',
    label: 'Atlas Report Premium — Annual'
  }
} as const

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body?.email?.trim()?.toLowerCase()
  const plan = (body?.plan as keyof typeof PLANS) || 'monthly'

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  }

  const selected = PLANS[plan] ?? PLANS.monthly

  const siteUrl = (config.public.siteUrl as string)?.replace(/\/$/, '') ||
    `https://${getRequestHost(event, { xForwardedHost: true })}`

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: selected.amount,
          recurring: { interval: selected.interval },
          product_data: {
            name: selected.label,
            description: 'Premium newsletter subscription with exclusive briefs and analysis.'
          }
        }
      }
    ],
    allow_promotion_codes: true,
    metadata: {
      email,
      plan,
      source: 'newsletter'
    },
    return_url: `${siteUrl}/?subscribed=success`
  })

  if (!session.client_secret) {
    throw createError({ statusCode: 500, statusMessage: 'Could not create checkout session' })
  }

  return { clientSecret: session.client_secret }
})
