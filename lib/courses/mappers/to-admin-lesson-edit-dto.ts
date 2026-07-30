import { formatAdminDate, getPublicationStatusLabel } from '../formatters/admin-display'
import type { PublicationStatus } from '../types'
import type { LessonMetadataFormValues } from '../validators/admin-lesson-metadata-fields'

export const LESSON_SLUG_HELPER_TEXT =
  'מזהה מערכת ייחודי לשיעור בתוך הקורס. המזהה נקבע בעת יצירת השיעור ואינו משתנה בעת עריכת השם.'

export type AdminLessonSystemSettingsDto = {
  slug: string
  order: number
  orderLabel: string
  blockCount: number
  blockCountLabel: string
  createdAtLabel: string
  updatedAtLabel: string
}

export type AdminLessonEditDto = LessonMetadataFormValues & {
  courseId: string
  moduleId: string
  lessonId: string
  publicationStatusLabel: string
  systemSettings: AdminLessonSystemSettingsDto
}

export type AdminLessonEditLeanLesson = {
  _id: { toString(): string }
  courseId: { toString(): string }
  moduleId: { toString(): string }
  title: string
  slug: string
  summary?: string | null
  order: number
  status: PublicationStatus
  blockCount: number
  createdAt: Date
  updatedAt: Date
}

export const ADMIN_LESSON_EDIT_DTO_KEYS = [
  'courseId',
  'moduleId',
  'lessonId',
  'title',
  'description',
  'publicationStatus',
  'publicationStatusLabel',
  'systemSettings',
] as const satisfies readonly (keyof AdminLessonEditDto)[]

export const ADMIN_LESSON_SYSTEM_SETTINGS_DTO_KEYS = [
  'slug',
  'order',
  'orderLabel',
  'blockCount',
  'blockCountLabel',
  'createdAtLabel',
  'updatedAtLabel',
] as const satisfies readonly (keyof AdminLessonSystemSettingsDto)[]

export function mapToAdminLessonEditDto(
  courseId: string,
  moduleId: string,
  lesson: AdminLessonEditLeanLesson,
): AdminLessonEditDto {
  const publicationStatus = lesson.status ?? 'draft'
  const blockCount = lesson.blockCount ?? 0

  return {
    courseId,
    moduleId,
    lessonId: lesson._id.toString(),
    title: lesson.title,
    description: lesson.summary?.trim() ?? '',
    publicationStatus,
    publicationStatusLabel: getPublicationStatusLabel(publicationStatus),
    systemSettings: {
      slug: lesson.slug,
      order: lesson.order,
      orderLabel: String(lesson.order),
      blockCount,
      blockCountLabel: String(blockCount),
      createdAtLabel: formatAdminDate(lesson.createdAt),
      updatedAtLabel: formatAdminDate(lesson.updatedAt),
    },
  }
}

export function assertAdminLessonEditDtoSafety(dto: AdminLessonEditDto) {
  for (const key of ADMIN_LESSON_EDIT_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminLessonEditDto is missing required key: ${key}`)
    }
  }

  for (const key of ADMIN_LESSON_SYSTEM_SETTINGS_DTO_KEYS) {
    if (!(key in dto.systemSettings)) {
      throw new Error(`AdminLessonSystemSettingsDto is missing required key: ${key}`)
    }
  }

  if ('blocks' in dto) {
    throw new Error('AdminLessonEditDto must not expose blocks')
  }

  if ('estimatedDurationMinutes' in dto) {
    throw new Error('AdminLessonEditDto must not expose estimatedDurationMinutes')
  }
}
