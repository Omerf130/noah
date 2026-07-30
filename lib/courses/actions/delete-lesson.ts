'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { deleteLessonFromModule } from '../services/lesson-service'
import {
  CourseValidationError,
  LessonCountSyncError,
  LessonDeletionFailedError,
  LessonNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_DELETE_LESSON_ERROR,
  INVALID_DELETE_LESSON_REQUEST_ERROR,
  LESSON_COUNT_SYNC_ERROR,
  UNAUTHORIZED_DELETE_LESSON_ERROR,
  type DeleteLessonActionResult,
} from './delete-lesson-action-state'

export async function deleteLessonAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
): Promise<DeleteLessonActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_DELETE_LESSON_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)

  if (!parsedCourseId.success || !parsedModuleId.success || !parsedLessonId.success) {
    return {
      status: 'error',
      message: INVALID_DELETE_LESSON_REQUEST_ERROR,
    }
  }

  try {
    await deleteLessonFromModule(
      parsedCourseId.courseId,
      parsedModuleId.moduleId,
      parsedLessonId.lessonId,
    )
  } catch (error) {
    if (error instanceof LessonNotFoundError) {
      return {
        status: 'error',
        message: INVALID_DELETE_LESSON_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    if (error instanceof LessonCountSyncError) {
      console.error('Lesson count sync failed after deletion', {
        courseId: parsedCourseId.courseId,
        moduleId: parsedModuleId.moduleId,
        lessonId: parsedLessonId.lessonId,
      })

      return {
        status: 'error',
        message: LESSON_COUNT_SYNC_ERROR,
      }
    }

    if (error instanceof LessonDeletionFailedError) {
      return {
        status: 'error',
        message: GENERIC_DELETE_LESSON_ERROR,
      }
    }

    console.error('Delete lesson failed', {
      error: error instanceof Error ? error.message : 'Unknown delete lesson error',
    })

    return {
      status: 'error',
      message: GENERIC_DELETE_LESSON_ERROR,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content`)
  revalidatePath(
    `/admin/courses/${parsedCourseId.courseId}/content/${parsedModuleId.moduleId}`,
  )

  return { status: 'success' }
}
