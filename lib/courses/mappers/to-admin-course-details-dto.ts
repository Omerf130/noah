import type { CourseCategory, CourseDifficulty, CourseStatus, CourseVisibility } from '../types'
import { formatEstimatedDuration } from '../formatters/duration'
import {
  formatCoursePriceDisplay,
  type CoursePriceDisplay,
} from '../formatters/course-pricing-display'
import {
  formatAdminDate,
  formatFeaturedLabel,
  formatUserDisplayName,
  getCourseCategoryLabel,
  getCourseDifficultyLabel,
  getCourseStatusLabel,
  getCourseVisibilityLabel,
} from '../formatters/admin-display'

export const INTERNAL_NAME_HELPER_TEXT =
  'מזהה טכני קבוע המשמש את המערכת ואינו מוצג לסטודנטים.'

export type AdminCourseDetailsDto = {
  id: string
  title: string
  shortDescription: string
  category: CourseCategory | null
  categoryLabel: string | null
  status: CourseStatus
  statusLabel: string
  visibility: CourseVisibility
  visibilityLabel: string
  price: number
  salePrice: number | null
  currency: string
  priceDisplay: CoursePriceDisplay
  durationLabel: string | null
  difficulty: CourseDifficulty | null
  difficultyLabel: string | null
  featured: boolean
  featuredLabel: string
  instructorName: string
  createdByName: string
  moduleCount: number
  lessonCount: number
  createdAt: string
  updatedAt: string
  createdAtLabel: string
  updatedAtLabel: string
  internalName: string
  slug: string
}

export type AdminCourseDetailsLeanCourse = {
  _id: { toString(): string }
  internalName: string
  title: string
  slug: string
  shortDescription: string
  category?: CourseCategory | null
  status: CourseStatus
  visibility: CourseVisibility
  pricing: {
    price: number
    salePrice?: number | null
    currency: string
  }
  featured: boolean
  moduleCount: number
  lessonCount: number
  estimatedDurationMinutes?: number | null
  difficulty?: CourseDifficulty | null
  instructorId: { toString(): string }
  createdBy: { toString(): string }
  createdAt: Date
  updatedAt: Date
}

export function mapToAdminCourseDetailsDto(
  course: AdminCourseDetailsLeanCourse,
  userNamesById: Map<string, string>,
): AdminCourseDetailsDto {
  const salePrice = course.pricing.salePrice ?? null
  const instructorId = course.instructorId.toString()
  const createdById = course.createdBy.toString()

  return {
    id: course._id.toString(),
    title: course.title,
    shortDescription: course.shortDescription,
    category: course.category ?? null,
    categoryLabel: getCourseCategoryLabel(course.category),
    status: course.status,
    statusLabel: getCourseStatusLabel(course.status),
    visibility: course.visibility,
    visibilityLabel: getCourseVisibilityLabel(course.visibility),
    price: course.pricing.price,
    salePrice,
    currency: course.pricing.currency,
    priceDisplay: formatCoursePriceDisplay({
      price: course.pricing.price,
      salePrice,
      currency: course.pricing.currency,
    }),
    durationLabel: formatEstimatedDuration(course.estimatedDurationMinutes ?? null),
    difficulty: course.difficulty ?? null,
    difficultyLabel: getCourseDifficultyLabel(course.difficulty),
    featured: course.featured,
    featuredLabel: formatFeaturedLabel(course.featured),
    instructorName: formatUserDisplayName(userNamesById.get(instructorId)),
    createdByName: formatUserDisplayName(userNamesById.get(createdById)),
    moduleCount: course.moduleCount,
    lessonCount: course.lessonCount,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    createdAtLabel: formatAdminDate(course.createdAt),
    updatedAtLabel: formatAdminDate(course.updatedAt),
    internalName: course.internalName,
    slug: course.slug,
  }
}

export const ADMIN_COURSE_DETAILS_DTO_KEYS = [
  'id',
  'title',
  'shortDescription',
  'category',
  'categoryLabel',
  'status',
  'statusLabel',
  'visibility',
  'visibilityLabel',
  'price',
  'salePrice',
  'currency',
  'priceDisplay',
  'durationLabel',
  'difficulty',
  'difficultyLabel',
  'featured',
  'featuredLabel',
  'instructorName',
  'createdByName',
  'moduleCount',
  'lessonCount',
  'createdAt',
  'updatedAt',
  'createdAtLabel',
  'updatedAtLabel',
  'internalName',
  'slug',
] as const

export function assertAdminCourseDetailsDtoSafety(dto: AdminCourseDetailsDto): void {
  const forbiddenKeys = [
    'instructorId',
    'createdBy',
    'updatedBy',
    'passwordHash',
    'seo',
    'thumbnailAssetId',
    'coverAssetId',
  ]

  for (const key of forbiddenKeys) {
    if (key in dto) {
      throw new Error(`Unsafe admin course details DTO field: ${key}`)
    }
  }
}
