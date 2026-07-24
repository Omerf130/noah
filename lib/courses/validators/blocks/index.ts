import { z } from 'zod'
import { calloutBlockSchema } from './callout'
import { dividerBlockSchema } from './divider'
import { fileBlockSchema } from './file'
import { richTextBlockSchema } from './rich-text'
import { videoBlockSchema } from './video'

export const lessonBlockSchema = z.discriminatedUnion('type', [
  richTextBlockSchema,
  videoBlockSchema,
  fileBlockSchema,
  calloutBlockSchema,
  dividerBlockSchema,
])

export const lessonBlocksSchema = z.array(lessonBlockSchema)

export type LessonBlockInput = z.infer<typeof lessonBlockSchema>

export function parseLessonBlock(input: unknown) {
  return lessonBlockSchema.safeParse(input)
}

export function parseLessonBlocks(input: unknown) {
  return lessonBlocksSchema.safeParse(input)
}

export {
  richTextBlockSchema,
  videoBlockSchema,
  fileBlockSchema,
  calloutBlockSchema,
  dividerBlockSchema,
}
