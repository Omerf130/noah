import { isPublicationStatus } from '../form/module-form-options'
import { getPublicationStatusLabel } from '../formatters/admin-display'
import type { PublicationStatus } from '../types'

export type AdminLessonListItemDto = {
  id: string
  title: string
  description: string | null
  order: number
  positionLabel: string
  publicationStatus: PublicationStatus
  publicationStatusLabel: string
  blockCount: number
  blockCountLabel: string
}

export type AdminLessonListItemLeanLesson = {
  _id: { toString(): string }
  title: string
  summary?: string | null
  order: number
  status?: string
  blocks?: unknown[] | null
}

export const ADMIN_LESSON_LIST_ITEM_DTO_KEYS = [
  'id',
  'title',
  'description',
  'order',
  'positionLabel',
  'publicationStatus',
  'publicationStatusLabel',
  'blockCount',
  'blockCountLabel',
] as const satisfies readonly (keyof AdminLessonListItemDto)[]

function mapLessonStatusToPublicationStatus(status: string | undefined): PublicationStatus {
  if (status && isPublicationStatus(status)) {
    return status
  }

  return 'draft'
}

export function mapToAdminLessonListItemDto(
  lesson: AdminLessonListItemLeanLesson,
  position: number,
  blockCount = lesson.blocks?.length ?? 0,
): AdminLessonListItemDto {
  const publicationStatus = mapLessonStatusToPublicationStatus(lesson.status)

  return {
    id: lesson._id.toString(),
    title: lesson.title,
    description: lesson.summary?.trim() || null,
    order: lesson.order,
    positionLabel: String(position),
    publicationStatus,
    publicationStatusLabel: getPublicationStatusLabel(publicationStatus),
    blockCount,
    blockCountLabel: String(blockCount),
  }
}

export function assertAdminLessonListItemDtoSafety(dto: AdminLessonListItemDto) {
  for (const key of ADMIN_LESSON_LIST_ITEM_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminLessonListItemDto is missing required key: ${key}`)
    }
  }
}
