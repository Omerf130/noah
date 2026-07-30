import type { ZodError } from 'zod'
import type { UpdateLessonFormValues } from '../validators/admin-update-lesson'

export type UpdateLessonActionState = {
  status: 'idle' | 'error' | 'no-op'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: UpdateLessonFormValues
}

export const initialUpdateLessonActionState: UpdateLessonActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_UPDATE_LESSON_ERROR = 'אין לכם הרשאה לעדכן שיעור'
export const INVALID_UPDATE_LESSON_REQUEST_ERROR = 'בקשת העדכון אינה תקינה.'
export const GENERIC_UPDATE_LESSON_ERROR = 'אירעה שגיאה בעדכון השיעור. נסו שוב מאוחר יותר.'
export const NO_CHANGES_MADE_MESSAGE = 'לא בוצעו שינויים.'

export function mapAdminUpdateLessonFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = typeof issue.path[0] === 'string' ? issue.path[0] : undefined

    if (!key) {
      continue
    }

    if (!fieldErrors[key]) {
      fieldErrors[key] = []
    }

    fieldErrors[key].push(issue.message)
  }

  return fieldErrors
}

export function getFirstUpdateLessonFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
