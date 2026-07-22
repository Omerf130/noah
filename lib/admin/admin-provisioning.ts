import { z } from 'zod'
import { normalizeEmail } from '../auth/normalize-email'
import type { UserRole } from '../auth/types'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z\u0590-\u05FF]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number')

const adminEmailSchema = z
  .string()
  .trim()
  .min(1, 'ADMIN_EMAIL is required')
  .email('ADMIN_EMAIL must be a valid email address')
  .transform(normalizeEmail)

const adminNameSchema = z.string().trim().min(2, 'ADMIN_NAME must be at least 2 characters')

export type AdminCreateInput = {
  fullName: string
  email: string
  password: string
}

export type AdminPromotionInput = {
  email: string
}

export type ExistingUserSnapshot = {
  email: string
  role: UserRole
  isActive: boolean
} | null

export type AdminCreateDecision =
  | { type: 'create' }
  | { type: 'existing_admin' }
  | { type: 'existing_student' }
  | { type: 'inactive_user' }

export type AdminPromotionDecision =
  | { type: 'promote' }
  | { type: 'user_not_found' }
  | { type: 'already_admin' }
  | { type: 'inactive_user' }

export function parseAdminCreateInput(input: {
  fullName?: string | null
  email?: string | null
  password?: string | null
}):
  | { success: true; data: AdminCreateInput }
  | { success: false; message: string } {
  const nameResult = adminNameSchema.safeParse(input.fullName ?? '')
  if (!nameResult.success) {
    return { success: false, message: nameResult.error.issues[0]?.message ?? 'Invalid ADMIN_NAME' }
  }

  const emailResult = adminEmailSchema.safeParse(input.email ?? '')
  if (!emailResult.success) {
    return { success: false, message: emailResult.error.issues[0]?.message ?? 'Invalid ADMIN_EMAIL' }
  }

  const passwordResult = passwordSchema.safeParse(input.password ?? '')
  if (!passwordResult.success) {
    return {
      success: false,
      message: passwordResult.error.issues[0]?.message ?? 'Invalid ADMIN_PASSWORD',
    }
  }

  return {
    success: true,
    data: {
      fullName: nameResult.data,
      email: emailResult.data,
      password: passwordResult.data,
    },
  }
}

export function parseAdminPromotionEmail(email?: string | null):
  | { success: true; email: string }
  | { success: false; message: string } {
  const emailResult = adminEmailSchema.safeParse(email ?? '')
  if (!emailResult.success) {
    return { success: false, message: emailResult.error.issues[0]?.message ?? 'Invalid ADMIN_EMAIL' }
  }

  return { success: true, email: emailResult.data }
}

export function decideAdminCreateAction(user: ExistingUserSnapshot): AdminCreateDecision {
  if (!user) {
    return { type: 'create' }
  }

  if (!user.isActive) {
    return { type: 'inactive_user' }
  }

  if (user.role === 'admin') {
    return { type: 'existing_admin' }
  }

  return { type: 'existing_student' }
}

export function decideAdminPromotionAction(user: ExistingUserSnapshot): AdminPromotionDecision {
  if (!user) {
    return { type: 'user_not_found' }
  }

  if (!user.isActive) {
    return { type: 'inactive_user' }
  }

  if (user.role === 'admin') {
    return { type: 'already_admin' }
  }

  return { type: 'promote' }
}

export function isPromotionConfirmed(value?: string | null): boolean {
  return value === 'true'
}
