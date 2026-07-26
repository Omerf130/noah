import { z } from 'zod'

const moduleMoveDirectionSchema = z.enum(['up', 'down'])

export type ModuleMoveDirection = z.infer<typeof moduleMoveDirectionSchema>

export function parseModuleMoveDirection(direction: string) {
  const parsed = moduleMoveDirectionSchema.safeParse(direction)

  if (!parsed.success) {
    return { success: false as const }
  }

  return { success: true as const, direction: parsed.data }
}
