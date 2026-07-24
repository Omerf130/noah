import { z } from 'zod'
import {
  COURSE_CATEGORIES,
  COURSE_DIFFICULTIES,
  COURSE_VISIBILITIES,
  DEFAULT_CURRENCY,
} from '../constants'
import type { CourseCategory, CourseDifficulty, CourseVisibility } from '../types'
import {
  hoursToEstimatedMinutes,
  parseEstimatedDurationHours,
} from '../formatters/duration'
import { normalizeSlug, objectIdSchema, slugSchema } from './shared'

export const emptyToUndefined = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  return value
}

export const optionalNumberSchema = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, 'הערך חייב להיות מספר שאינו שלילי').optional(),
)

export const estimatedDurationHoursSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const parsed = parseEstimatedDurationHours(value)
  if (parsed === undefined) {
    return value
  }

  return parsed
}, z.number().min(0, 'משך הקורס לא יכול להיות שלילי').optional())

export type CourseMetadataFormValues = {
  title: string
  slug: string
  shortDescription: string
  category: string
  price: string
  salePrice: string
  currency: string
  estimatedDurationHours: string
  difficulty: string
  visibility: string
  featured: boolean
  instructorId: string
}

export type AdminCourseMetadataTrustedInput = {
  title: string
  slug: string
  shortDescription: string
  category: CourseCategory
  pricing: {
    price: number
    currency: string
    salePrice?: number
  }
  visibility: CourseVisibility
  featured: boolean
  estimatedDurationMinutes?: number
  difficulty?: CourseDifficulty
  instructorId: string
}

type MetadataFormParsedValues = {
  title: string
  slug: string
  shortDescription: string
  category: CourseCategory
  price: number
  salePrice?: number
  currency: string
  estimatedDurationHours?: number
  difficulty?: CourseDifficulty
  visibility: CourseVisibility
  featured: boolean
  instructorId: string
}

export const adminCourseMetadataFormFieldsSchema = z.object({
  title: z.string().trim().min(1, 'יש להזין שם קורס'),
  slug: slugSchema.transform(normalizeSlug),
  shortDescription: z.string().trim().min(1, 'יש להזין תיאור קצר'),
  category: z.enum(COURSE_CATEGORIES, { message: 'יש לבחור קטגוריה תקינה' }),
  price: z.coerce.number({ message: 'יש להזין מחיר תקין' }).min(0, 'המחיר לא יכול להיות שלילי'),
  salePrice: optionalNumberSchema,
  currency: z
    .string()
    .trim()
    .min(3, 'יש לבחור מטבע')
    .max(3, 'יש לבחור מטבע')
    .default(DEFAULT_CURRENCY),
  estimatedDurationHours: estimatedDurationHoursSchema,
  difficulty: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? undefined : value),
    z.enum(COURSE_DIFFICULTIES).optional(),
  ),
  visibility: z.enum(COURSE_VISIBILITIES).default('private'),
  featured: z.preprocess(
    (value) => value === 'on' || value === true || value === 'true',
    z.boolean(),
  ),
  instructorId: objectIdSchema,
})

export function refineAdminCourseMetadataForm(
  data: MetadataFormParsedValues,
  ctx: z.RefinementCtx,
): void {
  if (data.salePrice !== undefined && data.salePrice >= data.price) {
    ctx.addIssue({
      code: 'custom',
      message: 'מחיר המבצע חייב להיות נמוך ממחיר רגיל',
      path: ['salePrice'],
    })
  }

  if (
    data.estimatedDurationHours !== undefined &&
    parseEstimatedDurationHours(data.estimatedDurationHours) === undefined
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'משך הקורס חייב להיות בקפיצות של רבע שעה',
      path: ['estimatedDurationHours'],
    })
  }
}

