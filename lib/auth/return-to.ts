import { RETURN_TO_MAX_LENGTH } from './constants'
import type { UserRole } from './types'

function decodeReturnTo(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export function sanitizeReturnTo(raw: string | null | undefined): string | null {
  if (!raw) {
    return null
  }

  const decoded = decodeReturnTo(raw.trim())

  if (!decoded.startsWith('/') || decoded.startsWith('//')) {
    return null
  }

  if (decoded.includes(':') || decoded.includes('\\')) {
    return null
  }

  if (decoded.length > RETURN_TO_MAX_LENGTH) {
    return null
  }

  const lower = decoded.toLowerCase()
  if (lower.includes('%2f%2f') || lower.includes('%5c')) {
    return null
  }

  return decoded
}

export function isAdminPath(path: string): boolean {
  return path === '/admin' || path.startsWith('/admin/')
}

export function resolveDefaultRedirect(role: UserRole): string {
  return role === 'admin' ? '/admin' : '/dashboard'
}

export function resolveLoginRedirect(role: UserRole, returnTo: string | null): string {
  const safeReturnTo = sanitizeReturnTo(returnTo)

  if (!safeReturnTo) {
    return resolveDefaultRedirect(role)
  }

  if (role === 'student' && isAdminPath(safeReturnTo)) {
    return '/dashboard'
  }

  return safeReturnTo
}
