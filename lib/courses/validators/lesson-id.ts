import { objectIdSchema } from './shared'

export function parseLessonIdParam(lessonId: string) {
  const parsed = objectIdSchema.safeParse(lessonId)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, lessonId: parsed.data }
}
