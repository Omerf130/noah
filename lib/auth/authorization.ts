import type { UserRole } from './types'

export function canAccessDashboard(_role: UserRole): boolean {
  void _role
  return true
}

export function canAccessAdminArea(role: UserRole): boolean {
  return role === 'admin'
}

export function requireAdminRole(role: UserRole): boolean {
  return canAccessAdminArea(role)
}
