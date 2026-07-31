import { connectDb } from '../../db/connect'
import { CourseModule, Lesson } from '../../db/models'
import {
  mapToAdminLessonListItemDto,
  type AdminLessonListItemDto,
  type AdminLessonListItemLeanLesson,
} from '../mappers/to-admin-lesson-list-item-dto'
import { getTransitionalBlockCountsForModuleLessons } from '../services/content-block-counts'
import { parseCourseIdParam } from '../validators/course-id'
import { parseModuleIdParam } from '../validators/module-id'

const lessonListProjection = {
  title: 1,
  summary: 1,
  order: 1,
  status: 1,
  blocks: 1,
} as const

export type AdminLessonListResult = {
  courseId: string
  moduleId: string
  items: AdminLessonListItemDto[]
  totalItems: number
}

export async function listAdminModuleLessons(
  courseId: string,
  moduleId: string,
): Promise<AdminLessonListResult | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)

  if (!parsedCourseId.success || !parsedModuleId.success) {
    return null
  }

  await connectDb()

  const courseModule = await CourseModule.findById(parsedModuleId.moduleId)
    .select({ courseId: 1 })
    .lean()

  if (!courseModule || String(courseModule.courseId) !== parsedCourseId.courseId) {
    return null
  }

  const lessons = (await Lesson.find({ moduleId: parsedModuleId.moduleId })
    .select(lessonListProjection)
    .sort({ order: 1 })
    .lean()) as AdminLessonListItemLeanLesson[]

  const blockCountsByLessonId = await getTransitionalBlockCountsForModuleLessons(
    parsedCourseId.courseId,
    parsedModuleId.moduleId,
    lessons,
  )

  return {
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
    items: lessons.map((lesson, index) =>
      mapToAdminLessonListItemDto(
        lesson,
        index + 1,
        blockCountsByLessonId.get(lesson._id.toString()) ?? 0,
      ),
    ),
    totalItems: lessons.length,
  }
}
