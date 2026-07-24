import type { UserRole } from '../auth/types'

export type AppNavIconName = 'book' | 'calendar' | 'heart' | 'checklist' | 'sparkle' | 'chart'

export type AppNavItem = {
  id: string
  label: string
  href?: string
  disabled?: boolean
  icon?: AppNavIconName
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
  { id: 'courses', label: 'קורסים', href: '/admin/courses', icon: 'book' },
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
  const exactMatch = items.find((item) => item.href === pathname)
  if (exactMatch) {
    return exactMatch.id
  }

  const prefixMatches = items
    .filter((item) => item.href && item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
    .sort((left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0))

  return prefixMatches[0]?.id ?? null
}

export function isNavItemActive(pathname: string, item: AppNavItem, items: AppNavItem[]): boolean {
  return getActiveNavItemId(pathname, items) === item.id
}
