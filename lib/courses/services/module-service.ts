import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, isDuplicateKeyError } from '../../db/models'
import { MODULE_ORDER_GAP } from '../constants'
import {
  parseCreateModuleInput,
  parseReorderModulesInput,
  parseUpdateModuleInput,
  type CreateModuleInput,
  type UpdateModuleInput,
} from '../validators/module'
import {
  CourseDuplicateKeyError,
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
  formatZodError,
} from './errors'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
  validateScopedReorderIds,
} from './reorder-utils'

async function assertCourseExists(courseId: string) {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new CourseNotFoundError()
  }

  return course
}

async function getNextModuleOrder(courseId: string): Promise<number> {
  const lastModule = await CourseModule.findOne({ courseId })
    .sort({ order: -1 })
    .select('order')
    .lean()

  if (!lastModule) {
    return MODULE_ORDER_GAP
  }

  return lastModule.order + MODULE_ORDER_GAP
}

async function syncCourseModuleCount(courseId: string) {
  const moduleCount = await CourseModule.countDocuments({ courseId })
  await Course.findByIdAndUpdate(courseId, { moduleCount })
}

export async function createModule(courseId: string, input: unknown) {
  await connectDb()
  await assertCourseExists(courseId)

  const parsed = parseCreateModuleInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: CreateModuleInput = parsed.data
  const order = data.order ?? (await getNextModuleOrder(courseId))

  try {
    const courseModule = await CourseModule.create({
      courseId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      order,
      releaseRule: data.releaseRule,
      isLockedByDefault: data.isLockedByDefault,
      lessonCount: 0,
    })

    await syncCourseModuleCount(courseId)
    return courseModule.toObject()
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('A module with this slug already exists in the course')
    }

    throw error
  }
}

export async function getModuleById(moduleId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    throw new CourseModuleNotFoundError()
  }

  const courseModule = await CourseModule.findById(moduleId).lean()
  if (!courseModule) {
    throw new CourseModuleNotFoundError()
  }

  return courseModule
}

export async function listModulesByCourse(courseId: string) {
  await connectDb()
  await assertCourseExists(courseId)

  return CourseModule.find({ courseId }).sort({ order: 1 }).lean()
}

export async function updateModule(moduleId: string, input: unknown) {
  await connectDb()

  const parsed = parseUpdateModuleInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: UpdateModuleInput = parsed.data

  try {
    const courseModule = await CourseModule.findByIdAndUpdate(
      moduleId,
      { $set: data },
      { returnDocument: 'after', runValidators: true },
    ).lean()

    if (!courseModule) {
      throw new CourseModuleNotFoundError()
    }

    return courseModule
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('A module with this slug already exists in the course')
    }

    throw error
  }
}

export async function deleteModule(moduleId: string) {
  await connectDb()

  const courseModule = await CourseModule.findById(moduleId).lean()
  if (!courseModule) {
    throw new CourseModuleNotFoundError()
  }

  const lessonCount = await Lesson.countDocuments({ moduleId })
  if (lessonCount > 0) {
    throw new CourseValidationError('Cannot delete a module that still contains lessons')
  }

  await CourseModule.findByIdAndDelete(moduleId)
  await syncCourseModuleCount(String(courseModule.courseId))

  return { deleted: true, moduleId }
}

export async function reorderModules(courseId: string, input: unknown) {
  await connectDb()
  await assertCourseExists(courseId)

  const parsed = parseReorderModulesInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const modules = await CourseModule.find({ courseId }).select('_id order').lean()
  const existingIds = new Set(modules.map((module) => String(module._id)))
  const orderedIds = parsed.data.orderedModuleIds

  validateScopedReorderIds(orderedIds, existingIds, 'module')

  const scopedCourseId = new mongoose.Types.ObjectId(courseId)
  const bulkResult = await CourseModule.bulkWrite(
    buildScopedOrderUpdates({ courseId: scopedCourseId }, orderedIds, MODULE_ORDER_GAP),
  )

  assertBulkWriteMatchedAll(bulkResult.matchedCount, orderedIds.length, 'module')

  return CourseModule.find({ courseId: scopedCourseId }).sort({ order: 1 }).lean()
}
