import {
  ALLOWLISTED_LESSON_METADATA_FIELDS,
  lessonMetadataFormFieldsSchema,
  parseLessonMetadataFormRaw,
  preserveLessonMetadataValues,
  transformToTrustedLessonMetadataInput,
  type AdminLessonMetadataTrustedInput,
  type LessonMetadataFormValues,
} from './admin-lesson-metadata-fields'

export type AdminCreateLessonTrustedInput = AdminLessonMetadataTrustedInput

export const adminCreateLessonFormSchema = lessonMetadataFormFieldsSchema.transform(
  transformToTrustedLessonMetadataInput,
)

export function extractAllowlistedCreateLessonFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_LESSON_METADATA_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveCreateLessonValues(
  raw: Record<string, FormDataEntryValue | null>,
): LessonMetadataFormValues {
  return preserveLessonMetadataValues(raw)
}

export function parseAdminCreateLessonFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminCreateLessonFormSchema.safeParse(parseLessonMetadataFormRaw(raw))
}
