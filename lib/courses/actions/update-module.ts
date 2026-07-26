'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { updateModuleMetadata } from '../services/module-service'
import {
  CourseDuplicateKeyError,
  CourseModuleNotFoundError,
  CourseValidationError,
} from '../services/errors'
import {
  extractAllowlistedUpdateModuleFields,
  parseAdminUpdateModuleFormInput,
  parseSubmittedUpdateModuleIds,
  preserveUpdateModuleValues,
} from '../validators/admin-update-module'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_UPDATE_MODULE_ERROR,
  INVALID_UPDATE_MODULE_REQUEST_ERROR,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_MODULE_ERROR,
  mapAdminUpdateModuleFieldErrors,
  type UpdateModuleActionState,
} from './update-module-action-state'

export async function updateModuleAction(
  routeCourseId: string,
  routeModuleId: string,
  _prevState: UpdateModuleActionState,
  formData: FormData,
): Promise<UpdateModuleActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_UPDATE_MODULE_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  const parsedRouteModuleId = parseModuleIdParam(routeModuleId)

  if (!parsedRouteCourseId.success || !parsedRouteModuleId.success) {
    return {
      status: 'error',
      message: INVALID_UPDATE_MODULE_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedUpdateModuleFields(formData)
  const preservedValues = preserveUpdateModuleValues(raw)
  const parsedSubmittedIds = parseSubmittedUpdateModuleIds(raw)

  if (!parsedSubmittedIds.success) {
    return {
      status: 'error',
      message: INVALID_UPDATE_MODULE_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  if (
    parsedSubmittedIds.courseId !== parsedRouteCourseId.courseId ||
    parsedSubmittedIds.moduleId !== parsedRouteModuleId.moduleId
  ) {
    return {
      status: 'error',
      message: INVALID_UPDATE_MODULE_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  const parsed = parseAdminUpdateModuleFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminUpdateModuleFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    const result = await updateModuleMetadata(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsed.data,
    )

    if (!result.updated) {
      return {
        status: 'no-op',
        message: NO_CHANGES_MADE_MESSAGE,
        values: preservedValues,
      }
    }
  } catch (error) {
    if (error instanceof CourseModuleNotFoundError) {
      return {
        status: 'error',
        message: INVALID_UPDATE_MODULE_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseDuplicateKeyError) {
      return {
        status: 'error',
        message: GENERIC_UPDATE_MODULE_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_UPDATE_MODULE_ERROR,
        values: preservedValues,
      }
    }

    console.error('Update module failed', {
      error: error instanceof Error ? error.message : 'Unknown update module error',
    })

    return {
      status: 'error',
      message: GENERIC_UPDATE_MODULE_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
  revalidatePath(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}/edit`,
  )
  redirect(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
}
