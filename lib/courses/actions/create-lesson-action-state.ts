import type { ZodError } from 'zod'
import type { LessonMetadataFormValues } from '../validators/admin-lesson-metadata-fields'

export type CreateLessonActionState = {
  status: 'idle' | 'error'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: LessonMetadataFormValues
}

export const initialCreateLessonActionState: CreateLessonActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_CREATE_LESSON_ERROR = 'אין לכם הרשאה ליצור שיעור'
export const INVALID_CREATE_LESSON_REQUEST_ERROR = 'בקשת יצירת השיעור אינה תקינה.'
export const GENERIC_CREATE_LESSON_ERROR = 'אירעה שגיאה ביצירת השיעור. נסו שוב מאוחר יותר.'
export const DUPLICATE_LESSON_IDENTIFIER_ERROR =
  'לא ניתן ליצור שיעור עם מזהה מערכת זה. נסו שם אחר.'

export function mapAdminCreateLessonFieldErrors(error: ZodError): Record<string, string[]> {
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

export function getFirstCreateLessonFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
