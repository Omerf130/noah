import { formatAdminDate, getPublicationStatusLabel } from '../formatters/admin-display'
import type { PublicationStatus } from '../types'
import type { ModuleMetadataFormValues } from '../validators/admin-module-metadata-fields'

export const MODULE_SLUG_HELPER_TEXT =
  'מזהה מערכת ייחודי לפרק בתוך הקורס. המזהה נקבע בעת יצירת הפרק ואינו משתנה בעת עריכת השם.'

export type AdminModuleSystemSettingsDto = {
  slug: string
  createdAtLabel: string
  updatedAtLabel: string
}

export type AdminModuleEditDto = ModuleMetadataFormValues & {
  courseId: string
  moduleId: string
  publicationStatusLabel: string
  systemSettings: AdminModuleSystemSettingsDto
}

export type AdminModuleEditLeanModule = {
  _id: { toString(): string }
  courseId: { toString(): string }
  title: string
  slug: string
  description?: string | null
  publicationStatus: PublicationStatus
  createdAt: Date
  updatedAt: Date
}

export const ADMIN_MODULE_EDIT_DTO_KEYS = [
  'courseId',
  'moduleId',
  'title',
  'description',
  'publicationStatus',
  'publicationStatusLabel',
  'systemSettings',
] as const satisfies readonly (keyof AdminModuleEditDto)[]

export const ADMIN_MODULE_SYSTEM_SETTINGS_DTO_KEYS = [
  'slug',
  'createdAtLabel',
  'updatedAtLabel',
] as const satisfies readonly (keyof AdminModuleSystemSettingsDto)[]

export function mapToAdminModuleEditDto(
  courseId: string,
  courseModule: AdminModuleEditLeanModule,
): AdminModuleEditDto {
  return {
    courseId,
    moduleId: courseModule._id.toString(),
    title: courseModule.title,
    description: courseModule.description?.trim() ?? '',
    publicationStatus: courseModule.publicationStatus ?? 'draft',
    publicationStatusLabel: getPublicationStatusLabel(courseModule.publicationStatus ?? 'draft'),
    systemSettings: {
      slug: courseModule.slug,
      createdAtLabel: formatAdminDate(courseModule.createdAt),
      updatedAtLabel: formatAdminDate(courseModule.updatedAt),
    },
  }
}

export function assertAdminModuleEditDtoSafety(dto: AdminModuleEditDto) {
  for (const key of ADMIN_MODULE_EDIT_DTO_KEYS) {
    if (!(key in dto)) {
      throw new Error(`AdminModuleEditDto is missing required key: ${key}`)
    }
  }

  for (const key of ADMIN_MODULE_SYSTEM_SETTINGS_DTO_KEYS) {
    if (!(key in dto.systemSettings)) {
      throw new Error(`AdminModuleSystemSettingsDto is missing required key: ${key}`)
    }
  }

  if ('slug' in dto) {
    throw new Error('AdminModuleEditDto must not expose slug outside systemSettings')
  }
}
