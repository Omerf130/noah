'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { updateLessonMetadata } from '../services/lesson-service'
import {
  CourseValidationError,
  LessonNotFoundError,
} from '../services/errors'
import {
  extractAllowlistedUpdateLessonFields,
  parseAdminUpdateLessonFormInput,
  parseSubmittedUpdateLessonIds,
  preserveUpdateLessonValues,
} from '../validators/admin-update-lesson'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_UPDATE_LESSON_ERROR,
  INVALID_UPDATE_LESSON_REQUEST_ERROR,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_LESSON_ERROR,
  mapAdminUpdateLessonFieldErrors,
  type UpdateLessonActionState,
} from './update-lesson-action-state'

export async function updateLessonAction(
  routeCourseId: string,
  routeModuleId: string,
  routeLessonId: string,
  _prevState: UpdateLessonActionState,
  formData: FormData,
): Promise<UpdateLessonActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_UPDATE_LESSON_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  const parsedRouteModuleId = parseModuleIdParam(routeModuleId)
  const parsedRouteLessonId = parseLessonIdParam(routeLessonId)

  if (
    !parsedRouteCourseId.success ||
    !parsedRouteModuleId.success ||
    !parsedRouteLessonId.success
  ) {
    return {
      status: 'error',
      message: INVALID_UPDATE_LESSON_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedUpdateLessonFields(formData)
  const preservedValues = preserveUpdateLessonValues(raw)
  const parsedSubmittedIds = parseSubmittedUpdateLessonIds(raw)

  if (!parsedSubmittedIds.success) {
    return {
      status: 'error',
      message: INVALID_UPDATE_LESSON_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  if (
    parsedSubmittedIds.courseId !== parsedRouteCourseId.courseId ||
    parsedSubmittedIds.moduleId !== parsedRouteModuleId.moduleId ||
    parsedSubmittedIds.lessonId !== parsedRouteLessonId.lessonId
  ) {
    return {
      status: 'error',
      message: INVALID_UPDATE_LESSON_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  const parsed = parseAdminUpdateLessonFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminUpdateLessonFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    const result = await updateLessonMetadata(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsedRouteLessonId.lessonId,
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
    if (error instanceof LessonNotFoundError) {
      return {
        status: 'error',
        message: INVALID_UPDATE_LESSON_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_UPDATE_LESSON_ERROR,
        values: preservedValues,
      }
    }

    console.error('Update lesson failed', {
      error: error instanceof Error ? error.message : 'Unknown update lesson error',
    })

    return {
      status: 'error',
      message: GENERIC_UPDATE_LESSON_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
  revalidatePath(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}`,
  )
  revalidatePath(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}/lessons/${parsedRouteLessonId.lessonId}/edit`,
  )
  redirect(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}`,
  )
}
