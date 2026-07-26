import type { ZodError } from 'zod'
import type { UpdateModuleFormValues } from '../validators/admin-update-module'

export type UpdateModuleActionState = {
  status: 'idle' | 'error' | 'no-op'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: UpdateModuleFormValues
}

export const initialUpdateModuleActionState: UpdateModuleActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_UPDATE_MODULE_ERROR = 'אין לכם הרשאה לעדכן פרק'
export const INVALID_UPDATE_MODULE_REQUEST_ERROR = 'בקשת העדכון אינה תקינה.'
export const GENERIC_UPDATE_MODULE_ERROR = 'אירעה שגיאה בעדכון הפרק. נסו שוב מאוחר יותר.'
export const NO_CHANGES_MADE_MESSAGE = 'לא בוצעו שינויים.'

export function mapAdminUpdateModuleFieldErrors(error: ZodError): Record<string, string[]> {
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

export function getFirstUpdateModuleFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
