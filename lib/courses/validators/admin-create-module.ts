import {
  ALLOWLISTED_MODULE_METADATA_FIELDS,
  moduleMetadataFormFieldsSchema,
  parseModuleMetadataFormRaw,
  preserveModuleMetadataValues,
  transformToTrustedModuleMetadataInput,
  type AdminModuleMetadataTrustedInput,
  type ModuleMetadataFormValues,
} from './admin-module-metadata-fields'

export type AdminCreateModuleTrustedInput = AdminModuleMetadataTrustedInput

export const adminCreateModuleFormSchema = moduleMetadataFormFieldsSchema.transform(
  transformToTrustedModuleMetadataInput,
)

export function extractAllowlistedCreateModuleFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_MODULE_METADATA_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveCreateModuleValues(
  raw: Record<string, FormDataEntryValue | null>,
): ModuleMetadataFormValues {
  return preserveModuleMetadataValues(raw)
}

export function parseAdminCreateModuleFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminCreateModuleFormSchema.safeParse(parseModuleMetadataFormRaw(raw))
}

export function parseAdminCreateModuleFormInputIgnoringForgedFields(
  raw: Record<string, FormDataEntryValue | null>,
) {
  const sanitized = parseModuleMetadataFormRaw(raw)
  return adminCreateModuleFormSchema.safeParse(sanitized)
}
