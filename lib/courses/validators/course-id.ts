import { objectIdSchema } from './shared'

export function parseCourseIdParam(courseId: string) {
  const parsed = objectIdSchema.safeParse(courseId)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, courseId: parsed.data }
}
