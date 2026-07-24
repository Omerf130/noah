'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { updateCourseMetadata } from '../services/course-service'
import {
  CourseDuplicateKeyError,
  CourseInstructorError,
  CourseNotFoundError,
  CourseValidationError,
} from '../services/errors'
import {
  extractAllowlistedUpdateCourseFields,
  parseAdminUpdateCourseFormInput,
  parseSubmittedUpdateCourseId,
  preserveUpdateCourseValues,
} from '../validators/admin-update-course'
import { parseCourseIdParam } from '../validators/course-id'
import {
  DUPLICATE_SLUG_ERROR,
  GENERIC_UPDATE_COURSE_ERROR,
  INACTIVE_INSTRUCTOR_ERROR,
  INVALID_INSTRUCTOR_ERROR,
  INVALID_UPDATE_COURSE_REQUEST_ERROR,
  mapAdminUpdateCourseFieldErrors,
  NO_CHANGES_MADE_MESSAGE,
  UNAUTHORIZED_UPDATE_COURSE_ERROR,
  type UpdateCourseActionState,
} from './update-course-action-state'

export async function updateCourseAction(
  routeCourseId: string,
  _prevState: UpdateCourseActionState,
  formData: FormData,
): Promise<UpdateCourseActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_UPDATE_COURSE_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  if (!parsedRouteCourseId.success) {
    return {
      status: 'error',
      message: INVALID_UPDATE_COURSE_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedUpdateCourseFields(formData)
  const preservedValues = preserveUpdateCourseValues(raw)
  const parsedSubmittedCourseId = parseSubmittedUpdateCourseId(raw)

  if (!parsedSubmittedCourseId.success) {
    return {
      status: 'error',
      message: INVALID_UPDATE_COURSE_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  if (parsedSubmittedCourseId.data !== parsedRouteCourseId.courseId) {
    return {
      status: 'error',
      message: INVALID_UPDATE_COURSE_REQUEST_ERROR,
      values: preservedValues,
    }
  }

  const parsed = parseAdminUpdateCourseFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminUpdateCourseFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    const result = await updateCourseMetadata(
      parsedRouteCourseId.courseId,
      parsed.data,
      user.id,
    )

    if (!result.updated) {
      return {
        status: 'no-op',
        message: NO_CHANGES_MADE_MESSAGE,
        values: preservedValues,
      }
    }
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return {
        status: 'error',
        message: INVALID_UPDATE_COURSE_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseDuplicateKeyError) {
      if (error.field === 'slug') {
        return {
          status: 'error',
          fieldErrors: { slug: [DUPLICATE_SLUG_ERROR] },
          values: preservedValues,
        }
      }

      return {
        status: 'error',
        message: GENERIC_UPDATE_COURSE_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseInstructorError) {
      return {
        status: 'error',
        fieldErrors: {
          instructorId: [
            error.reason === 'inactive' ? INACTIVE_INSTRUCTOR_ERROR : INVALID_INSTRUCTOR_ERROR,
          ],
        },
        values: preservedValues,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_UPDATE_COURSE_ERROR,
        values: preservedValues,
      }
    }

    console.error('Update course failed', {
      error: error instanceof Error ? error.message : 'Unknown update course error',
    })

    return {
      status: 'error',
      message: GENERIC_UPDATE_COURSE_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/edit`)
  redirect(`/admin/courses/${parsedRouteCourseId.courseId}`)
}
