import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, CourseModule, Lesson, isDuplicateKeyError } from '../../db/models'
import { MODULE_ORDER_GAP, SLUG_PATTERN } from '../constants'
import {
  parseCreateModuleInput,
  parseReorderModulesInput,
  parseUpdateModuleInput,
  type CreateModuleInput,
  type UpdateModuleInput,
} from '../validators/module'
import { parseModuleIdParam } from '../validators/module-id'
import type { AdminModuleMetadataTrustedInput } from '../validators/admin-module-metadata-fields'
import { normalizeSlug } from '../validators/shared'
import {
  CourseDuplicateKeyError,
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
  ModuleCountSyncError,
  ModuleDeletionFailedError,
  formatZodError,
} from './errors'
import {
  assertBulkWriteMatchedAll,
  buildScopedOrderUpdates,
  validateScopedReorderIds,
} from './reorder-utils'

const MODULE_NOT_FOUND_MESSAGE = 'הפרק המבוקש לא נמצא.'
const MODULE_DELETE_WITH_LESSONS_MESSAGE =
  'לא ניתן למחוק את הפרק משום שקיימים בו שיעורים. יש למחוק או להעביר את השיעורים תחילה.'
const MODULE_DUPLICATE_SLUG_MESSAGE = 'כבר קיים פרק עם מזהה מערכת זה בקורס.'

async function assertCourseExists(courseId: string) {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError('הקורס המבוקש לא נמצא.')
  }

  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new CourseNotFoundError('הקורס המבוקש לא נמצא.')
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

async function incrementCourseModuleCount(courseId: string) {
  await Course.findByIdAndUpdate(courseId, { $inc: { moduleCount: 1 } })
}

async function decrementCourseModuleCount(courseId: string) {
  const updatedCourse = await Course.findOneAndUpdate(
    { _id: courseId, moduleCount: { $gte: 1 } },
    { $inc: { moduleCount: -1 } },
    { returnDocument: 'after' },
  ).lean()

  if (!updatedCourse) {
    throw new ModuleCountSyncError()
  }

  return updatedCourse
}

function slugifyModuleTitle(title: string): string {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  if (normalized.length > 0 && SLUG_PATTERN.test(normalized)) {
    return normalized
  }

  return `module-${Date.now().toString(36)}`
}

export async function generateModuleSlug(courseId: string, title: string): Promise<string> {
  await connectDb()

  const baseSlug = slugifyModuleTitle(title)
  let candidate = baseSlug
  let suffix = 2

  while (await CourseModule.exists({ courseId, slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return normalizeSlug(candidate)
}

export async function assertModuleBelongsToCourse(courseId: string, moduleId: string) {
  await connectDb()

  const parsedModuleId = parseModuleIdParam(moduleId)
  if (!parsedModuleId.success) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  const courseModule = await CourseModule.findById(parsedModuleId.moduleId).lean()
  if (!courseModule || String(courseModule.courseId) !== courseId) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  return courseModule
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
  const slug = data.slug ?? (await generateModuleSlug(courseId, data.title))

  try {
    const courseModule = await CourseModule.create({
      courseId,
      title: data.title,
      slug,
      description: data.description,
      order,
      publicationStatus: data.publicationStatus ?? 'draft',
      releaseRule: data.releaseRule,
      isLockedByDefault: data.isLockedByDefault,
      lessonCount: 0,
    })

    await incrementCourseModuleCount(courseId)
    return courseModule.toObject()
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('unknown', MODULE_DUPLICATE_SLUG_MESSAGE)
    }

    throw error
  }
}

export async function getModuleById(moduleId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  const courseModule = await CourseModule.findById(moduleId).lean()
  if (!courseModule) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  return courseModule
}

export async function listModulesByCourse(courseId: string) {
  await connectDb()
  await assertCourseExists(courseId)

  return CourseModule.find({ courseId }).sort({ order: 1 }).lean()
}

export async function updateModule(moduleId: string, input: unknown, courseId?: string) {
  await connectDb()

  if (courseId) {
    await assertModuleBelongsToCourse(courseId, moduleId)
  }

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
      throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
    }

    return courseModule
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('unknown', MODULE_DUPLICATE_SLUG_MESSAGE)
    }

    throw error
  }
}

function normalizeModuleDescription(value: string | undefined | null): string {
  return value?.trim() ?? ''
}

