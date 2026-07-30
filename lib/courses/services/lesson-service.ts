import mongoose from 'mongoose'
import type { ClientSession } from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, isDuplicateKeyError } from '../../db/models'
import { LESSON_ORDER_GAP } from '../constants'
import type { AdminLessonMetadataTrustedInput } from '../validators/admin-lesson-metadata-fields'
import {
  parseCreateLessonInput,
  parseReorderLessonsInput,
  parseUpdateLessonBlocksInput,
  parseUpdateLessonInput,
  type CreateLessonInput,
  type UpdateLessonInput,
} from '../validators/lesson'
import {
  CourseDuplicateKeyError,
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
  LessonCountSyncError,
  LessonDeletionFailedError,
  LessonDuplicateSlugError,
  LessonNotFoundError,
  formatZodError,
} from './errors'
import {
  generateLessonSlugWithSuffixAttempt,
} from './lesson-slug-service'
import { runInTransaction } from './transaction-utils'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
  validateScopedReorderIds,
} from './reorder-utils'
import { assertModuleBelongsToCourse } from './module-service'
import { parseLessonIdParam } from '../validators/lesson-id'

const LESSON_NOT_FOUND_MESSAGE = 'השיעור המבוקש לא נמצא.'
const LESSON_DELETE_WITH_BLOCKS_MESSAGE =
  'לא ניתן למחוק את השיעור משום שקיימים בו בלוקי תוכן. יש להסיר את התוכן תחילה.'
const LESSON_MOVE_TO_SAME_MODULE_MESSAGE = 'השיעור כבר נמצא בפרק זה.'
const MAX_LESSON_CREATE_ATTEMPTS = 5

function assertSingleDocumentMatched(matchedCount: number) {
  if (matchedCount !== 1) {
    throw new LessonCountSyncError()
  }
}

async function getOrderedLessonIdsInModule(
  moduleId: string,
  session?: ClientSession,
): Promise<string[]> {
  const lessons = await Lesson.find({ moduleId })
    .sort({ order: 1 })
    .select('_id')
    .session(session ?? null)
    .lean()

  return lessons.map((lesson) => String(lesson._id))
}

async function reorderLessonsInModule(
  moduleId: string,
  orderedIds: string[],
  session?: ClientSession,
) {
  if (orderedIds.length === 0) {
    return
  }

  const query = Lesson.find({ moduleId }).select('_id')
  if (session) {
    query.session(session)
  }

  const lessons = await query.lean()
  const existingIds = new Set(lessons.map((lesson) => String(lesson._id)))

  validateScopedReorderIds(orderedIds, existingIds, 'lesson')

  const scopedModuleId = new mongoose.Types.ObjectId(moduleId)
  const bulkResult = await Lesson.bulkWrite(
    buildScopedOrderUpdates({ moduleId: scopedModuleId }, orderedIds, LESSON_ORDER_GAP),
    session ? { session } : undefined,
  )

  assertBulkWriteMatchedAll(bulkResult.matchedCount, orderedIds.length, 'lesson')
}

async function assertModuleExists(moduleId: string) {
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    throw new CourseModuleNotFoundError()
  }

  const courseModule = await CourseModule.findById(moduleId).lean()
  if (!courseModule) {
    throw new CourseModuleNotFoundError()
  }

  return courseModule
}

async function getNextLessonOrder(moduleId: string, session?: ClientSession): Promise<number> {
  const lastLesson = await Lesson.findOne({ moduleId })
    .sort({ order: -1 })
    .select('order')
    .session(session ?? null)
    .lean()

  if (!lastLesson) {
    return LESSON_ORDER_GAP
  }

  return lastLesson.order + LESSON_ORDER_GAP
}

async function syncModuleLessonCount(moduleId: string) {
  const lessonCount = await Lesson.countDocuments({ moduleId })
  await CourseModule.findByIdAndUpdate(moduleId, { lessonCount })
}

async function syncCourseLessonCount(courseId: string) {
  const lessonCount = await Lesson.countDocuments({ courseId })
  await Course.findByIdAndUpdate(courseId, { lessonCount })
}

