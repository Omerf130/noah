import { z } from 'zod'
import { isPublicationStatus } from '../form/module-form-options'
import type { PublicationStatus } from '../types'

export const ALLOWLISTED_MODULE_METADATA_FIELDS = [
  'title',
  'description',
  'publicationStatus',
] as const

export type ModuleMetadataFormValues = {
  title: string
  description: string
  publicationStatus: PublicationStatus
}

const moduleTitleSchema = z
  .string()
  .trim()
  .min(1, 'יש להזין שם פרק')

const moduleDescriptionSchema = z.string().trim()

const modulePublicationStatusSchema = z
  .string()
  .trim()
  .refine(isPublicationStatus, { message: 'סטטוס פרסום אינו תקין' })
  .transform((value) => value as PublicationStatus)

export const moduleMetadataFormFieldsSchema = z.object({
  title: moduleTitleSchema,
  description: moduleDescriptionSchema,
  publicationStatus: modulePublicationStatusSchema,
})

export function parseModuleMetadataFormRaw(raw: Record<string, FormDataEntryValue | null>) {
  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    publicationStatus:
      typeof raw.publicationStatus === 'string' ? raw.publicationStatus : 'draft',
  }
}

export function preserveModuleMetadataValues(
  raw: Record<string, FormDataEntryValue | null>,
): ModuleMetadataFormValues {
  const parsed = parseModuleMetadataFormRaw(raw)

  return {
    title: parsed.title,
    description: parsed.description,
    publicationStatus: isPublicationStatus(parsed.publicationStatus)
      ? parsed.publicationStatus
      : 'draft',
  }
}

export type AdminModuleMetadataTrustedInput = {
  title: string
  description?: string
  publicationStatus: PublicationStatus
}

export function transformToTrustedModuleMetadataInput(
  values: z.infer<typeof moduleMetadataFormFieldsSchema>,
): AdminModuleMetadataTrustedInput {
  const description = values.description.trim()

  return {
    title: values.title,
    publicationStatus: values.publicationStatus,
    ...(description ? { description } : {}),
  }
}
