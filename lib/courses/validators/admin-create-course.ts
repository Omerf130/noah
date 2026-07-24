import { z } from 'zod'
import {
  adminCourseMetadataFormFieldsSchema,
  ALLOWLISTED_COURSE_METADATA_FIELDS,
  parseCourseMetadataFormRaw,
  preserveCourseMetadataValues,
  refineAdminCourseMetadataForm,
  transformToTrustedMetadataInput,
  type CourseMetadataFormValues,
} from './admin-course-metadata-fields'

export const adminCreateCourseFormSchema = adminCourseMetadataFormFieldsSchema
  .superRefine(refineAdminCourseMetadataForm)
  .transform(transformToTrustedMetadataInput)

export type AdminCreateCourseTrustedInput = z.output<typeof adminCreateCourseFormSchema>
export type CreateCourseFormValues = CourseMetadataFormValues

export function extractAllowlistedCreateCourseFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_COURSE_METADATA_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveCreateCourseValues(
  raw: Record<string, FormDataEntryValue | null>,
): CreateCourseFormValues {
  return preserveCourseMetadataValues(raw)
}

export function parseAdminCreateCourseFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminCreateCourseFormSchema.safeParse(parseCourseMetadataFormRaw(raw))
}
