import type { ZodError } from 'zod'
import type { UpdateCourseFormValues } from '../validators/admin-update-course'

export type UpdateCourseActionState = {
  status: 'idle' | 'error' | 'no-op'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: UpdateCourseFormValues
}

export const initialUpdateCourseActionState: UpdateCourseActionState = {
  status: 'idle',
}

export const DUPLICATE_SLUG_ERROR = 'כתובת הקורס כבר בשימוש'
export const INVALID_INSTRUCTOR_ERROR = 'המדריך שנבחר אינו תקין'
export const INACTIVE_INSTRUCTOR_ERROR = 'המדריך שנבחר אינו פעיל'
export const GENERIC_UPDATE_COURSE_ERROR = 'אירעה שגיאה בעדכון הקורס. נסו שוב מאוחר יותר.'
export const UNAUTHORIZED_UPDATE_COURSE_ERROR = 'אין לכם הרשאה לעדכן קורס'
export const INVALID_UPDATE_COURSE_REQUEST_ERROR = 'בקשת העדכון אינה תקינה.'
export const NO_CHANGES_MADE_MESSAGE = 'לא בוצעו שינויים.'

const PRICING_FIELD_MAP: Record<string, string> = {
  price: 'price',
  salePrice: 'salePrice',
  currency: 'currency',
}

export function mapAdminUpdateCourseFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    let key: string | undefined

    if (issue.path[0] === 'pricing' && typeof issue.path[1] === 'string') {
      key = PRICING_FIELD_MAP[issue.path[1]] ?? issue.path[1]
    } else if (typeof issue.path[0] === 'string') {
      key = issue.path[0]
    }

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

export function getFirstUpdateCourseFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
