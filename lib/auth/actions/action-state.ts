import type { ZodError } from 'zod'
import type { RateLimitStatus } from '../rate-limit-helpers'

export type AuthActionState = {
  success: boolean
  fieldErrors?: Record<string, string[]>
  formError?: string
  values?: {
    fullName?: string
    email?: string
  }
}

export const initialAuthActionState: AuthActionState = {
  success: false,
}

export function mapZodFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]

    if (typeof key !== 'string') {
      continue
    }

    if (!fieldErrors[key]) {
      fieldErrors[key] = []
    }

    fieldErrors[key].push(issue.message)
  }

  return fieldErrors
}

export function getFirstFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}

export function formatRateLimitFormError(status: RateLimitStatus): string {
  if (status.retryAfterSeconds > 0) {
    return `יותר מדי ניסיונות. נסו שוב בעוד ${status.retryAfterSeconds} שניות.`
  }

  return 'יותר מדי ניסיונות. נסו שוב בעוד מספר דקות.'
}

export const GENERIC_AUTH_ERROR = 'אירעה שגיאה. נסו שוב מאוחר יותר.'
export const GENERIC_LOGIN_ERROR = 'אימייל או סיסמה שגויים'
export const DUPLICATE_EMAIL_ERROR = 'כתובת האימייל כבר בשימוש'
export const REGISTRATION_SESSION_ERROR =
  'החשבון נוצר, אך לא הצלחנו להתחבר אוטומטית. נסו להתחבר עם האימייל והסיסמה שלכם.'
