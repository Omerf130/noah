import { connectDb } from '../../db/connect'
import { Course } from '../../db/models'
import { parseCourseIdParam } from '../validators/course-id'

export type AdminCourseContentContextDto = {
  id: string
  title: string
  shortDescription: string
}

const courseContentContextProjection = {
  title: 1,
  shortDescription: 1,
} as const

export async function getAdminCourseContentContext(
  courseId: string,
): Promise<AdminCourseContentContextDto | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  if (!parsedCourseId.success) {
    return null
  }

  await connectDb()

  const course = await Course.findById(parsedCourseId.courseId)
    .select(courseContentContextProjection)
    .lean()

  if (!course) {
    return null
  }

  return {
    id: parsedCourseId.courseId,
    title: course.title,
    shortDescription: course.shortDescription,
  }
}
