import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course } from '../../db/models'
import { CourseNotFoundError } from './errors'
import { countTransitionalLessonBlocksForCourse } from './content-block-counts'
import { listLessonsByModule } from './lesson-service'
import { listModulesByCourse } from './module-service'

export type CourseOutlineModule = Awaited<ReturnType<typeof listModulesByCourse>>[number] & {
  lessons: Awaited<ReturnType<typeof listLessonsByModule>>
}

export type CourseOutline = Awaited<ReturnType<typeof getCourseOutline>>

export async function getCourseOutline(courseId: string) {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new CourseNotFoundError()
  }

  const modules = await listModulesByCourse(courseId)
  const modulesWithLessons: CourseOutlineModule[] = await Promise.all(
    modules.map(async (courseModule) => ({
      ...courseModule,
      lessons: await listLessonsByModule(String(courseModule._id)),
    })),
  )

  return {
    course,
    modules: modulesWithLessons,
  }
}

export async function getPublishedCourseOutlineBySlug(slug: string) {
  await connectDb()

  const course = await Course.findOne({
    slug: slug.trim().toLowerCase(),
    status: 'published',
  }).lean()

  if (!course) {
    throw new CourseNotFoundError()
  }

  return getCourseOutline(String(course._id))
}

export async function countLessonBlocks(courseId: string) {
  return countTransitionalLessonBlocksForCourse(courseId)
}
