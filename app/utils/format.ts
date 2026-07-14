// Shared formatting and presentation helpers used across the app.

export const ACCENT_COLORS = ['#1E3A5F', '#2E7D5B', '#94651E', '#B23A2E', '#26251F', '#1F6F6F']

export function getInitials(name?: string | null): string {
  const value = name || ''
  return (
    value
      .split(/[ @._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('') || 'AR'
  )
}

export function truncateText(text: string | null | undefined, maxLen: number): string {
  if (!text) return ''
  return text.length > maxLen ? text.substring(0, maxLen).trim() + '…' : text
}

export function formatRelativeTime(timestamp: string | number | Date | null | undefined): string {
  if (timestamp === null || timestamp === undefined) return ''
  const date = new Date(timestamp)
  const diff = Date.now() - date.getTime()
  if (Number.isNaN(diff)) return ''
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Deterministic accent color derived from a string seed so server and client
// render the same value (avoids hydration mismatches from Math.random).
export function getAccentColor(seed?: string | null): string {
  const value = seed || 'AR'
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length]
}

export const CATEGORIES: { id: string; name: string; emoji: string }[] = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

export function dedupeArticles<T extends { title?: string | null }>(list: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of list) {
    const title = (item.title || '').toString().trim().toLowerCase()
    if (!title) {
      out.push(item)
      continue
    }
    if (seen.has(title)) continue
    seen.add(title)
    out.push(item)
  }
  return out
}
export const CATEGORY_GRADIENTS: Record<string, { bg: string; emoji: string }> = {
  general: { bg: 'linear-gradient(135deg, #2A3A4F 0%, #1E3A5F 100%)', emoji: '🌍' },
  technology: { bg: 'linear-gradient(135deg, #2F3A47 0%, #1E3A5F 100%)', emoji: '💻' },
  sports: { bg: 'linear-gradient(135deg, #3A3630 0%, #26251F 100%)', emoji: '⚽' },
  science: { bg: 'linear-gradient(135deg, #2C3A3A 0%, #1E3A5F 100%)', emoji: '🔬' },
  business: { bg: 'linear-gradient(135deg, #3A3326 0%, #94651E 100%)', emoji: '📈' },
  health: { bg: 'linear-gradient(135deg, #323A33 0%, #2E7D5B 100%)', emoji: '🏥' }
}
