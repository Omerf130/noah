import { z } from 'zod'
import { objectIdSchema } from '../shared'

export const videoBlockDataSchema = z.object({
  videoAssetId: objectIdSchema,
  caption: z.string().trim().optional(),
  autoplay: z.boolean().optional(),
})

export const videoBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('video'),
  order: z.number().int().min(0),
  data: videoBlockDataSchema,
})

export type VideoBlockInput = z.infer<typeof videoBlockSchema>
