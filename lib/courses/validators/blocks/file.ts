import { z } from 'zod'
import { objectIdSchema } from '../shared'

export const fileBlockDataSchema = z.object({
  mediaAssetId: objectIdSchema,
  label: z.string().trim().min(1, 'File label is required'),
  allowDownload: z.boolean(),
})

export const fileBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('file'),
  order: z.number().int().min(0),
  data: fileBlockDataSchema,
})

export type FileBlockInput = z.infer<typeof fileBlockSchema>