export async function createLesson(moduleId: string, input: unknown) {
  await connectDb()
  const courseModule = await assertModuleExists(moduleId)

  const parsed = parseCreateLessonInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: CreateLessonInput = parsed.data
  const order = data.order ?? (await getNextLessonOrder(moduleId))

  try {
    const lesson = await Lesson.create({
      courseId: courseModule.courseId,
      moduleId,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      order,
      blocks: data.blocks,
      estimatedDurationMinutes: data.estimatedDurationMinutes,
      quizId: data.quizId,
      prerequisiteLessonIds: data.prerequisiteLessonIds ?? [],
      releaseRule: data.releaseRule,
      isPreviewFree: data.isPreviewFree,
      status: data.status,
    })

    await syncModuleLessonCount(moduleId)
    await syncCourseLessonCount(String(courseModule.courseId))

    return lesson.toObject()
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError(
        'unknown',
        'A lesson with this slug already exists in the course',
      )
    }

    throw error
  }
}

export async function getLessonById(lessonId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  const lesson = await Lesson.findById(lessonId).lean()
  if (!lesson) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  return lesson
}

export async function assertLessonBelongsToModule(
  courseId: string,
  moduleId: string,
  lessonId: string,
) {
  await connectDb()
  await assertModuleBelongsToCourse(courseId, moduleId)

  const parsedLessonId = parseLessonIdParam(lessonId)
  if (!parsedLessonId.success) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  const lesson = await Lesson.findById(parsedLessonId.lessonId).lean()
  if (
    !lesson ||
    String(lesson.courseId) !== courseId ||
    String(lesson.moduleId) !== moduleId
  ) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  return lesson
}

export async function listLessonsByModule(moduleId: string) {
  await connectDb()
  await assertModuleExists(moduleId)

  return Lesson.find({ moduleId }).sort({ order: 1 }).lean()
}

export async function updateLesson(lessonId: string, input: unknown) {
  await connectDb()

  const parsed = parseUpdateLessonInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: UpdateLessonInput = parsed.data

  try {
    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $set: data },
      { returnDocument: 'after', runValidators: true },
    ).lean()

    if (!lesson) {
      throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
    }

    return lesson
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError(
        'unknown',
        'A lesson with this slug already exists in the course',
      )
    }

    throw error
  }
}

export async function updateLessonBlocks(lessonId: string, input: unknown) {
  await connectDb()

  const parsed = parseUpdateLessonBlocksInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $set: { blocks: parsed.data.blocks } },
    { returnDocument: 'after', runValidators: true },
  ).lean()

  if (!lesson) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  return lesson
}

export async function deleteLesson(lessonId: string) {
  await connectDb()

  const lesson = await Lesson.findById(lessonId).lean()
  if (!lesson) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  await Lesson.findByIdAndDelete(lessonId)
  await syncModuleLessonCount(String(lesson.moduleId))
  await syncCourseLessonCount(String(lesson.courseId))

  return { deleted: true, lessonId }
}

export async function reorderLessons(moduleId: string, input: unknown) {
  await connectDb()
  await assertModuleExists(moduleId)

  const parsed = parseReorderLessonsInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  await reorderLessonsInModule(moduleId, parsed.data.orderedLessonIds)

  return Lesson.find({ moduleId }).sort({ order: 1 }).lean()
}

