import { describe, expect, it } from 'vitest'
import {
  buildPublicAuthNavigation,
  buildPublicNavLinks,
  getAuthNavItems,
  resolveAuthNavMode,
} from '../auth-nav'

const studentUser = {
  id: '1',
  fullName: 'Student',
  email: 'student@example.com',
  role: 'student' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const adminUser = {
  id: '2',
  fullName: 'Admin',
  email: 'admin@example.com',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('resolveAuthNavMode', () => {
  it('maps null user to guest', () => {
    expect(resolveAuthNavMode(null)).toBe('guest')
  })

  it('maps student and admin users to nav modes', () => {
    expect(resolveAuthNavMode(studentUser)).toBe('student')
    expect(resolveAuthNavMode(adminUser)).toBe('admin')
  })

  it('does not map unknown roles to admin', () => {
    expect(
      resolveAuthNavMode({
        ...studentUser,
        role: 'superadmin' as 'student',
      }),
    ).toBe('student')
  })
})

describe('buildPublicAuthNavigation', () => {
  it('returns exactly two guest auth items', () => {
    const guestNavigation = buildPublicAuthNavigation(null)

    expect(guestNavigation.mode).toBe('guest')
    expect(guestNavigation.items).toEqual([
      { label: 'הרשמה', href: '/register' },
      { label: 'התחברות', href: '/login' },
    ])
  })

  it('returns exactly one student auth item', () => {
    const studentNavigation = buildPublicAuthNavigation(studentUser)

    expect(studentNavigation.mode).toBe('student')
    expect(studentNavigation.items).toEqual([{ label: 'פרופיל', href: '/dashboard' }])
    expect(studentNavigation.items.some((item) => item.label === 'הרשמה')).toBe(false)
    expect(studentNavigation.items.some((item) => item.label === 'התחברות')).toBe(false)
    expect(studentNavigation.items.some((item) => item.label === 'ניהול')).toBe(false)
  })

  it('returns exactly one admin auth item', () => {
    const adminNavigation = buildPublicAuthNavigation(adminUser)

    expect(adminNavigation.mode).toBe('admin')
    expect(adminNavigation.items).toEqual([{ label: 'ניהול', href: '/admin' }])
    expect(adminNavigation.items.some((item) => item.label === 'הרשמה')).toBe(false)
    expect(adminNavigation.items.some((item) => item.label === 'התחברות')).toBe(false)
    expect(adminNavigation.items.some((item) => item.label === 'פרופיל')).toBe(false)
  })

  it('does not include guest actions for authenticated roles', () => {
    for (const navigation of [
      buildPublicAuthNavigation(studentUser),
      buildPublicAuthNavigation(adminUser),
    ]) {
      expect(navigation.items.some((item) => item.label === 'הרשמה')).toBe(false)
      expect(navigation.items.some((item) => item.label === 'התחברות')).toBe(false)
    }
  })
})

describe('buildPublicNavLinks', () => {
  it('appends auth items after marketing links without duplicates', () => {
    const guestLinks = buildPublicNavLinks(buildPublicAuthNavigation(null))
    const authLabels = guestLinks.filter((link) =>
      ['הרשמה', 'התחברות', 'פרופיל', 'ניהול'].includes(link.label),
    )

    expect(authLabels).toEqual([
      { href: '/register', label: 'הרשמה' },
      { href: '/login', label: 'התחברות' },
    ])
  })

  it('uses the same auth mapping for desktop and mobile consumers', () => {
    const authNavigation = buildPublicAuthNavigation(studentUser)
    const headerItems = getAuthNavItems(authNavigation)
    const footerLinks = buildPublicNavLinks(authNavigation).slice(-1)

    expect(headerItems).toEqual([{ label: 'פרופיל', href: '/dashboard' }])
    expect(footerLinks).toEqual([{ label: 'פרופיל', href: '/dashboard' }])
  })
})
