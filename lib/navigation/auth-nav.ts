import type { SafeUser } from '../auth/types'

export type AuthNavMode = 'guest' | 'student' | 'admin'

export type PublicAuthNavItem = {
  href: '/register' | '/login' | '/dashboard' | '/admin'
  label: 'הרשמה' | 'התחברות' | 'פרופיל' | 'ניהול'
}

export type PublicAuthNavigation =
  | {
      mode: 'guest'
      items: [
        { label: 'הרשמה'; href: '/register' },
        { label: 'התחברות'; href: '/login' },
      ]
    }
  | {
      mode: 'student'
      items: [{ label: 'פרופיל'; href: '/dashboard' }]
    }
  | {
      mode: 'admin'
      items: [{ label: 'ניהול'; href: '/admin' }]
    }

export type PublicNavLink = {
  href: string
  label: string
}

const GUEST_AUTH_NAVIGATION: PublicAuthNavigation = {
  mode: 'guest',
  items: [
    { label: 'הרשמה', href: '/register' },
    { label: 'התחברות', href: '/login' },
  ],
}

const STUDENT_AUTH_NAVIGATION: PublicAuthNavigation = {
  mode: 'student',
  items: [{ label: 'פרופיל', href: '/dashboard' }],
}

const ADMIN_AUTH_NAVIGATION: PublicAuthNavigation = {
  mode: 'admin',
  items: [{ label: 'ניהול', href: '/admin' }],
}

export function resolveAuthNavMode(user: SafeUser | null): AuthNavMode {
  if (!user) {
    return 'guest'
  }

  if (user.role === 'admin') {
    return 'admin'
  }

  return 'student'
}

export function buildPublicAuthNavigation(user: SafeUser | null): PublicAuthNavigation {
  const mode = resolveAuthNavMode(user)

  switch (mode) {
    case 'guest':
      return GUEST_AUTH_NAVIGATION
    case 'student':
      return STUDENT_AUTH_NAVIGATION
    case 'admin':
      return ADMIN_AUTH_NAVIGATION
  }
}

export const marketingNavLinks = [
  { href: '/courses', label: 'קורסים' },
  { href: '/private-lessons', label: 'שיעורים פרטיים' },
  { href: '/personal-guidance', label: 'ליווי אישי' },
  { href: '/products', label: 'מוצרים' },
  { href: '/about', label: 'קצת עליי' },
  { href: '/contact', label: 'צור קשר' },
] as const

export function buildPublicNavLinks(authNavigation: PublicAuthNavigation): PublicNavLink[] {
  return [...marketingNavLinks, ...authNavigation.items]
}

export function getAuthNavItems(authNavigation: PublicAuthNavigation): PublicAuthNavItem[] {
  return [...authNavigation.items]
}
