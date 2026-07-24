import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, Lesson } from '../../db/models'
import { CourseNotFoundError } from './errors'
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
  await connectDb()

  const lessons = await Lesson.find({ courseId }).select('blocks').lean()
  return lessons.reduce((total, lesson) => total + lesson.blocks.length, 0)
}
