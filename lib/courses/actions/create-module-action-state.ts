import type { ZodError } from 'zod'
import type { ModuleMetadataFormValues } from '../validators/admin-module-metadata-fields'

export type CreateModuleActionState = {
  status: 'idle' | 'error'
  message?: string
  fieldErrors?: Record<string, string[]>
  values?: ModuleMetadataFormValues
}

export const initialCreateModuleActionState: CreateModuleActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_CREATE_MODULE_ERROR = 'אין לכם הרשאה ליצור פרק'
export const INVALID_CREATE_MODULE_REQUEST_ERROR = 'בקשת יצירת הפרק אינה תקינה.'
export const GENERIC_CREATE_MODULE_ERROR = 'אירעה שגיאה ביצירת הפרק. נסו שוב מאוחר יותר.'
export const DUPLICATE_MODULE_IDENTIFIER_ERROR =
  'לא ניתן ליצור פרק עם מזהה מערכת זה. נסו שם אחר.'

export function mapAdminCreateModuleFieldErrors(error: ZodError): Record<string, string[]> {
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

export function getFirstCreateModuleFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
