'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '../../auth/authorization'
import { getCurrentUser } from '../../auth/current-user'
import { moveContentBlockInLesson } from '../services/content-block-order-service'
import {
  ContentBlockNotFoundError,
  CourseModuleNotFoundError,
  CourseValidationError,
  LessonNotFoundError,
} from '../services/errors'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'
import { parseBlockIdParam } from '../validators/content-block'
import { parseLessonMoveDirection } from '../validators/admin-move-lesson'
import {
  GENERIC_MOVE_CONTENT_BLOCK_ERROR,
  INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR,
  UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR,
  type MoveContentBlockActionResult,
} from './move-content-block-action-state'

function getContentPagePath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
}

export async function moveContentBlockAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  direction: string,
): Promise<MoveContentBlockActionResult> {
  const user = await getCurrentUser()

  if (!user || !requireAdminRole(user.role)) {
    return {
      status: 'error',
      message: UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR,
    }
  }

  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)
  const parsedBlockId = parseBlockIdParam(blockId)
  const parsedDirection = parseLessonMoveDirection(direction)

  if (
    !parsedCourseId.success ||
    !parsedModuleId.success ||
    !parsedLessonId.success ||
    !parsedBlockId.success ||
    !parsedDirection.success
  ) {
    return {
      status: 'error',
      message: INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR,
    }
  }

  try {
    await moveContentBlockInLesson(
      parsedCourseId.courseId,
      parsedModuleId.moduleId,
      parsedLessonId.lessonId,
      parsedBlockId.blockId,
      parsedDirection.direction,
    )
  } catch (error) {
    if (
      error instanceof ContentBlockNotFoundError ||
      error instanceof LessonNotFoundError ||
      error instanceof CourseModuleNotFoundError
    ) {
      return {
        status: 'error',
        message: INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR,
      }
    }

    if (error instanceof CourseValidationError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    console.error('Move content block failed', {
      error: error instanceof Error ? error.message : 'Unknown move content block error',
    })

    return {
      status: 'error',
      message: GENERIC_MOVE_CONTENT_BLOCK_ERROR,
    }
  }

  const contentPath = getContentPagePath(
    parsedCourseId.courseId,
    parsedModuleId.moduleId,
    parsedLessonId.lessonId,
  )

  revalidatePath(contentPath)
  revalidatePath(`${contentPath}/blocks/new`)
  revalidatePath(`${contentPath}/blocks/${parsedBlockId.blockId}/edit`)
  revalidatePath(`/admin/courses/${parsedCourseId.courseId}/content/${parsedModuleId.moduleId}`)

  return { status: 'success' }
}
