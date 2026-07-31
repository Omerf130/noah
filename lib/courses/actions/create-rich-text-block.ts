'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import {
  createRichTextContentBlock,
  GENERIC_CONTENT_BLOCK_ERROR,
} from '../services/content-block-service'
import {
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonNotFoundError,
} from '../services/errors'
import {
  extractAllowlistedRichTextBlockFields,
  parseRichTextBlockFormInput,
  preserveRichTextBlockFormValues,
} from '../validators/admin-rich-text-block-form'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_CREATE_RICH_TEXT_BLOCK_ERROR,
  INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_CREATE_RICH_TEXT_BLOCK_ERROR,
  type CreateRichTextBlockActionState,
} from './create-rich-text-block-action-state'

function getLessonContentPath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
}

export async function createRichTextBlockAction(
  routeCourseId: string,
  routeModuleId: string,
  routeLessonId: string,
  _prevState: CreateRichTextBlockActionState,
  formData: FormData,
): Promise<CreateRichTextBlockActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_CREATE_RICH_TEXT_BLOCK_ERROR,
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
      message: INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
    }
  }

  const raw = extractAllowlistedRichTextBlockFields(formData)
  const preservedValues = preserveRichTextBlockFormValues(raw)
  const parsedDocument = parseRichTextBlockFormInput(raw)

  if (!parsedDocument.success) {
    return {
      status: 'error',
      message: parsedDocument.message,
      values: preservedValues,
    }
  }

  try {
    await createRichTextContentBlock(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsedRouteLessonId.lessonId,
      parsedDocument.data,
    )
  } catch (error) {
    if (
      error instanceof CourseModuleNotFoundError ||
      error instanceof LessonNotFoundError
    ) {
      return {
        status: 'error',
        message: INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
        values: preservedValues,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
        values: preservedValues,
      }
    }

    console.error('Create rich text block failed', {
      error: error instanceof Error ? error.message : 'Unknown create rich text block error',
    })

    return {
      status: 'error',
      message: GENERIC_CREATE_RICH_TEXT_BLOCK_ERROR,
      values: preservedValues,
    }
  }

  const contentPath = getLessonContentPath(
    parsedRouteCourseId.courseId,
    parsedRouteModuleId.moduleId,
    parsedRouteLessonId.lessonId,
  )

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}`)
  revalidatePath(`/admin/courses/${parsedRouteCourseId.courseId}/content`)
  revalidatePath(
    `/admin/courses/${parsedRouteCourseId.courseId}/content/${parsedRouteModuleId.moduleId}`,
  )
  revalidatePath(contentPath)
  redirect(contentPath)
}

export { GENERIC_CONTENT_BLOCK_ERROR }
