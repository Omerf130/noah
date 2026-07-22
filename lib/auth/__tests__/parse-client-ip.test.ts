import { describe, expect, it } from 'vitest'
import {
  parseClientIpFromForwardedFor,
  normalizeIpAddress,
  isValidIpAddress,
} from '../parse-client-ip'

describe('parseClientIpFromForwardedFor', () => {
  it('parses a valid IPv4 address from x-forwarded-for', () => {
    expect(parseClientIpFromForwardedFor('203.0.113.10, 70.41.3.18')).toBe('203.0.113.10')
  })

  it('parses a valid IPv6 address', () => {
    expect(parseClientIpFromForwardedFor('2001:db8::1')).toBe('2001:db8::1')
  })

  it('trims whitespace around forwarded values', () => {
    expect(parseClientIpFromForwardedFor(' 203.0.113.10 , 70.41.3.18 ')).toBe('203.0.113.10')
  })

  it('falls back to local for malformed forwarded values', () => {
    expect(parseClientIpFromForwardedFor('not-an-ip')).toBe('local')
    expect(parseClientIpFromForwardedFor('')).toBe('local')
    expect(parseClientIpFromForwardedFor(undefined)).toBe('local')
  })
})

describe('normalizeIpAddress', () => {
  it('validates IPv4 and IPv6 addresses', () => {
    expect(isValidIpAddress('192.0.2.1')).toBe(true)
    expect(isValidIpAddress('2001:db8::1')).toBe(true)
    expect(isValidIpAddress('bad-value')).toBe(false)
  })

  it('returns null for malformed addresses', () => {
    expect(normalizeIpAddress('bad-value')).toBeNull()
  })
})
