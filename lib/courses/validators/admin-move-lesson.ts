import { z } from 'zod'

const lessonMoveDirectionSchema = z.enum(['up', 'down'])

export type LessonMoveDirection = z.infer<typeof lessonMoveDirectionSchema>

export function parseLessonMoveDirection(direction: string) {
  const parsed = lessonMoveDirectionSchema.safeParse(direction)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, direction: parsed.data }
}
