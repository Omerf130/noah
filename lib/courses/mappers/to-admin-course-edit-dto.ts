import { DEFAULT_CURRENCY } from '../constants'
import { estimatedMinutesToHours } from '../formatters/duration'
import { getCourseStatusLabel } from '../formatters/admin-display'
import type { CourseStatus } from '../types'
import type { AdminCourseDetailsLeanCourse } from './to-admin-course-details-dto'
import type { CourseMetadataFormValues } from '../validators/admin-course-metadata-fields'

export type AdminCourseEditDto = CourseMetadataFormValues & {
  courseId: string
  status: CourseStatus
  statusLabel: string
}

export function mapToAdminCourseEditDto(
  course: AdminCourseDetailsLeanCourse,
): AdminCourseEditDto {
  return {
    courseId: course._id.toString(),
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    category: course.category ?? '',
    price: String(course.pricing.price),
    salePrice:
      course.pricing.salePrice === null || course.pricing.salePrice === undefined
        ? ''
        : String(course.pricing.salePrice),
    currency: course.pricing.currency || DEFAULT_CURRENCY,
    estimatedDurationHours: estimatedMinutesToHours(course.estimatedDurationMinutes ?? null),
    difficulty: course.difficulty ?? '',
    visibility: course.visibility,
    featured: course.featured,
    instructorId: course.instructorId.toString(),
    status: course.status,
    statusLabel: getCourseStatusLabel(course.status),
  }
}
