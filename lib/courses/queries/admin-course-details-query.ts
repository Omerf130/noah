import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, User } from '../../db/models'
import {
  mapToAdminCourseDetailsDto,
  type AdminCourseDetailsDto,
  type AdminCourseDetailsLeanCourse,
} from '../mappers/to-admin-course-details-dto'
import { parseCourseIdParam } from '../validators/course-id'

const courseDetailsProjection = {
  internalName: 1,
  title: 1,
  slug: 1,
  shortDescription: 1,
  category: 1,
  status: 1,
  visibility: 1,
  pricing: 1,
  featured: 1,
  moduleCount: 1,
  lessonCount: 1,
  estimatedDurationMinutes: 1,
  difficulty: 1,
  instructorId: 1,
  createdBy: 1,
  createdAt: 1,
  updatedAt: 1,
} as const

async function loadUserNamesById(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) {
    return new Map()
  }

  const objectIds = userIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id))

  const users = await User.find({ _id: { $in: objectIds } })
    .select({ fullName: 1 })
    .lean()

  return new Map(users.map((user) => [String(user._id), String(user.fullName)]))
}

export async function getAdminCourseDetails(
  courseId: string,
): Promise<AdminCourseDetailsDto | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return null
  }

  await connectDb()

  const course = (await Course.findById(parsedCourseId.courseId)
    .select(courseDetailsProjection)
    .lean()) as AdminCourseDetailsLeanCourse | null

  if (!course) {
    return null
  }

  const userNamesById = await loadUserNamesById([
    course.instructorId.toString(),
    course.createdBy.toString(),
  ])

  return mapToAdminCourseDetailsDto(course, userNamesById)
}

export async function getAdminCourseLeanById(
  courseId: string,
): Promise<AdminCourseDetailsLeanCourse | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return null
  }

  await connectDb()

  return (await Course.findById(parsedCourseId.courseId)
    .select(courseDetailsProjection)
    .lean()) as AdminCourseDetailsLeanCourse | null
}
