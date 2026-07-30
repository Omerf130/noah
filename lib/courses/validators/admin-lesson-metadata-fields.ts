import { z } from 'zod'
import { isPublicationStatus } from '../form/module-form-options'
import type { PublicationStatus } from '../types'

export const ALLOWLISTED_LESSON_METADATA_FIELDS = [
  'title',
  'description',
  'publicationStatus',
] as const

export type LessonMetadataFormValues = {
  title: string
  description: string
  publicationStatus: PublicationStatus
}

const lessonTitleSchema = z
  .string()
  .trim()
  .min(1, 'יש להזין שם שיעור')

const lessonDescriptionSchema = z.string().trim()

const lessonPublicationStatusSchema = z
  .string()
  .trim()
  .refine(isPublicationStatus, { message: 'סטטוס פרסום אינו תקין' })
  .transform((value) => value as PublicationStatus)

export const lessonMetadataFormFieldsSchema = z.object({
  title: lessonTitleSchema,
  description: lessonDescriptionSchema,
  publicationStatus: lessonPublicationStatusSchema,
})

export function parseLessonMetadataFormRaw(raw: Record<string, FormDataEntryValue | null>) {
  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    publicationStatus:
      typeof raw.publicationStatus === 'string' ? raw.publicationStatus : 'draft',
  }
}

export function preserveLessonMetadataValues(
  raw: Record<string, FormDataEntryValue | null>,
): LessonMetadataFormValues {
  const parsed = parseLessonMetadataFormRaw(raw)

  return {
    title: parsed.title,
    description: parsed.description,
    publicationStatus: isPublicationStatus(parsed.publicationStatus)
      ? parsed.publicationStatus
      : 'draft',
  }
}

export type AdminLessonMetadataTrustedInput = {
  title: string
  description?: string
  publicationStatus: PublicationStatus
}

export function transformToTrustedLessonMetadataInput(
  values: z.infer<typeof lessonMetadataFormFieldsSchema>,
): AdminLessonMetadataTrustedInput {
  const description = values.description.trim()

  return {
    title: values.title,
    publicationStatus: values.publicationStatus,
    ...(description ? { description } : {}),
  }
}
