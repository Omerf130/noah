export function extractRawSessionToken(raw: string | undefined | null): string | null {
  if (!raw || typeof raw !== 'string') {
    return null
  }

  const trimmed = raw.trim()

  if (!trimmed || trimmed.length < 16) {
    return null
  }

  return trimmed
}
