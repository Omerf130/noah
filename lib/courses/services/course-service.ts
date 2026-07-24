import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, isDuplicateKeyError } from '../../db/models'
import {
  parseCreateCourseInput,
  parseUpdateCourseInput,
  type CreateCourseInput,
  type UpdateCourseInput,
} from '../validators/course'
import type { AdminCourseMetadataTrustedInput } from '../validators/admin-course-metadata-fields'
import { isTrustedMetadataEqualToCourse } from '../validators/admin-course-metadata-fields'
import { parseCourseIdParam } from '../validators/course-id'
import { getCourseDuplicateKeyField } from './duplicate-key'
import {
  CourseDuplicateKeyError,
  CourseNotFoundError,
  CourseValidationError,
  formatZodError,
} from './errors'
import { validateCourseInstructor } from './instructor-service'

export async function createCourse(input: unknown, actorUserId: string) {
  await connectDb()

  const parsed = parseCreateCourseInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: CreateCourseInput = parsed.data

  await validateCourseInstructor(data.instructorId)

  try {
    const course = await Course.create({
      ...data,
      status: 'draft',
      moduleCount: 0,
      lessonCount: 0,
      createdBy: actorUserId,
      updatedBy: actorUserId,
    })

    return course.toObject()
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError(getCourseDuplicateKeyField(error))
    }

    throw error
  }
}

export async function getCourseById(courseId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new CourseNotFoundError()
  }

  return course
}

export async function getCourseBySlug(slug: string) {
  await connectDb()

  const course = await Course.findOne({ slug: slug.trim().toLowerCase() }).lean()
  if (!course) {
    throw new CourseNotFoundError()
  }

  return course
}

export async function getCourseByInternalName(internalName: string) {
  await connectDb()

  const course = await Course.findOne({
    internalName: internalName.trim().toLowerCase(),
  }).lean()

  if (!course) {
    throw new CourseNotFoundError()
  }

  return course
}

export async function listCourses(filters?: {
  status?: CreateCourseInput['status']
  visibility?: CreateCourseInput['visibility']
  category?: CreateCourseInput['category']
}) {
  await connectDb()

  const query: Record<string, unknown> = {}

  if (filters?.status) {
    query.status = filters.status
  }

  if (filters?.visibility) {
    query.visibility = filters.visibility
  }

  if (filters?.category) {
    query.category = filters.category
  }

  return Course.find(query).sort({ updatedAt: -1 }).lean()
}

export async function updateCourse(courseId: string, input: unknown, actorUserId: string) {
  await connectDb()

  const parsed = parseUpdateCourseInput(input)
  if (!parsed.success) {
    throw new CourseValidationError(formatZodError(parsed.error))
  }

  const data: UpdateCourseInput = parsed.data

  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          ...data,
          updatedBy: actorUserId,
        },
      },
      { returnDocument: 'after', runValidators: true },
    ).lean()

    if (!course) {
      throw new CourseNotFoundError()
    }

    return course
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError(getCourseDuplicateKeyField(error))
    }

    throw error
  }
}

export type UpdateCourseMetadataResult = {
  updated: boolean
  course: Awaited<ReturnType<typeof getCourseById>>
}

export async function updateCourseMetadata(
  courseId: string,
  trustedInput: AdminCourseMetadataTrustedInput,
  actorUserId: string,
): Promise<UpdateCourseMetadataResult> {
  await connectDb()

  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    throw new CourseNotFoundError()
  }

  const existingCourse = await Course.findById(parsedCourseId.courseId).lean()
  if (!existingCourse) {
    throw new CourseNotFoundError()
  }

  await validateCourseInstructor(trustedInput.instructorId)

  if (isTrustedMetadataEqualToCourse(trustedInput, existingCourse)) {
    return { updated: false, course: existingCourse }
  }

  const setPayload: Record<string, unknown> = {
    title: trustedInput.title,
    slug: trustedInput.slug,
    shortDescription: trustedInput.shortDescription,
    category: trustedInput.category,
    'pricing.price': trustedInput.pricing.price,
    'pricing.currency': trustedInput.pricing.currency,
    visibility: trustedInput.visibility,
    featured: trustedInput.featured,
    instructorId: trustedInput.instructorId,
    updatedBy: actorUserId,
  }

  const unsetPayload: Record<string, 1> = {}

  if (trustedInput.pricing.salePrice !== undefined) {
    setPayload['pricing.salePrice'] = trustedInput.pricing.salePrice
  } else {
    unsetPayload['pricing.salePrice'] = 1
  }

  if (trustedInput.estimatedDurationMinutes !== undefined) {
    setPayload.estimatedDurationMinutes = trustedInput.estimatedDurationMinutes
  } else {
    unsetPayload.estimatedDurationMinutes = 1
  }

  if (trustedInput.difficulty !== undefined) {
    setPayload.difficulty = trustedInput.difficulty
  } else {
    unsetPayload.difficulty = 1
  }

  try {
    const course = await Course.findByIdAndUpdate(
      parsedCourseId.courseId,
      {
        ...(Object.keys(setPayload).length > 0 ? { $set: setPayload } : {}),
        ...(Object.keys(unsetPayload).length > 0 ? { $unset: unsetPayload } : {}),
      },
      { returnDocument: 'after', runValidators: true },
    ).lean()

    if (!course) {
      throw new CourseNotFoundError()
    }

    return { updated: true, course }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CourseDuplicateKeyError(getCourseDuplicateKeyField(error))
    }

    throw error
  }
}

export async function archiveCourse(courseId: string, actorUserId: string) {
  return updateCourse(
    courseId,
    {
      status: 'archived',
      archivedAt: new Date(),
    },
    actorUserId,
  )
}

export async function publishCourse(courseId: string, actorUserId: string) {
  return updateCourse(
    courseId,
    {
      status: 'published',
      publishedAt: new Date(),
      archivedAt: null,
    },
    actorUserId,
  )
}
