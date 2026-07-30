import {
  ALLOWLISTED_LESSON_METADATA_FIELDS,
  lessonMetadataFormFieldsSchema,
  parseLessonMetadataFormRaw,
  preserveLessonMetadataValues,
  transformToTrustedLessonMetadataInput,
  type AdminLessonMetadataTrustedInput,
  type LessonMetadataFormValues,
} from './admin-lesson-metadata-fields'
import { objectIdSchema } from './shared'

export type UpdateLessonFormValues = LessonMetadataFormValues & {
  courseId: string
  moduleId: string
  lessonId: string
}

export type AdminUpdateLessonTrustedInput = AdminLessonMetadataTrustedInput

const ALLOWLISTED_UPDATE_LESSON_FIELDS = [
  ...ALLOWLISTED_LESSON_METADATA_FIELDS,
  'courseId',
  'moduleId',
  'lessonId',
] as const

export const adminUpdateLessonFormSchema = lessonMetadataFormFieldsSchema.transform(
  transformToTrustedLessonMetadataInput,
)

export function extractAllowlistedUpdateLessonFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_UPDATE_LESSON_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveUpdateLessonValues(
  raw: Record<string, FormDataEntryValue | null>,
): UpdateLessonFormValues {
  return {
    ...preserveLessonMetadataValues(raw),
    courseId: typeof raw.courseId === 'string' ? raw.courseId : '',
    moduleId: typeof raw.moduleId === 'string' ? raw.moduleId : '',
    lessonId: typeof raw.lessonId === 'string' ? raw.lessonId : '',
  }
}

export function parseSubmittedUpdateLessonIds(raw: Record<string, FormDataEntryValue | null>) {
  const courseId = objectIdSchema.safeParse(raw.courseId)
  const moduleId = objectIdSchema.safeParse(raw.moduleId)
  const lessonId = objectIdSchema.safeParse(raw.lessonId)

  if (!courseId.success || !moduleId.success || !lessonId.success) {
    return { success: false as const }
  }

  return {
    success: true as const,
    courseId: courseId.data,
    moduleId: moduleId.data,
    lessonId: lessonId.data,
  }
}

export function parseAdminUpdateLessonFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminUpdateLessonFormSchema.safeParse(parseLessonMetadataFormRaw(raw))
}
