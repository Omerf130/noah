import {
  ALLOWLISTED_MODULE_METADATA_FIELDS,
  moduleMetadataFormFieldsSchema,
  parseModuleMetadataFormRaw,
  preserveModuleMetadataValues,
  transformToTrustedModuleMetadataInput,
  type AdminModuleMetadataTrustedInput,
  type ModuleMetadataFormValues,
} from './admin-module-metadata-fields'
import { objectIdSchema } from './shared'

export type UpdateModuleFormValues = ModuleMetadataFormValues & {
  courseId: string
  moduleId: string
}

export type AdminUpdateModuleTrustedInput = AdminModuleMetadataTrustedInput

const ALLOWLISTED_UPDATE_MODULE_FIELDS = [
  ...ALLOWLISTED_MODULE_METADATA_FIELDS,
  'courseId',
  'moduleId',
] as const

export const adminUpdateModuleFormSchema = moduleMetadataFormFieldsSchema.transform(
  transformToTrustedModuleMetadataInput,
)

export function extractAllowlistedUpdateModuleFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_UPDATE_MODULE_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveUpdateModuleValues(
  raw: Record<string, FormDataEntryValue | null>,
): UpdateModuleFormValues {
  return {
    ...preserveModuleMetadataValues(raw),
    courseId: typeof raw.courseId === 'string' ? raw.courseId : '',
    moduleId: typeof raw.moduleId === 'string' ? raw.moduleId : '',
  }
}

export function parseSubmittedUpdateModuleIds(raw: Record<string, FormDataEntryValue | null>) {
  const courseId = objectIdSchema.safeParse(raw.courseId)
  const moduleId = objectIdSchema.safeParse(raw.moduleId)

  if (!courseId.success || !moduleId.success) {
    return { success: false as const }
  }

  return {
    success: true as const,
    courseId: courseId.data,
    moduleId: moduleId.data,
  }
}

export function parseAdminUpdateModuleFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminUpdateModuleFormSchema.safeParse(parseModuleMetadataFormRaw(raw))
}
