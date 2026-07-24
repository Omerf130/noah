import { describe, expect, it } from 'vitest'
import {
  adminNavItems,
  canAccessAdminArea,
  canAccessDashboard,
  getActiveNavItemId,
  getAuthenticatedAuthRedirect,
  getDisplayName,
  getRoleLabel,
  getUnauthenticatedRedirectTarget,
  isNavItemInteractive,
  studentNavItems,
} from '../navigation'

describe('app shell navigation', () => {
  it('defines student navigation with one active home link and disabled future items', () => {
    const interactive = studentNavItems.filter(isNavItemInteractive)

    expect(interactive).toEqual([{ id: 'home', label: 'ראשי', href: '/dashboard' }])
    expect(studentNavItems.filter((item) => item.disabled)).toHaveLength(3)
  })

  it('defines admin navigation with overview and courses links enabled', () => {
    const interactive = adminNavItems.filter(isNavItemInteractive)

    expect(interactive).toEqual([
      { id: 'overview', label: 'סקירה כללית', href: '/admin' },
      { id: 'courses', label: 'קורסים', href: '/admin/courses', icon: 'book' },
    ])
    expect(adminNavItems.filter((item) => item.disabled)).toHaveLength(4)
  })

  it('maps roles to Hebrew labels', () => {
    expect(getRoleLabel('student')).toBe('סטודנט/ית')
    expect(getRoleLabel('admin')).toBe('מנהל/ת')
  })

  it('derives a display name from the first word of fullName', () => {
    expect(getDisplayName('  נועה רכlin  ')).toBe('נועה')
    expect(getDisplayName('')).toBe('משתמש/ת')
  })

  it('activates courses nav for nested admin course routes', () => {
    expect(getActiveNavItemId('/admin/courses', adminNavItems)).toBe('courses')
    expect(getActiveNavItemId('/admin/courses/some-future-route', adminNavItems)).toBe('courses')
    expect(getActiveNavItemId('/admin', adminNavItems)).toBe('overview')
  })
})

describe('app shell access decisions', () => {
  it('allows both students and admins in the dashboard area', () => {
    expect(canAccessDashboard('student')).toBe(true)
    expect(canAccessDashboard('admin')).toBe(true)
  })

  it('restricts admin area to admins only', () => {
    expect(canAccessAdminArea('student')).toBe(false)
    expect(canAccessAdminArea('admin')).toBe(true)
  })

  it('builds static unauthenticated redirect targets', () => {
    expect(getUnauthenticatedRedirectTarget('/dashboard')).toBe('/login?returnTo=%2Fdashboard')
    expect(getUnauthenticatedRedirectTarget('/admin')).toBe('/login?returnTo=%2Fadmin')
  })

  it('redirects authenticated users away from auth pages by role', () => {
    expect(getAuthenticatedAuthRedirect('student')).toBe('/dashboard')
    expect(getAuthenticatedAuthRedirect('admin')).toBe('/admin')
  })
})
