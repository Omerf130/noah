'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { moveLessonToModule } from '../services/lesson-service'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonCountSyncError,
  LessonNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseMoveLessonToModuleTargetId } from '../validators/admin-move-lesson-to-module'
import {
  GENERIC_MOVE_LESSON_TO_MODULE_ERROR,
  INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_LESSON_TO_MODULE_ERROR,
  type MoveLessonToModuleActionResult,
} from './move-lesson-to-module-action-state'

export async function moveLessonToModuleAction(
  courseId: string,
  lessonId: string,
  targetModuleId: string,
): Promise<MoveLessonToModuleActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_MOVE_LESSON_TO_MODULE_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedLessonId = parseLessonIdParam(lessonId)
  const parsedTargetModuleId = parseMoveLessonToModuleTargetId(targetModuleId)

  if (
    !parsedCourseId.success ||
    !parsedLessonId.success ||
    !parsedTargetModuleId.success
  ) {
    return {
      status: 'error',
      message: INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR,
    }
  }

  try {
    const result = await moveLessonToModule(
      parsedCourseId.courseId,
      parsedLessonId.lessonId,
      parsedTargetModuleId.targetModuleId,
    )

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
    revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content`)
    revalidatePath(
      `/admin/courses/${parsedCourseId.courseId}/content/${result.sourceModuleId}`,
    )
    revalidatePath(
      `/admin/courses/${parsedCourseId.courseId}/content/${result.targetModuleId}`,
    )

    return { status: 'success' }
  } catch (error) {
    if (
      error instanceof LessonNotFoundError ||
      error instanceof CourseModuleNotFoundError
    ) {
      return {
        status: 'error',
        message: INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    if (error instanceof LessonCountSyncError) {
      console.error('Lesson count sync failed after move to module', {
        courseId: parsedCourseId.courseId,
        lessonId: parsedLessonId.lessonId,
        targetModuleId: parsedTargetModuleId.targetModuleId,
      })

      return {
        status: 'error',
        message: GENERIC_MOVE_LESSON_TO_MODULE_ERROR,
      }
    }

    console.error('Move lesson to module failed', {
      error: error instanceof Error ? error.message : 'Unknown move lesson to module error',
    })

    return {
      status: 'error',
      message: GENERIC_MOVE_LESSON_TO_MODULE_ERROR,
    }
  }
}