function isTrustedMetadataEqualToModule(
  trustedInput: AdminModuleMetadataTrustedInput,
  courseModule: {
    title: string
    description?: string | null
    publicationStatus?: string
  },
): boolean {
  return (
    trustedInput.title === courseModule.title &&
    normalizeModuleDescription(trustedInput.description) ===
      normalizeModuleDescription(courseModule.description) &&
    trustedInput.publicationStatus === (courseModule.publicationStatus ?? 'draft')
  )
}

export type UpdateModuleMetadataResult = {
  updated: boolean
  module: Awaited<ReturnType<typeof getModuleById>>
}

export async function updateModuleMetadata(
  courseId: string,
  moduleId: string,
  trustedInput: AdminModuleMetadataTrustedInput,
): Promise<UpdateModuleMetadataResult> {
  await connectDb()

  const existingModule = await assertModuleBelongsToCourse(courseId, moduleId)

  if (isTrustedMetadataEqualToModule(trustedInput, existingModule)) {
    return { updated: false, module: existingModule }
  }

  const setPayload: Record<string, unknown> = {
    title: trustedInput.title,
    publicationStatus: trustedInput.publicationStatus,
  }
  const unsetPayload: Record<string, 1> = {}
  const normalizedDescription = normalizeModuleDescription(trustedInput.description)

  if (normalizedDescription) {
    setPayload.description = normalizedDescription
  } else {
    unsetPayload.description = 1
  }

  try {
    const courseModule = await CourseModule.findByIdAndUpdate(
      moduleId,
      {
        $set: setPayload,
        ...(Object.keys(unsetPayload).length > 0 ? { $unset: unsetPayload } : {}),
      },
      { returnDocument: 'after', runValidators: true },
    ).lean()

    if (!courseModule) {
      throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
    }

    if (String(courseModule.courseId) !== courseId) {
      throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
    }

    return { updated: true, module: courseModule }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError('unknown', MODULE_DUPLICATE_SLUG_MESSAGE)
    }

    throw error
  }
}

export async function deleteModuleFromCourse(courseId: string, moduleId: string) {
  await connectDb()
  await assertModuleBelongsToCourse(courseId, moduleId)

  const lessonExists = await Lesson.exists({ moduleId })
  if (lessonExists) {
    throw new CourseValidationError(MODULE_DELETE_WITH_LESSONS_MESSAGE)
  }

  const deleteResult = await CourseModule.deleteOne({ _id: moduleId, courseId })

  if (deleteResult.deletedCount !== 1) {
    throw new ModuleDeletionFailedError()
  }

  try {
    await decrementCourseModuleCount(courseId)
  } catch (error) {
    if (error instanceof ModuleCountSyncError) {
      console.error('Module count sync failed after deletion', {
        courseId,
        moduleId,
      })
      throw error
    }

    throw error
  }

  return { deleted: true, moduleId }
}

export async function deleteModule(moduleId: string, courseId?: string) {
  await connectDb()

  const courseModule = await CourseModule.findById(moduleId).lean()
  if (!courseModule) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  const resolvedCourseId = String(courseModule.courseId)

  if (courseId && resolvedCourseId !== courseId) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  return deleteModuleFromCourse(resolvedCourseId, moduleId)
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

  return CourseModule.find({ courseId }).sort({ order: 1 }).lean()
}

export async function moveModuleInCourse(
  courseId: string,
  moduleId: string,
  direction: 'up' | 'down',
) {
  await assertCourseExists(courseId)
  await assertModuleBelongsToCourse(courseId, moduleId)

  const modules = await CourseModule.find({ courseId }).sort({ order: 1 }).select('_id').lean()
  const orderedIds = modules.map((module) => String(module._id))
  const currentIndex = orderedIds.indexOf(moduleId)

  if (currentIndex === -1) {
    throw new CourseModuleNotFoundError(MODULE_NOT_FOUND_MESSAGE)
  }

  if (
    (direction === 'up' && currentIndex === 0) ||
    (direction === 'down' && currentIndex === orderedIds.length - 1)
  ) {
    return CourseModule.find({ courseId }).sort({ order: 1 }).lean()
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  const reorderedIds = [...orderedIds]
  ;[reorderedIds[currentIndex], reorderedIds[targetIndex]] = [
    reorderedIds[targetIndex],
    reorderedIds[currentIndex],
  ]

  return reorderModules(courseId, { orderedModuleIds: reorderedIds })
}
