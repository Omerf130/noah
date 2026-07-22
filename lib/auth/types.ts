export type UserRole = 'student' | 'admin'

export type SafeUser = {
  id: string
  fullName: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type AuthActionResult =
  | { success: true }
  | {
      success: false
      fieldErrors?: Partial<Record<string, string>>
      formError?: string
    }
