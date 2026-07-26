import type { PublicationStatus } from '../types'
import { getPublicationStatusLabel } from '../formatters/admin-display'

export type AdminModuleListItemDto = {
  id: string
  title: string
  description: string | null
  order: number
  positionLabel: string
  publicationStatus: PublicationStatus
  publicationStatusLabel: string
  lessonCount: number
  lessonCountLabel: string
}

export type AdminModuleListItemLeanModule = {
  _id: { toString(): string }
  title: string
  description?: string | null
  order: number
  publicationStatus: PublicationStatus
  lessonCount: number
}

export const ADMIN_MODULE_LIST_ITEM_DTO_KEYS = [
  'id',
  'title',
  'description',
  'order',
  'positionLabel',
  'publicationStatus',
  'publicationStatusLabel',
  'lessonCount',
  'lessonCountLabel',
] as const satisfies readonly (keyof AdminModuleListItemDto)[]

export function mapToAdminModuleListItemDto(
  courseModule: AdminModuleListItemLeanModule,
  position: number,
): AdminModuleListItemDto {
  const lessonCount = courseModule.lessonCount ?? 0

  return {
    id: courseModule._id.toString(),
    title: courseModule.title,
    description: courseModule.description?.trim() || null,
    order: courseModule.order,
    positionLabel: String(position),
    publicationStatus: courseModule.publicationStatus ?? 'draft',
    publicationStatusLabel: getPublicationStatusLabel(
      courseModule.publicationStatus ?? 'draft',
    ),
    lessonCount,
    lessonCountLabel: String(lessonCount),
  }
}

export function assertAdminModuleListItemDtoSafety(dto: AdminModuleListItemDto) {
  for (const key of ADMIN_MODULE_LIST_ITEM_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminModuleListItemDto is missing required key: ${key}`)
    }
  }
}
