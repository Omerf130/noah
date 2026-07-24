import { z } from 'zod'

export const dividerBlockDataSchema = z.object({})

export const dividerBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('divider'),
  order: z.number().int().min(0),
  data: dividerBlockDataSchema,
})

export type DividerBlockInput = z.infer<typeof dividerBlockSchema>
