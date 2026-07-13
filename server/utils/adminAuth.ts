import { createError, type H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

/**
 * Returns the configured admin email(s). Requires explicit NUXT_ADMIN_EMAIL
 * configuration; returns an empty allowlist when the variable is unset.
 */
export function getAdminEmails(): string[] {
  const configured = process.env.NUXT_ADMIN_EMAIL || ''
  return configured
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Guard an API route so that only an authenticated admin (verified server-side
 * via the Supabase session cookie) can access it. Throws a 401/403 otherwise.
 */
export async function requireAdmin(event: H3Event) {
  let user = null
  try {
    user = await serverSupabaseUser(event)
  } catch {
    user = null
  }

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const email = user.email?.toLowerCase()
  if (!email || !getAdminEmails().includes(email)) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return user
}
