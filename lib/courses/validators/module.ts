import { z } from 'zod'
import { RELEASE_RULE_TYPES } from '../constants'
import { normalizeSlug, slugSchema } from './shared'

const releaseRuleSchema = z.object({
  type: z.enum(RELEASE_RULE_TYPES),
  value: z.union([z.number(), z.coerce.date(), z.string()]).optional(),
})

export const createModuleSchema = z.object({
  title: z.string().trim().min(1, 'Module title is required'),
  slug: slugSchema.transform(normalizeSlug),
  description: z.string().trim().optional(),
  order: z.number().int().min(0).optional(),
  releaseRule: releaseRuleSchema.optional(),
  isLockedByDefault: z.boolean().optional(),
})

export const updateModuleSchema = createModuleSchema.partial()

export const reorderModulesSchema = z.object({
  orderedModuleIds: z.array(z.string().trim().min(1)).min(1),
})

export type CreateModuleInput = z.infer<typeof createModuleSchema>
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>
export type ReorderModulesInput = z.infer<typeof reorderModulesSchema>

export function parseCreateModuleInput(input: unknown) {
  return createModuleSchema.safeParse(input)
}

export function parseUpdateModuleInput(input: unknown) {
  return updateModuleSchema.safeParse(input)
}

export function parseReorderModulesInput(input: unknown) {
  return reorderModulesSchema.safeParse(input)
}
