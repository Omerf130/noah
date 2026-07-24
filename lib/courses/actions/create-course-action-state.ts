import type { ZodError } from 'zod'
import type { CreateCourseFormValues } from '../validators/admin-create-course'

export type CreateCourseActionState = {
  status: 'idle' | 'error'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: CreateCourseFormValues
}

export const initialCreateCourseActionState: CreateCourseActionState = {
  status: 'idle',
}

export const DUPLICATE_SLUG_ERROR = 'כתובת הקורס כבר בשימוש'
export const DUPLICATE_SLUG_AS_INTERNAL_ERROR =
  'כתובת הקורס כבר בשימוש כמזהה פנימי. בחרו כתובת אחרת.'
export const DUPLICATE_COURSE_IDENTIFIER_ERROR = 'קורס עם מזהה זה כבר קיים'
export const INVALID_INSTRUCTOR_ERROR = 'המדריך שנבחר אינו תקין'
export const INACTIVE_INSTRUCTOR_ERROR = 'המדריך שנבחר אינו פעיל'
export const GENERIC_CREATE_COURSE_ERROR = 'אירעה שגיאה ביצירת הקורס. נסו שוב מאוחר יותר.'
export const UNAUTHORIZED_CREATE_COURSE_ERROR = 'אין לכם הרשאה ליצור קורס'

const PRICING_FIELD_MAP: Record<string, string> = {
  price: 'price',
  salePrice: 'salePrice',
  currency: 'currency',
}

export function mapAdminCreateCourseFieldErrors(error: ZodError): Record<string, string[]> {
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

export function getFirstCreateCourseFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
