import { z } from 'zod'
import {
  COURSE_CATEGORIES,
  COURSE_DIFFICULTIES,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
  DEFAULT_CURRENCY,
  DRIP_RELEASE_STRATEGIES,
  LOCK_STRATEGIES,
} from '../constants'
import {
  internalNameSchema,
  normalizeInternalName,
  normalizeSlug,
  objectIdSchema,
  optionalObjectIdSchema,
  slugSchema,
} from './shared'

const pricingSchema = z.object({
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  currency: z.string().trim().min(3).max(3).default(DEFAULT_CURRENCY),
})

const seoSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  ogImageAssetId: optionalObjectIdSchema,
})

const dripSettingsSchema = z.object({
  enabled: z.boolean(),
  defaultReleaseStrategy: z.enum(DRIP_RELEASE_STRATEGIES).optional(),
})

const accessRulesSchema = z.object({
  requiresEnrollment: z.boolean(),
  lockStrategy: z.enum(LOCK_STRATEGIES).optional(),
})

export const createCourseSchema = z.object({
  internalName: internalNameSchema.transform(normalizeInternalName),
  title: z.string().trim().min(1, 'Title is required'),
  slug: slugSchema.transform(normalizeSlug),
  category: z.enum(COURSE_CATEGORIES).optional(),
  shortDescription: z.string().trim().min(1, 'Short description is required'),
  longDescription: z.string().trim().default(''),
  thumbnailAssetId: optionalObjectIdSchema,
  coverAssetId: optionalObjectIdSchema,
  pricing: pricingSchema.default({
    price: 0,
    currency: DEFAULT_CURRENCY,
  }),
  status: z.enum(COURSE_STATUSES).default('draft'),
  visibility: z.enum(COURSE_VISIBILITIES).default('private'),
  featured: z.boolean().default(false),
  estimatedDurationMinutes: z.number().int().min(0).optional(),
  difficulty: z.enum(COURSE_DIFFICULTIES).optional(),
  instructorId: objectIdSchema,
  seo: seoSchema.default({}),
  dripSettings: dripSettingsSchema.optional(),
  accessRules: accessRulesSchema.optional(),
})

export const updateCourseSchema = createCourseSchema
  .omit({ internalName: true, instructorId: true })
  .partial()
  .extend({
    slugHistory: z.array(slugSchema).optional(),
    archivedAt: z.coerce.date().nullable().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
  })

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>

export function parseCreateCourseInput(input: unknown) {
  return createCourseSchema.safeParse(input)
}

export function parseUpdateCourseInput(input: unknown) {
  return updateCourseSchema.safeParse(input)
}
