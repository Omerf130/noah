import { connectDb } from '../../db/connect'
import { Course, CourseModule, Lesson } from '../../db/models'
import { matchesCourseDeleteConfirmation } from '../validators/course-delete-confirmation'
import { parseCourseIdParam } from '../validators/course-id'
import {
  CourseDeletionConfirmationError,
  CourseDeletionFailedError,
  CourseDeletionNotEligibleError,
  CourseNotFoundError,
} from './errors'

const NON_DRAFT_DELETION_MESSAGE =
  'ניתן למחוק לצמיתות רק קורסים בסטטוס טיוטה. ניתן להעביר קורסים שפורסמו או בארכיון לארכיון במקום מחיקה.'
const RELATED_MODULE_MESSAGE = 'לקורס זה קיימים פרקים. יש להסיר את התוכן לפני מחיקה, או להעביר את הקורס לארכיון.'
const RELATED_LESSON_MESSAGE = 'לקורס זה קיימים שיעורים. יש להסיר את התוכן לפני מחיקה, או להעביר את הקורס לארכיון.'
const RELATED_COURSE_ASSET_MESSAGE =
  'לקורס זה קיימים קבצי מדיה מקושרים. יש להסיר את הקישורים לפני מחיקה, או להעביר את הקורס לארכיון.'
const RELATED_BLOCK_ASSET_MESSAGE =
  'לקורס זה קיימים נכסי מדיה או וידאו בשיעורים. יש להסיר את התוכן לפני מחיקה, או להעביר את הקורס לארכיון.'

// TODO: When Enrollment, Order, or access models exist, add authoritative checks here.

type CourseDeletionEligibilityResult = {
  eligible: boolean
  reasons: string[]
}

type LessonBlock = {
  type?: string
  data?: {
    videoAssetId?: unknown
    mediaAssetId?: unknown
  }
}

function courseHasDirectAssetReferences(course: {
  thumbnailAssetId?: unknown
  coverAssetId?: unknown
  seo?: { ogImageAssetId?: unknown } | null
}): boolean {
  return Boolean(
    course.thumbnailAssetId || course.coverAssetId || course.seo?.ogImageAssetId,
  )
}

function lessonBlocksReferenceAssets(blocks: LessonBlock[] | undefined | null): boolean {
  if (!blocks?.length) {
    return false
  }

  return blocks.some((block) => {
    if (block.type === 'video' && block.data?.videoAssetId) {
      return true
    }

    if (block.type === 'file' && block.data?.mediaAssetId) {
      return true
    }

    return false
  })
}

export async function determineCourseDeletionEligibility(
  courseId: string,
): Promise<CourseDeletionEligibilityResult> {
  await connectDb()

  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return { eligible: false, reasons: ['הקורס המבוקש לא נמצא.'] }
  }

  const course = await Course.findById(parsedCourseId.courseId).lean()
  if (!course) {
    return { eligible: false, reasons: ['הקורס המבוקש לא נמצא.'] }
  }

  const reasons: string[] = []

  if (course.status !== 'draft') {
    reasons.push(NON_DRAFT_DELETION_MESSAGE)
  }

  const moduleExists = await CourseModule.exists({ courseId: parsedCourseId.courseId })
  if (moduleExists) {
    reasons.push(RELATED_MODULE_MESSAGE)
  }

  const lessonExists = await Lesson.exists({ courseId: parsedCourseId.courseId })
  if (lessonExists) {
    reasons.push(RELATED_LESSON_MESSAGE)
  }

  if (courseHasDirectAssetReferences(course)) {
    reasons.push(RELATED_COURSE_ASSET_MESSAGE)
  }

  const lessons = await Lesson.find({ courseId: parsedCourseId.courseId })
    .select({ blocks: 1 })
    .lean()

  if (lessons.some((lesson) => lessonBlocksReferenceAssets(lesson.blocks as LessonBlock[]))) {
    reasons.push(RELATED_BLOCK_ASSET_MESSAGE)
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  }
}

export type DeleteCoursePermanentlyResult = {
  deleted: true
  courseId: string
}

export async function deleteCoursePermanently(
  courseId: string,
  actorUserId: string,
  confirmationTitle: string,
): Promise<DeleteCoursePermanentlyResult> {
  void actorUserId

  await connectDb()

  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    throw new CourseNotFoundError('הקורס המבוקש לא נמצא.')
  }

  const course = await Course.findById(parsedCourseId.courseId).lean()
  if (!course) {
    throw new CourseNotFoundError('הקורס המבוקש לא נמצא.')
  }

  if (!matchesCourseDeleteConfirmation(course.title, confirmationTitle)) {
    throw new CourseDeletionConfirmationError()
  }

  const eligibility = await determineCourseDeletionEligibility(parsedCourseId.courseId)
  if (!eligibility.eligible) {
    throw new CourseDeletionNotEligibleError(
      eligibility.reasons[0] ?? 'לא ניתן למחוק קורס זה. ניתן להעביר אותו לארכיון במקום.',
    )
  }

  const deleteResult = await Course.deleteOne({ _id: parsedCourseId.courseId })

  if (deleteResult.deletedCount !== 1) {
    throw new CourseDeletionFailedError()
  }

  return {
    deleted: true,
    courseId: parsedCourseId.courseId,
  }
}
