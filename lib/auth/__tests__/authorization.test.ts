import { describe, expect, it } from 'vitest'
import {
  canAccessAdminArea,
  canAccessDashboard,
  requireAdminRole,
} from '../authorization'

describe('authorization helpers', () => {
  it('allows both students and admins to access dashboard areas', () => {
    expect(canAccessDashboard('student')).toBe(true)
    expect(canAccessDashboard('admin')).toBe(true)
  })

  it('restricts admin area access to admins only', () => {
    expect(canAccessAdminArea('student')).toBe(false)
    expect(canAccessAdminArea('admin')).toBe(true)
    expect(requireAdminRole('student')).toBe(false)
    expect(requireAdminRole('admin')).toBe(true)
  })

  it('models student denial for admin-only requirements while keeping admin dashboard access', () => {
    const studentRole = 'student'
    const adminRole = 'admin'

    expect(canAccessDashboard(studentRole)).toBe(true)
    expect(canAccessAdminArea(studentRole)).toBe(false)
    expect(canAccessDashboard(adminRole)).toBe(true)
    expect(canAccessAdminArea(adminRole)).toBe(true)
  })
})
