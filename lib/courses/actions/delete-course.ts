'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { deleteCoursePermanently } from '../services/course-deletion-service'
import {
  CourseDeletionConfirmationError,
  CourseDeletionFailedError,
  CourseDeletionNotEligibleError,
  CourseNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import {
  GENERIC_DELETE_COURSE_ERROR,
  INVALID_DELETE_COURSE_REQUEST_ERROR,
  UNAUTHORIZED_DELETE_COURSE_ERROR,
  type DeleteCourseActionResult,
} from './delete-course-action-state'

export async function deleteCourseAction(
  courseId: string,
  confirmationTitle: string,
): Promise<DeleteCourseActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_DELETE_COURSE_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return {
      status: 'error',
      message: INVALID_DELETE_COURSE_REQUEST_ERROR,
    }
  }

  try {
    await deleteCoursePermanently(parsedCourseId.courseId, user.id, confirmationTitle)
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return {
        status: 'error',
        message: INVALID_DELETE_COURSE_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseDeletionConfirmationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    if (error instanceof CourseDeletionNotEligibleError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    if (error instanceof CourseDeletionFailedError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    console.error('Delete course failed', {
      error: error instanceof Error ? error.message : 'Unknown delete course error',
    })

    return {
      status: 'error',
      message: GENERIC_DELETE_COURSE_ERROR,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/edit`)
  redirect('/admin/courses')
}
