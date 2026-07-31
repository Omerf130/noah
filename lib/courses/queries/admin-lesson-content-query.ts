import { connectDb } from '../../db/connect'
import { ContentBlock, CourseModule, Lesson } from '../../db/models'
import {
  mapToAdminContentBlockListItemDto,
  type AdminContentBlockListItemDto,
  type AdminContentBlockListItemLeanBlock,
} from '../mappers/to-admin-content-block-list-item-dto'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'

const contentBlockListProjection = {
  type: 1,
  order: 1,
  richTextData: 1,
} as const

export type AdminLessonContentResult = {
  courseId: string
  moduleId: string
  lessonId: string
  lessonTitle: string
  items: AdminContentBlockListItemDto[]
  totalItems: number
}

export async function listAdminLessonContentBlocks(
  courseId: string,
  moduleId: string,
  lessonId: string,
): Promise<AdminLessonContentResult | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)

  if (!parsedCourseId.success || !parsedModuleId.success || !parsedLessonId.success) {
    return null
  }

  await connectDb()

  const courseModule = await CourseModule.findById(parsedModuleId.moduleId)
    .select({ courseId: 1 })
    .lean()

  if (!courseModule || String(courseModule.courseId) !== parsedCourseId.courseId) {
    return null
  }

  const lesson = await Lesson.findOne({
    _id: parsedLessonId.lessonId,
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
  })
    .select({ title: 1 })
    .lean()

  if (!lesson) {
    return null
  }

  const blocks = (await ContentBlock.find({
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
    lessonId: parsedLessonId.lessonId,
  })
    .select(contentBlockListProjection)
    .sort({ order: 1 })
    .lean()) as AdminContentBlockListItemLeanBlock[]

  return {
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
    lessonId: parsedLessonId.lessonId,
    lessonTitle: lesson.title,
    items: blocks.map((block, index) =>
      mapToAdminContentBlockListItemDto(block, index + 1, blocks.length),
    ),
    totalItems: blocks.length,
  }
}
