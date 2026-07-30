import { connectDb } from '../../db/connect'
import { Course, CourseModule } from '../../db/models'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'

export type AdminModuleLessonContextDto = {
  courseId: string
  courseTitle: string
  courseShortDescription: string
  moduleId: string
  moduleTitle: string
}

const courseProjection = {
  title: 1,
  shortDescription: 1,
} as const

const moduleProjection = {
  courseId: 1,
  title: 1,
} as const

export async function getAdminModuleLessonContext(
  courseId: string,
  moduleId: string,
): Promise<AdminModuleLessonContextDto | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)

  if (!parsedCourseId.success || !parsedModuleId.success) {
    return null
  }

  await connectDb()

  const [course, courseModule] = await Promise.all([
    Course.findById(parsedCourseId.courseId).select(courseProjection).lean(),
    CourseModule.findById(parsedModuleId.moduleId).select(moduleProjection).lean(),
  ])

  if (!course || !courseModule) {
    return null
  }

  if (String(courseModule.courseId) !== parsedCourseId.courseId) {
    return null
  }

  return {
    courseId: parsedCourseId.courseId,
    courseTitle: course.title,
    courseShortDescription: course.shortDescription,
    moduleId: parsedModuleId.moduleId,
    moduleTitle: courseModule.title,
  }
}
