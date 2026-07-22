import { isIP } from 'net'

const LOCAL_FALLBACK_IP = 'local'

export function isValidIpAddress(value: string): boolean {
  return isIP(value.trim()) !== 0
}

export function normalizeIpAddress(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed || !isValidIpAddress(trimmed)) {
    return null
  }

  if (isIP(trimmed) === 6) {
    return trimmed.toLowerCase()
  }

  return trimmed
}

/**
 * Extracts the left-most forwarded address from x-forwarded-for.
 * Assumes a trusted reverse proxy (for example Vercel) sets the header.
 * Outside trusted proxy environments this value can be spoofed.
 */
export function parseClientIpFromForwardedFor(
  forwardedFor: string | null | undefined,
  fallback: string = LOCAL_FALLBACK_IP,
): string {
  if (!forwardedFor?.trim()) {
    return fallback
  }

  const firstHop = forwardedFor.split(',')[0]?.trim()

  if (!firstHop) {
    return fallback
  }

  return normalizeIpAddress(firstHop) ?? fallback
}
