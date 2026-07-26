'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { moveModuleInCourse } from '../services/module-service'
import {
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'
import { parseModuleMoveDirection } from '../validators/admin-move-module'
import {
  GENERIC_MOVE_MODULE_ERROR,
  INVALID_MOVE_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_MODULE_ERROR,
  type MoveModuleActionResult,
} from './move-module-action-state'

export async function moveModuleAction(
  courseId: string,
  moduleId: string,
  direction: string,
): Promise<MoveModuleActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_MOVE_MODULE_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedDirection = parseModuleMoveDirection(direction)

  if (!parsedCourseId.success || !parsedModuleId.success || !parsedDirection.success) {
    return {
      status: 'error',
      message: INVALID_MOVE_MODULE_REQUEST_ERROR,
    }
  }

  try {
    await moveModuleInCourse(
      parsedCourseId.courseId,
      parsedModuleId.moduleId,
      parsedDirection.direction,
    )
  } catch (error) {
    if (error instanceof CourseNotFoundError || error instanceof CourseModuleNotFoundError) {
      return {
        status: 'error',
        message: INVALID_MOVE_MODULE_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_MOVE_MODULE_ERROR,
      }
    }

    console.error('Move module failed', {
      error: error instanceof Error ? error.message : 'Unknown move module error',
    })

    return {
      status: 'error',
      message: GENERIC_MOVE_MODULE_ERROR,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content`)

  return { status: 'success' }
}
