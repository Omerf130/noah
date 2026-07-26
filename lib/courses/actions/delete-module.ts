'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { deleteModuleFromCourse } from '../services/module-service'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  ModuleCountSyncError,
  ModuleDeletionFailedError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_DELETE_MODULE_ERROR,
  INVALID_DELETE_MODULE_REQUEST_ERROR,
  MODULE_COUNT_SYNC_ERROR,
  UNAUTHORIZED_DELETE_MODULE_ERROR,
  type DeleteModuleActionResult,
} from './delete-module-action-state'

export async function deleteModuleAction(
  courseId: string,
  moduleId: string,
): Promise<DeleteModuleActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_DELETE_MODULE_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)

  if (!parsedCourseId.success || !parsedModuleId.success) {
    return {
      status: 'error',
      message: INVALID_DELETE_MODULE_REQUEST_ERROR,
    }
  }

  try {
    await deleteModuleFromCourse(parsedCourseId.courseId, parsedModuleId.moduleId)
  } catch (error) {
    if (error instanceof CourseModuleNotFoundError) {
      return {
        status: 'error',
        message: INVALID_DELETE_MODULE_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    if (error instanceof ModuleCountSyncError) {
      console.error('Module count sync failed after deletion', {
        courseId: parsedCourseId.courseId,
        moduleId: parsedModuleId.moduleId,
      })

      return {
        status: 'error',
        message: MODULE_COUNT_SYNC_ERROR,
      }
    }

    if (error instanceof ModuleDeletionFailedError) {
      return {
        status: 'error',
        message: GENERIC_DELETE_MODULE_ERROR,
      }
    }

    console.error('Delete module failed', {
      error: error instanceof Error ? error.message : 'Unknown delete module error',
    })

    return {
      status: 'error',
      message: GENERIC_DELETE_MODULE_ERROR,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content`)

  return { status: 'success' }
}
