import { z } from 'zod'
import { LESSON_STATUSES, RELEASE_RULE_TYPES } from '../constants'
import { normalizeSlug, objectIdSchema, slugSchema } from './shared'
import { lessonBlocksSchema } from './blocks'

const releaseRuleSchema = z.object({
  type: z.enum(RELEASE_RULE_TYPES),
  value: z.union([z.number(), z.coerce.date(), z.string()]).optional(),
})

export const createLessonSchema = z.object({
  title: z.string().trim().min(1, 'Lesson title is required'),
  slug: slugSchema.transform(normalizeSlug),
  summary: z.string().trim().optional(),
  order: z.number().int().min(0).optional(),
  blocks: lessonBlocksSchema.default([]),
  estimatedDurationMinutes: z.number().int().min(0).optional(),
  quizId: objectIdSchema.optional(),
  prerequisiteLessonIds: z.array(objectIdSchema).optional(),
  releaseRule: releaseRuleSchema.optional(),
  isPreviewFree: z.boolean().optional(),
  status: z.enum(LESSON_STATUSES).default('draft'),
})

export const updateLessonSchema = createLessonSchema.partial()

export const reorderLessonsSchema = z.object({
  orderedLessonIds: z.array(z.string().trim().min(1)).min(1),
})

export const updateLessonBlocksSchema = z.object({
  blocks: lessonBlocksSchema,
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>
export type UpdateLessonBlocksInput = z.infer<typeof updateLessonBlocksSchema>

export function parseCreateLessonInput(input: unknown) {
  return createLessonSchema.safeParse(input)
}

export function parseUpdateLessonInput(input: unknown) {
  return updateLessonSchema.safeParse(input)
}

export function parseReorderLessonsInput(input: unknown) {
  return reorderLessonsSchema.safeParse(input)
}

export function parseUpdateLessonBlocksInput(input: unknown) {
  return updateLessonBlocksSchema.safeParse(input)
}
