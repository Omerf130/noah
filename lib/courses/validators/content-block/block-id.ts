import { objectIdSchema } from '../shared'

export function parseBlockIdParam(blockId: string) {
  const parsed = objectIdSchema.safeParse(blockId)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, blockId: parsed.data }
}
