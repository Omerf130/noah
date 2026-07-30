'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { moveLessonInModule } from '../services/lesson-service'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import { parseLessonMoveDirection } from '../validators/admin-move-lesson'
import {
  GENERIC_MOVE_LESSON_ERROR,
  INVALID_MOVE_LESSON_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_LESSON_ERROR,
  type MoveLessonActionResult,
} from './move-lesson-action-state'

export async function moveLessonAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  direction: string,
): Promise<MoveLessonActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_MOVE_LESSON_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)
  const parsedDirection = parseLessonMoveDirection(direction)

  if (
    !parsedCourseId.success ||
    !parsedModuleId.success ||
    !parsedLessonId.success ||
    !parsedDirection.success
  ) {
    return {
      status: 'error',
      message: INVALID_MOVE_LESSON_REQUEST_ERROR,
    }
  }

  try {
    await moveLessonInModule(
      parsedCourseId.courseId,
      parsedModuleId.moduleId,
      parsedLessonId.lessonId,
      parsedDirection.direction,
    )
  } catch (error) {
    if (
      error instanceof LessonNotFoundError ||
      error instanceof CourseModuleNotFoundError
    ) {
      return {
        status: 'error',
        message: INVALID_MOVE_LESSON_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_MOVE_LESSON_ERROR,
      }
    }

    console.error('Move lesson failed', {
      error: error instanceof Error ? error.message : 'Unknown move lesson error',
    })

    return {
      status: 'error',
      message: GENERIC_MOVE_LESSON_ERROR,
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
