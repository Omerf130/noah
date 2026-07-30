'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { createLessonInModule } from '../services/lesson-service'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonCountSyncError,
  LessonDuplicateSlugError,
} from '../services/errors'
import {
  extractAllowlistedCreateLessonFields,
  parseAdminCreateLessonFormInput,
  preserveCreateLessonValues,
} from '../validators/admin-create-lesson'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  DUPLICATE_LESSON_IDENTIFIER_ERROR,
  GENERIC_CREATE_LESSON_ERROR,
  INVALID_CREATE_LESSON_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_LESSON_ERROR,
  mapAdminCreateLessonFieldErrors,
  type CreateLessonActionState,
} from './create-lesson-action-state'

export async function createLessonAction(
  routeCourseId: string,
  routeModuleId: string,
  _prevState: CreateLessonActionState,
  formData: FormData,
): Promise<CreateLessonActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_CREATE_LESSON_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  const parsedRouteModuleId = parseModuleIdParam(routeModuleId)

  if (!parsedRouteCourseId.success || !parsedRouteModuleId.success) {
    return {
      status: 'error',
      message: INVALID_CREATE_LESSON_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedCreateLessonFields(formData)
  const preservedValues = preserveCreateLessonValues(raw)
  const parsed = parseAdminCreateLessonFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminCreateLessonFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    await createLessonInModule(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsed.data,
    )
  } catch (error) {
    if (error instanceof CourseModuleNotFoundError) {
      return {
        status: 'error',
        message: INVALID_CREATE_LESSON_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof LessonDuplicateSlugError) {
      return {
        status: 'error',
        message: DUPLICATE_LESSON_IDENTIFIER_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof LessonCountSyncError || error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_CREATE_LESSON_ERROR,
        values: preservedValues,
      }
    }

    console.error('Create lesson failed', {
      error: error instanceof Error ? error.message : 'Unknown create lesson error',
    })

    return {
      status: 'error',
      message: GENERIC_CREATE_LESSON_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
  revalidatePath(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}`,
  )
  redirect(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}`,
  )
}
