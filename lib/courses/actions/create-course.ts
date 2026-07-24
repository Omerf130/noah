'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { createCourse } from '../services/course-service'
import {
  CourseDuplicateKeyError,
  CourseInstructorError,
  CourseValidationError,
} from '../services/errors'
import {
  extractAllowlistedCreateCourseFields,
  parseAdminCreateCourseFormInput,
  preserveCreateCourseValues,
} from '../validators/admin-create-course'
import { internalNameSchema, normalizeInternalName } from '../validators/shared'
import {
  DUPLICATE_COURSE_IDENTIFIER_ERROR,
  DUPLICATE_SLUG_AS_INTERNAL_ERROR,
  DUPLICATE_SLUG_ERROR,
  GENERIC_CREATE_COURSE_ERROR,
  INACTIVE_INSTRUCTOR_ERROR,
  INVALID_INSTRUCTOR_ERROR,
  UNAUTHORIZED_CREATE_COURSE_ERROR,
  mapAdminCreateCourseFieldErrors,
  type CreateCourseActionState,
} from './create-course-action-state'

export async function createCourseAction(
  _prevState: CreateCourseActionState,
  formData: FormData,
): Promise<CreateCourseActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_CREATE_COURSE_ERROR,
    }
  }

  const raw = extractAllowlistedCreateCourseFields(formData)
  const preservedValues = preserveCreateCourseValues(raw)
  const parsed = parseAdminCreateCourseFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminCreateCourseFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  const generatedInternalName = normalizeInternalName(parsed.data.slug)
  const internalNameValidation = internalNameSchema.safeParse(generatedInternalName)

  if (!internalNameValidation.success) {
    return {
      status: 'error',
      fieldErrors: {
        slug: ['כתובת הקורס אינה תקינה לשימוש כמזהה פנימי'],
      },
      values: preservedValues,
    }
  }

  const trustedInput = {
    ...parsed.data,
    internalName: internalNameValidation.data,
    instructorId: parsed.data.instructorId || user.id,
  }

  try {
    await createCourse(trustedInput, user.id)
  } catch (error) {
    if (error instanceof CourseDuplicateKeyError) {
      if (error.field === 'internalName') {
        return {
          status: 'error',
          fieldErrors: { slug: [DUPLICATE_SLUG_AS_INTERNAL_ERROR] },
          values: preservedValues,
        }
      }

      if (error.field === 'slug') {
        return {
          status: 'error',
          fieldErrors: { slug: [DUPLICATE_SLUG_ERROR] },
          values: preservedValues,
        }
      }

      return {
        status: 'error',
        message: DUPLICATE_COURSE_IDENTIFIER_ERROR,
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
        message: GENERIC_CREATE_COURSE_ERROR,
        values: preservedValues,
      }
    }

    console.error('Create course failed', {
      error: error instanceof Error ? error.message : 'Unknown create course error',
    })

    return {
      status: 'error',
      message: GENERIC_CREATE_COURSE_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  redirect('/admin/courses')
}
