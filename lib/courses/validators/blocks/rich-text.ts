import { z } from 'zod'
import { RICH_TEXT_FORMATS } from '../../constants'

export const richTextBlockDataSchema = z.object({
  format: z.enum(RICH_TEXT_FORMATS),
  content: z.string().min(1, 'Rich text content is required'),
})

export const richTextBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('richText'),
  order: z.number().int().min(0),
  data: richTextBlockDataSchema,
})

export type RichTextBlockInput = z.infer<typeof richTextBlockSchema>
