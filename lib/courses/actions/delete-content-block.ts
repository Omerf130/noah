'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { deleteContentBlockFromLesson } from '../services/content-block-order-service'
import {
  ContentBlockNotFoundError,
  CourseValidationError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import { parseBlockIdParam } from '../validators/content-block'
import {
  GENERIC_DELETE_CONTENT_BLOCK_ERROR,
  INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_DELETE_CONTENT_BLOCK_ERROR,
  type DeleteContentBlockActionResult,
} from './delete-content-block-action-state'

function getContentPagePath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
}

export async function deleteContentBlockAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
): Promise<DeleteContentBlockActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_DELETE_CONTENT_BLOCK_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)
  const parsedBlockId = parseBlockIdParam(blockId)

  if (
    !parsedCourseId.success ||
    !parsedModuleId.success ||
    !parsedLessonId.success ||
    !parsedBlockId.success
  ) {
    return {
      status: 'error',
      message: INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR,
    }
  }

  try {
    await deleteContentBlockFromLesson(
      parsedCourseId.courseId,
      parsedModuleId.moduleId,
      parsedLessonId.lessonId,
      parsedBlockId.blockId,
    )
  } catch (error) {
    if (error instanceof ContentBlockNotFoundError) {
      return {
        status: 'error',
        message: INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    console.error('Delete content block failed', {
      error: error instanceof Error ? error.message : 'Unknown delete content block error',
    })

    return {
      status: 'error',
      message: GENERIC_DELETE_CONTENT_BLOCK_ERROR,
    }
  }

  const contentPath = getContentPagePath(
    parsedCourseId.courseId,
    parsedModuleId.moduleId,
    parsedLessonId.lessonId,
  )

  revalidatePath(contentPath)
  revalidatePath(`${contentPath}/blocks/new`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content/${parsedModuleId.moduleId}`)

  return { status: 'success' }
}
