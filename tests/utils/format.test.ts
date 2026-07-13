import { describe, it, expect } from 'vitest'
import { getInitials, truncateText, formatRelativeTime, getAccentColor } from '../../app/utils/format'

describe('getInitials', () => {
  it('returns initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('returns initials from an email', () => {
    expect(getInitials('john@example.com')).toBe('J')
  })

  it('returns AR for null/undefined', () => {
    expect(getInitials(null)).toBe('AR')
    expect(getInitials(undefined)).toBe('AR')
  })

  it('returns AR for empty string', () => {
    expect(getInitials('')).toBe('AR')
  })

  it('handles single name', () => {
    expect(getInitials('John')).toBe('J')
  })
})

describe('truncateText', () => {
  it('returns full text if under max length', () => {
    expect(truncateText('Hello', 10)).toBe('Hello')
  })

  it('truncates and adds ellipsis', () => {
    const result = truncateText('Hello World This Is Long', 10)
    expect(result).toBe('Hello Worl…')
  })

  it('returns empty string for null/undefined', () => {
    expect(truncateText(null, 10)).toBe('')
    expect(truncateText(undefined, 10)).toBe('')
  })
})

describe('formatRelativeTime', () => {
  it('returns "just now" for recent timestamps', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe('just now')
  })

  it('returns minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString()
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago')
  })

  it('returns empty string for null/undefined', () => {
    expect(formatRelativeTime(null)).toBe('')
    expect(formatRelativeTime(undefined)).toBe('')
  })
})

describe('getAccentColor', () => {
  it('returns a color from the palette', () => {
    const color = getAccentColor('test')
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('returns deterministic colors for same input', () => {
    expect(getAccentColor('hello')).toBe(getAccentColor('hello'))
  })

  it('returns a color for null/undefined', () => {
    const color = getAccentColor(null)
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })
})