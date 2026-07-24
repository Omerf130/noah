import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, isDuplicateKeyError } from '../../db/models'
import { LESSON_ORDER_GAP } from '../constants'
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
  LessonNotFoundError,
  formatZodError,
} from './errors'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
  validateScopedReorderIds,
} from './reorder-utils'

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

async function getNextLessonOrder(moduleId: string): Promise<number> {
  const lastLesson = await Lesson.findOne({ moduleId })
    .sort({ order: -1 })
    .select('order')
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
      throw new CourseDuplicateKeyError('A lesson with this slug already exists in the course')
    }

    throw error
  }
}

export async function getLessonById(lessonId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new LessonNotFoundError()
  }

  const lesson = await Lesson.findById(lessonId).lean()
  if (!lesson) {
    throw new LessonNotFoundError()
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
      throw new LessonNotFoundError()
    }

    return lesson
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('A lesson with this slug already exists in the course')
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
    throw new LessonNotFoundError()
  }

  return lesson
}

export async function deleteLesson(lessonId: string) {
  await connectDb()

  const lesson = await Lesson.findById(lessonId).lean()
  if (!lesson) {
    throw new LessonNotFoundError()
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

  const lessons = await Lesson.find({ moduleId }).select('_id order').lean()
  const existingIds = new Set(lessons.map((lesson) => String(lesson._id)))
  const orderedIds = parsed.data.orderedLessonIds

  validateScopedReorderIds(orderedIds, existingIds, 'lesson')

  const scopedModuleId = new mongoose.Types.ObjectId(moduleId)
  const bulkResult = await Lesson.bulkWrite(
    buildScopedOrderUpdates({ moduleId: scopedModuleId }, orderedIds, LESSON_ORDER_GAP),
  )

  assertBulkWriteMatchedAll(bulkResult.matchedCount, orderedIds.length, 'lesson')

  return Lesson.find({ moduleId: scopedModuleId }).sort({ order: 1 }).lean()
}

export async function listLessonsByCourse(courseId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  return Lesson.find({ courseId }).sort({ order: 1 }).lean()
}
