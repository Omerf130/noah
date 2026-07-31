'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { updateRichTextContentBlock } from '../services/content-block-service'
import {
  ContentBlockNotFoundError,
  CourseValidationError,
  LessonNotFoundError,
} from '../services/errors'
import {
  extractAllowlistedRichTextBlockFields,
  parseRichTextBlockFormInput,
  preserveRichTextBlockFormValues,
} from '../validators/admin-rich-text-block-form'
import { parseBlockIdParam } from '../validators/content-block'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import {
  GENERIC_UPDATE_RICH_TEXT_BLOCK_ERROR,
  INVALID_UPDATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
  NO_CHANGES_RICH_TEXT_BLOCK_MESSAGE,
  UNAUTHORIZED_UPDATE_RICH_TEXT_BLOCK_ERROR,
  type UpdateRichTextBlockActionState,
} from './update-rich-text-block-action-state'

function getLessonContentPath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
}

function getEditPath(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
) {
  return `${getLessonContentPath(courseId, moduleId, lessonId)}/blocks/${blockId}/edit`
}

export async function updateRichTextBlockAction(
  routeCourseId: string,
  routeModuleId: string,
  routeLessonId: string,
  routeBlockId: string,
  _prevState: UpdateRichTextBlockActionState,
  formData: FormData,
): Promise<UpdateRichTextBlockActionState> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_UPDATE_RICH_TEXT_BLOCK_ERROR,
    }
  }

  const parsedRouteCourseId = parseCourseIdParam(routeCourseId)
  const parsedRouteModuleId = parseModuleIdParam(routeModuleId)
  const parsedRouteLessonId = parseLessonIdParam(routeLessonId)
  const parsedRouteBlockId = parseBlockIdParam(routeBlockId)

  if (
    !parsedRouteCourseId.success ||
    !parsedRouteModuleId.success ||
    !parsedRouteLessonId.success ||
    !parsedRouteBlockId.success
  ) {
    return {
      status: 'error',
      message: INVALID_UPDATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
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
    const result = await updateRichTextContentBlock(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsedRouteLessonId.lessonId,
      parsedRouteBlockId.blockId,
      parsedDocument.data,
    )

    if (!result.updated) {
      return {
        status: 'no-op',
        message: NO_CHANGES_RICH_TEXT_BLOCK_MESSAGE,
        values: preservedValues,
      }
    }
  } catch (error) {
    if (
      error instanceof ContentBlockNotFoundError ||
      error instanceof LessonNotFoundError
    ) {
      return {
        status: 'error',
        message: INVALID_UPDATE_RICH_TEXT_BLOCK_REQUEST_ERROR,
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

    console.error('Update rich text block failed', {
      error: error instanceof Error ? error.message : 'Unknown update rich text block error',
    })

    return {
      status: 'error',
      message: GENERIC_UPDATE_RICH_TEXT_BLOCK_ERROR,
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
  revalidatePath(
    getEditPath(
      parsedRouteCourseId.courseId,
      parsedRouteModuleId.moduleId,
      parsedRouteLessonId.lessonId,
      parsedRouteBlockId.blockId,
    ),
  )
  redirect(contentPath)
}
