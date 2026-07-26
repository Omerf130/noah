'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { createModule } from '../services/module-service'
import {
  CourseDuplicateKeyError,
  CourseNotFoundError,
  CourseValidationError,
} from '../services/errors'
import {
  extractAllowlistedCreateModuleFields,
  parseAdminCreateModuleFormInput,
  preserveCreateModuleValues,
} from '../validators/admin-create-module'
import { parseCourseIdParam } from '../validators/course-id'
import {
  DUPLICATE_MODULE_IDENTIFIER_ERROR,
  GENERIC_CREATE_MODULE_ERROR,
  INVALID_CREATE_MODULE_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_MODULE_ERROR,
  mapAdminCreateModuleFieldErrors,
  type CreateModuleActionState,
} from './create-module-action-state'

export async function createModuleAction(
  routeCourseId: string,
  _prevState: CreateModuleActionState,
  formData: FormData,
): Promise<CreateModuleActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_CREATE_MODULE_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  if (!parsedRouteCourseId.success) {
    return {
      status: 'error',
      message: INVALID_CREATE_MODULE_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedCreateModuleFields(formData)
  const preservedValues = preserveCreateModuleValues(raw)
  const parsed = parseAdminCreateModuleFormInput(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: mapAdminCreateModuleFieldErrors(parsed.error),
      values: preservedValues,
    }
  }

  try {
    await createModule(parsedRouteCourseId.courseId, {
      title: parsed.data.title,
      description: parsed.data.description,
      publicationStatus: parsed.data.publicationStatus ?? 'draft',
    })
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return {
        status: 'error',
        message: INVALID_CREATE_MODULE_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseDuplicateKeyError) {
      return {
        status: 'error',
        message: DUPLICATE_MODULE_IDENTIFIER_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: GENERIC_CREATE_MODULE_ERROR,
        values: preservedValues,
      }
    }

    console.error('Create module failed', {
      error: error instanceof Error ? error.message : 'Unknown create module error',
    })

    return {
      status: 'error',
      message: GENERIC_CREATE_MODULE_ERROR,
      values: preservedValues,
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
  redirect(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
}
