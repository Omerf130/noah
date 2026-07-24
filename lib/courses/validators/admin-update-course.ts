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
import { objectIdSchema } from './shared'

export type UpdateCourseFormValues = CourseMetadataFormValues & {
  courseId: string
}

export type AdminUpdateCourseTrustedInput = z.output<typeof adminUpdateCourseFormSchema>

const ALLOWLISTED_UPDATE_COURSE_FIELDS = [...ALLOWLISTED_COURSE_METADATA_FIELDS, 'courseId'] as const

export const adminUpdateCourseFormSchema = adminCourseMetadataFormFieldsSchema
  .superRefine(refineAdminCourseMetadataForm)
  .transform(transformToTrustedMetadataInput)

export function extractAllowlistedUpdateCourseFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_UPDATE_COURSE_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveUpdateCourseValues(
  raw: Record<string, FormDataEntryValue | null>,
): UpdateCourseFormValues {
  return {
    ...preserveCourseMetadataValues(raw),
    courseId: typeof raw.courseId === 'string' ? raw.courseId : '',
  }
}

export function parseSubmittedUpdateCourseId(raw: Record<string, FormDataEntryValue | null>) {
  return objectIdSchema.safeParse(raw.courseId)
}

export function parseAdminUpdateCourseFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminUpdateCourseFormSchema.safeParse(parseCourseMetadataFormRaw(raw))
}
