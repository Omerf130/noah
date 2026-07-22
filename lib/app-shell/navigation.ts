import type { UserRole } from '../auth/types'

export type AppNavItem = {
  id: string
  label: string
  href?: string
  disabled?: boolean
}

export type AppShellVariant = 'dashboard' | 'admin'

export const studentNavItems: AppNavItem[] = [
  { id: 'home', label: 'ראשי', href: '/dashboard' },
  { id: 'courses', label: 'הקורסים שלי', disabled: true },
  { id: 'progress', label: 'ההתקדמות שלי', disabled: true },
  { id: 'profile', label: 'הפרופיל שלי', disabled: true },
]

export const adminNavItems: AppNavItem[] = [
  { id: 'overview', label: 'סקירה כללית', href: '/admin' },
  { id: 'users', label: 'ניהול משתמשים', disabled: true },
  { id: 'courses', label: 'ניהול קורסים', disabled: true },
  { id: 'content', label: 'ניהול תוכן', disabled: true },
  { id: 'orders', label: 'הזמנות', disabled: true },
  { id: 'settings', label: 'הגדרות', disabled: true },
]

export function getRoleLabel(role: UserRole): string {
  return role === 'admin' ? 'מנהל/ת' : 'סטודנט/ית'
}

export function getDisplayName(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) {
    return 'משתמש/ת'
  }

  return trimmed.split(/\s+/)[0] ?? trimmed
}

export function getUnauthenticatedRedirectTarget(path: '/dashboard' | '/admin'): string {
  return `/login?returnTo=${encodeURIComponent(path)}`
}

export function canAccessAdminArea(role: UserRole): boolean {
  return role === 'admin'
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === 'student' || role === 'admin'
}

export function getAuthenticatedAuthRedirect(role: UserRole): '/dashboard' | '/admin' {
  return role === 'admin' ? '/admin' : '/dashboard'
}

export function isNavItemInteractive(item: AppNavItem): boolean {
  return Boolean(item.href && !item.disabled)
}

export function getActiveNavItemId(pathname: string, items: AppNavItem[]): string | null {
  const active = items.find((item) => item.href === pathname)
  return active?.id ?? null
}
