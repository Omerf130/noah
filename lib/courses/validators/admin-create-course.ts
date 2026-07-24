import { z } from 'zod'
import {
  COURSE_CATEGORIES,
  COURSE_DIFFICULTIES,
  COURSE_VISIBILITIES,
  DEFAULT_CURRENCY,
} from '../constants'
import {
  hoursToEstimatedMinutes,
  parseEstimatedDurationHours,
} from '../formatters/duration'
import { normalizeSlug, objectIdSchema, slugSchema } from './shared'

const emptyToUndefined = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  return value
}

const optionalNumberSchema = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, 'הערך חייב להיות מספר שאינו שלילי').optional(),
)

const estimatedDurationHoursSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const parsed = parseEstimatedDurationHours(value)
  if (parsed === undefined) {
    return value
  }

  return parsed
}, z.number().min(0, 'משך הקורס לא יכול להיות שלילי').optional())

export const adminCreateCourseFormSchema = z
  .object({
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
  .superRefine((data, ctx) => {
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
  })
  .transform((data) => ({
    title: data.title,
    slug: data.slug,
    category: data.category,
    shortDescription: data.shortDescription,
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
  }))

export type AdminCreateCourseTrustedInput = z.output<typeof adminCreateCourseFormSchema>

export type CreateCourseFormValues = {
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

const ALLOWLISTED_CREATE_COURSE_FIELDS = [
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

export function extractAllowlistedCreateCourseFields(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | null> = {}

  for (const field of ALLOWLISTED_CREATE_COURSE_FIELDS) {
    raw[field] = formData.get(field)
  }

  return raw
}

export function preserveCreateCourseValues(
  raw: Record<string, FormDataEntryValue | null>,
): CreateCourseFormValues {
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

export function parseAdminCreateCourseFormInput(raw: Record<string, FormDataEntryValue | null>) {
  return adminCreateCourseFormSchema.safeParse({
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
  })
}
