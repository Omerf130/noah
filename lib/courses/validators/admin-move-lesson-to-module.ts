import { objectIdSchema } from './shared'

export function parseMoveLessonToModuleTargetId(targetModuleId: string) {
  const parsed = objectIdSchema.safeParse(targetModuleId)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, targetModuleId: parsed.data }
}
