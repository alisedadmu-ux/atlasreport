import { defineEventHandler, getQuery, createError } from 'h3'
import Stripe from 'stripe'

const config = useRuntimeConfig()

if (!config.stripeSecretKey) {
  throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured' })
}

const stripe = new Stripe(config.stripeSecretKey as string)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = query.session_id as string

  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing session_id' })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription', 'customer']
  })

  return {
    status: session.status,
    email: (session.customer_email as string) || session.metadata?.email || '',
    plan: (session.metadata?.plan as string) || 'monthly',
    amount: session.amount_total,
    currency: session.currency
  }
})