export async function moveLessonInModule(
  courseId: string,
  moduleId: string,
  lessonId: string,
  direction: 'up' | 'down',
) {
  await connectDb()
  await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  const orderedIds = await getOrderedLessonIdsInModule(moduleId)
  const currentIndex = orderedIds.indexOf(lessonId)

  if (currentIndex === -1) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  if (
    (direction === 'up' && currentIndex === 0) ||
    (direction === 'down' && currentIndex === orderedIds.length - 1)
  ) {
    return Lesson.find({ moduleId }).sort({ order: 1 }).lean()
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  const reorderedIds = [...orderedIds]
  ;[reorderedIds[currentIndex], reorderedIds[targetIndex]] = [
    reorderedIds[targetIndex],
    reorderedIds[currentIndex],
  ]

  return reorderLessons(moduleId, { orderedLessonIds: reorderedIds })
}

export async function moveLessonToModule(
  courseId: string,
  lessonId: string,
  targetModuleId: string,
) {
  await connectDb()

  const parsedLessonId = parseLessonIdParam(lessonId)
  if (!parsedLessonId.success) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  const lesson = await Lesson.findById(parsedLessonId.lessonId).lean()
  if (!lesson || String(lesson.courseId) !== courseId) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  const sourceModuleId = String(lesson.moduleId)

  await assertModuleBelongsToCourse(courseId, targetModuleId)

  if (sourceModuleId === targetModuleId) {
    throw new CourseValidationError(LESSON_MOVE_TO_SAME_MODULE_MESSAGE)
  }

  const sourceOrderedAfter = (await getOrderedLessonIdsInModule(sourceModuleId)).filter(
    (id) => id !== parsedLessonId.lessonId,
  )
  const targetOrderedAfter = [
    ...(await getOrderedLessonIdsInModule(targetModuleId)),
    parsedLessonId.lessonId,
  ]

  return runInTransaction(async (session) => {
    const lessonUpdate = await Lesson.updateOne(
      { _id: parsedLessonId.lessonId, courseId, moduleId: sourceModuleId },
      { $set: { moduleId: targetModuleId } },
      { session },
    )
    assertSingleDocumentMatched(lessonUpdate.matchedCount)

    await reorderLessonsInModule(sourceModuleId, sourceOrderedAfter, session)
    await reorderLessonsInModule(targetModuleId, targetOrderedAfter, session)

    const sourceModuleUpdate = await CourseModule.updateOne(
      { _id: sourceModuleId, courseId, lessonCount: { $gte: 1 } },
      { $inc: { lessonCount: -1 } },
      { session },
    )
    assertSingleDocumentMatched(sourceModuleUpdate.matchedCount)

    const targetModuleUpdate = await CourseModule.updateOne(
      { _id: targetModuleId, courseId },
      { $inc: { lessonCount: 1 } },
      { session },
    )
    assertSingleDocumentMatched(targetModuleUpdate.matchedCount)

    return {
      lessonId: parsedLessonId.lessonId,
      sourceModuleId,
      targetModuleId,
    }
  })
}

export async function deleteLessonFromModule(
  courseId: string,
  moduleId: string,
  lessonId: string,
) {
  await connectDb()
  await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  const parsedLessonId = parseLessonIdParam(lessonId)
  if (!parsedLessonId.success) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  const lessonWithBlocks = await Lesson.findOne({
    _id: parsedLessonId.lessonId,
    courseId,
    moduleId,
  })
    .select('blocks')
    .lean()

  if (!lessonWithBlocks) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  // TODO (Checkpoint G): Replace the lesson.blocks.length === 0 gate below with
  // ContentBlock.exists({ lessonId }) once Content Blocks become standalone documents.
  //
  // Future TODO (no implementation): Investigate a soft-delete / trash capability
  // for lessons before permanent deletion.

  if ((lessonWithBlocks.blocks?.length ?? 0) > 0) {
    throw new CourseValidationError(LESSON_DELETE_WITH_BLOCKS_MESSAGE)
  }

  const remainingOrderedIds = (await getOrderedLessonIdsInModule(moduleId)).filter(
    (id) => id !== parsedLessonId.lessonId,
  )

  return runInTransaction(async (session) => {
    const deleteResult = await Lesson.deleteOne(
      { _id: parsedLessonId.lessonId, courseId, moduleId },
      { session },
    )

    if (deleteResult.deletedCount !== 1) {
      throw new LessonDeletionFailedError()
    }

    const moduleUpdate = await CourseModule.updateOne(
      { _id: moduleId, courseId, lessonCount: { $gte: 1 } },
      { $inc: { lessonCount: -1 } },
      { session },
    )
    assertSingleDocumentMatched(moduleUpdate.matchedCount)

    const courseUpdate = await Course.updateOne(
      { _id: courseId, lessonCount: { $gte: 1 } },
      { $inc: { lessonCount: -1 } },
      { session },
    )
    assertSingleDocumentMatched(courseUpdate.matchedCount)

    await reorderLessonsInModule(moduleId, remainingOrderedIds, session)

    return { deleted: true, lessonId: parsedLessonId.lessonId }
  })
}

export async function listLessonsByCourse(courseId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  return Lesson.find({ courseId }).sort({ order: 1 }).lean()
}

function normalizeLessonDescription(value: string | undefined | null): string {
  return value?.trim() ?? ''
}

function mapTrustedInputToLessonDocument(
  courseId: string,
  moduleId: string,
  trustedInput: AdminLessonMetadataTrustedInput,
  slug: string,
  order: number,
) {
  const normalizedDescription = normalizeLessonDescription(trustedInput.description)

  return {
    courseId,
    moduleId,
    title: trustedInput.title,
    slug,
    order,
    status: trustedInput.publicationStatus,
    blocks: [] as [],
    ...(normalizedDescription ? { summary: normalizedDescription } : {}),
  }
}

function isTrustedMetadataEqualToLesson(
  trustedInput: AdminLessonMetadataTrustedInput,
  lesson: {
    title: string
    summary?: string | null
    status?: string
  },
): boolean {
  return (
    trustedInput.title === lesson.title &&
    normalizeLessonDescription(trustedInput.description) ===
      normalizeLessonDescription(lesson.summary) &&
    trustedInput.publicationStatus === (lesson.status ?? 'draft')
  )
}

async function createLessonInModuleTransactional(
  courseId: string,
  moduleId: string,
  trustedInput: AdminLessonMetadataTrustedInput,
  slug: string,
) {
  return runInTransaction(async (session) => {
    await assertModuleBelongsToCourse(courseId, moduleId)

    const order = await getNextLessonOrder(moduleId, session)
    const payload = mapTrustedInputToLessonDocument(
      courseId,
      moduleId,
      trustedInput,
      slug,
      order,
    )

    const [lesson] = await Lesson.create([payload], { session })

    const moduleUpdate = await CourseModule.updateOne(
      { _id: moduleId, courseId },
      { $inc: { lessonCount: 1 } },
      { session },
    )

    if (moduleUpdate.matchedCount !== 1) {
      throw new LessonCountSyncError()
    }

    const courseUpdate = await Course.updateOne(
      { _id: courseId },
      { $inc: { lessonCount: 1 } },
      { session },
    )

    if (courseUpdate.matchedCount !== 1) {
      throw new LessonCountSyncError()
    }

    return lesson.toObject()
  })
}

export async function createLessonInModule(
  courseId: string,
  moduleId: string,
  trustedInput: AdminLessonMetadataTrustedInput,
) {
  await connectDb()
  await assertModuleBelongsToCourse(courseId, moduleId)

  let lastError: unknown

  for (let attempt = 0; attempt < MAX_LESSON_CREATE_ATTEMPTS; attempt += 1) {
    const slug = await generateLessonSlugWithSuffixAttempt(
      courseId,
      trustedInput.title,
      attempt,
    )

    try {
      return await createLessonInModuleTransactional(courseId, moduleId, trustedInput, slug)
    } catch (error) {
      lastError = error

      if (isDuplicateKeyError(error)) {
        continue
      }

      throw error
    }
  }

  if (isDuplicateKeyError(lastError)) {
    throw new LessonDuplicateSlugError()
  }

  throw lastError
}

export { generateLessonSlug, lessonSlugExists } from './lesson-slug-service'

export type UpdateLessonMetadataResult = {
  updated: boolean
  lesson: Awaited<ReturnType<typeof getLessonById>>
}

export async function updateLessonMetadata(
  courseId: string,
  moduleId: string,
  lessonId: string,
  trustedInput: AdminLessonMetadataTrustedInput,
): Promise<UpdateLessonMetadataResult> {
  await connectDb()

  const existingLesson = await assertLessonBelongsToModule(courseId, moduleId, lessonId)

  if (isTrustedMetadataEqualToLesson(trustedInput, existingLesson)) {
    return { updated: false, lesson: existingLesson }
  }

  const setPayload: Record<string, unknown> = {
    title: trustedInput.title,
    status: trustedInput.publicationStatus,
  }
  const unsetPayload: Record<string, 1> = {}
  const normalizedDescription = normalizeLessonDescription(trustedInput.description)

  if (normalizedDescription) {
    setPayload.summary = normalizedDescription
  } else {
    unsetPayload.summary = 1
  }

  const lesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, courseId, moduleId },
    {
      $set: setPayload,
      ...(Object.keys(unsetPayload).length > 0 ? { $unset: unsetPayload } : {}),
    },
    { returnDocument: 'after', runValidators: true },
  ).lean()

  if (!lesson) {
    throw new LessonNotFoundError(LESSON_NOT_FOUND_MESSAGE)
  }

  return { updated: true, lesson }
}
