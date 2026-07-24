import { z } from 'zod'
import { CALLOUT_VARIANTS } from '../../constants'

export const calloutBlockDataSchema = z.object({
  variant: z.enum(CALLOUT_VARIANTS),
  title: z.string().trim().optional(),
  body: z.string().trim().min(1, 'Callout body is required'),
})

export const calloutBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('callout'),
  order: z.number().int().min(0),
  data: calloutBlockDataSchema,
})

export type CalloutBlockInput = z.infer<typeof calloutBlockSchema>
