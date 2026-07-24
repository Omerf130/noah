import type { CourseCategory, CourseStatus, CourseVisibility } from '../types'
import {
  formatAdminDate,
  formatAdminPrice,
  formatFeaturedLabel,
  formatUserDisplayName,
  getCourseCategoryLabel,
  getCourseStatusLabel,
  getCourseVisibilityLabel,
} from '../formatters/admin-display'

export type AdminCourseListItemDto = {
  id: string
  title: string
  internalName: string
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
  featured: boolean
  featuredLabel: string
  moduleCount: number
  lessonCount: number
  instructorName: string
  createdByName: string
  createdAt: string
  updatedAt: string
  createdAtLabel: string
  updatedAtLabel: string
  priceLabel: string
  salePriceLabel: string | null
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
  instructorId: { toString(): string }
  createdBy: { toString(): string }
  createdAt: Date
  updatedAt: Date
}

export function mapToAdminCourseListItemDto(
  course: AdminCourseListLeanCourse,
  userNamesById: Map<string, string>,
): AdminCourseListItemDto {
  const currency = course.pricing.currency
  const salePrice = course.pricing.salePrice ?? null
  const instructorId = course.instructorId.toString()
  const createdById = course.createdBy.toString()

  return {
    id: course._id.toString(),
    title: course.title,
    internalName: course.internalName,
    slug: course.slug,
    category: course.category ?? null,
    categoryLabel: getCourseCategoryLabel(course.category),
    status: course.status,
    statusLabel: getCourseStatusLabel(course.status),
    visibility: course.visibility,
    visibilityLabel: getCourseVisibilityLabel(course.visibility),
    price: course.pricing.price,
    salePrice,
    currency,
    featured: course.featured,
    featuredLabel: formatFeaturedLabel(course.featured),
    moduleCount: course.moduleCount,
    lessonCount: course.lessonCount,
    instructorName: formatUserDisplayName(userNamesById.get(instructorId)),
    createdByName: formatUserDisplayName(userNamesById.get(createdById)),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    createdAtLabel: formatAdminDate(course.createdAt),
    updatedAtLabel: formatAdminDate(course.updatedAt),
    priceLabel: formatAdminPrice(course.pricing.price, currency),
    salePriceLabel: salePrice === null ? null : formatAdminPrice(salePrice, currency),
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
  'internalName',
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
  'featured',
  'featuredLabel',
  'moduleCount',
  'lessonCount',
  'instructorName',
  'createdByName',
  'createdAt',
  'updatedAt',
  'createdAtLabel',
  'updatedAtLabel',
  'priceLabel',
  'salePriceLabel',
] as const

export function assertAdminCourseListDtoSafety(dto: AdminCourseListItemDto): void {
  const forbiddenKeys = ['instructorId', 'createdBy', 'passwordHash', 'updatedBy', 'seo']
  for (const key of forbiddenKeys) {
    if (key in dto) {
      throw new Error(`Unsafe admin course list DTO field: ${key}`)
    }
  }
}
