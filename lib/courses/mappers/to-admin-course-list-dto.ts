import type { CourseCategory, CourseStatus, CourseVisibility } from '../types'
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
  getCourseStatusLabel,
  getCourseVisibilityLabel,
} from '../formatters/admin-display'

export type AdminCourseListItemDto = {
  id: string
  title: string
  slug: string
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
  featured: boolean
  featuredLabel: string
  moduleCount: number
  lessonCount: number
  durationLabel: string | null
  instructorName: string
  createdByName: string
  createdAt: string
  updatedAt: string
  createdAtLabel: string
  updatedAtLabel: string
}

export type AdminCourseListLeanCourse = {
  _id: { toString(): string }
  title: string
  internalName: string
  slug: string
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
  instructorId: { toString(): string }
  createdBy: { toString(): string }
  createdAt: Date
  updatedAt: Date
}

export function mapToAdminCourseListItemDto(
  course: AdminCourseListLeanCourse,
  userNamesById: Map<string, string>,
): AdminCourseListItemDto {
  const salePrice = course.pricing.salePrice ?? null
  const instructorId = course.instructorId.toString()
  const createdById = course.createdBy.toString()

  return {
    id: course._id.toString(),
    title: course.title,
    slug: course.slug,
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
    featured: course.featured,
    featuredLabel: formatFeaturedLabel(course.featured),
    moduleCount: course.moduleCount,
    lessonCount: course.lessonCount,
    durationLabel: formatEstimatedDuration(course.estimatedDurationMinutes ?? null),
    instructorName: formatUserDisplayName(userNamesById.get(instructorId)),
    createdByName: formatUserDisplayName(userNamesById.get(createdById)),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    createdAtLabel: formatAdminDate(course.createdAt),
    updatedAtLabel: formatAdminDate(course.updatedAt),
  }
}

export function mapToAdminCourseListDto(
  courses: AdminCourseListLeanCourse[],
  userNamesById: Map<string, string>,
): AdminCourseListItemDto[] {
  return courses.map((course) => mapToAdminCourseListItemDto(course, userNamesById))
}

export const ADMIN_COURSE_LIST_DTO_KEYS = [
  'id',
  'title',
  'slug',
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
  'featured',
  'featuredLabel',
  'moduleCount',
  'lessonCount',
  'durationLabel',
  'instructorName',
  'createdByName',
  'createdAt',
  'updatedAt',
  'createdAtLabel',
  'updatedAtLabel',
] as const

export function assertAdminCourseListDtoSafety(dto: AdminCourseListItemDto): void {
  const forbiddenKeys = [
    'instructorId',
    'createdBy',
    'passwordHash',
    'updatedBy',
    'seo',
    'internalName',
  ]
  for (const key of forbiddenKeys) {
    if (key in dto) {
      throw new Error(`Unsafe admin course list DTO field: ${key}`)
    }
  }
}
