import { objectIdSchema } from './shared'

export function parseModuleIdParam(moduleId: string) {
  const parsed = objectIdSchema.safeParse(moduleId)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, moduleId: parsed.data }
}
