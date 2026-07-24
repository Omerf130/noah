'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { archiveCourse } from '../services/course-service'
import {
  CourseArchiveNotAllowedError,
  CourseNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import {
  ARCHIVE_COURSE_NOT_ALLOWED_ERROR,
  GENERIC_ARCHIVE_COURSE_ERROR,
  INVALID_ARCHIVE_COURSE_REQUEST_ERROR,
  UNAUTHORIZED_ARCHIVE_COURSE_ERROR,
  type ArchiveCourseActionResult,
} from './archive-course-action-state'

export async function archiveCourseAction(
  courseId: string,
): Promise<ArchiveCourseActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_ARCHIVE_COURSE_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return {
      status: 'error',
      message: INVALID_ARCHIVE_COURSE_REQUEST_ERROR,
    }
  }

  try {
    await archiveCourse(parsedCourseId.courseId, user.id)
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return {
        status: 'error',
        message: INVALID_ARCHIVE_COURSE_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseArchiveNotAllowedError) {
      return {
        status: 'error',
        message: ARCHIVE_COURSE_NOT_ALLOWED_ERROR,
      }
    }

    console.error('Archive course failed', {
      error: error instanceof Error ? error.message : 'Unknown archive course error',
    })

    return {
      status: 'error',
      message: GENERIC_ARCHIVE_COURSE_ERROR,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
  redirect(`/admin/courses/${parsedCourseId.courseId}`)
}