export function transformToTrustedMetadataInput(
  data: MetadataFormParsedValues,
): AdminCourseMetadataTrustedInput {
  return {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    category: data.category,
    pricing: {
      price: data.price,
      currency: data.currency,
      ...(data.salePrice !== undefined ? { salePrice: data.salePrice } : {}),
    },
    visibility: data.visibility,
    featured: data.featured,
    ...(data.estimatedDurationHours !== undefined
      ? { estimatedDurationMinutes: hoursToEstimatedMinutes(data.estimatedDurationHours) }
      : {}),
    ...(data.difficulty !== undefined ? { difficulty: data.difficulty } : {}),
    instructorId: data.instructorId,
  }
}

type PersistedCourseMetadata = {
  title: string
  slug: string
  shortDescription: string
  category?: CourseCategory | null
  pricing: {
    price: number
    salePrice?: number | null
    currency: string
  }
  visibility: CourseVisibility
  featured: boolean
  estimatedDurationMinutes?: number | null
  difficulty?: CourseDifficulty | null
  instructorId: { toString(): string } | string
}

function normalizeSalePrice(value: number | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  return value
}

function normalizeDuration(value: number | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  return value
}

function normalizeDifficulty(
  value: CourseDifficulty | null | undefined,
): CourseDifficulty | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  return value
}

export function isTrustedMetadataEqualToCourse(
  trustedInput: AdminCourseMetadataTrustedInput,
  course: PersistedCourseMetadata,
): boolean {
  const instructorId =
    typeof course.instructorId === 'string'
      ? course.instructorId
      : course.instructorId.toString()

  const persistedSalePrice = normalizeSalePrice(course.pricing.salePrice)
  const inputSalePrice = normalizeSalePrice(trustedInput.pricing.salePrice)

  return (
    trustedInput.title === course.title &&
    trustedInput.slug === course.slug &&
    trustedInput.shortDescription === course.shortDescription &&
    trustedInput.category === (course.category ?? undefined) &&
    trustedInput.pricing.price === course.pricing.price &&
    trustedInput.pricing.currency === course.pricing.currency &&
    inputSalePrice === persistedSalePrice &&
    trustedInput.visibility === course.visibility &&
    trustedInput.featured === course.featured &&
    normalizeDuration(trustedInput.estimatedDurationMinutes) ===
      normalizeDuration(course.estimatedDurationMinutes) &&
    normalizeDifficulty(trustedInput.difficulty) === normalizeDifficulty(course.difficulty) &&
    trustedInput.instructorId === instructorId
  )
}

export const ALLOWLISTED_COURSE_METADATA_FIELDS = [
  'title',
  'slug',
  'shortDescription',
  'category',
  'price',
  'salePrice',
  'currency',
  'estimatedDurationHours',
  'difficulty',
  'visibility',
  'featured',
  'instructorId',
] as const

export function preserveCourseMetadataValues(
  raw: Record<string, FormDataEntryValue | null>,
): CourseMetadataFormValues {
  const readString = (key: string) => (typeof raw[key] === 'string' ? raw[key] : '')

  return {
    title: readString('title'),
    slug: readString('slug'),
    shortDescription: readString('shortDescription'),
    category: readString('category'),
    price: readString('price') || '0',
    salePrice: readString('salePrice'),
    currency: readString('currency') || DEFAULT_CURRENCY,
    estimatedDurationHours: readString('estimatedDurationHours'),
    difficulty: readString('difficulty'),
    visibility: readString('visibility') || 'private',
    featured: raw.featured === 'on',
    instructorId: readString('instructorId'),
  }
}

export function parseCourseMetadataFormRaw(raw: Record<string, FormDataEntryValue | null>) {
  return {
    title: raw.title,
    slug: raw.slug,
    shortDescription: raw.shortDescription,
    category: raw.category,
    price: raw.price ?? '0',
    salePrice: raw.salePrice,
    currency: raw.currency ?? DEFAULT_CURRENCY,
    estimatedDurationHours: raw.estimatedDurationHours,
    difficulty: raw.difficulty,
    visibility: raw.visibility ?? 'private',
    featured: raw.featured,
    instructorId: raw.instructorId,
  }
}
