import { connectDb } from '../../db/connect'
import { ContentBlock, CourseModule, Lesson } from '../../db/models'
import {
  mapToAdminRichTextBlockEditDto,
  type AdminRichTextBlockEditDto,
  type AdminRichTextBlockEditLeanBlock,
} from '../mappers/to-admin-rich-text-block-edit-dto'
import { parseBlockIdParam } from '../validators/content-block'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'

const richTextBlockEditProjection = {
  type: 1,
  order: 1,
  richTextData: 1,
} as const

export async function getAdminRichTextBlockEdit(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
): Promise<AdminRichTextBlockEditDto | null> {
  const parsedCourseId = parseCourseIdParam(courseId)
  const parsedModuleId = parseModuleIdParam(moduleId)
  const parsedLessonId = parseLessonIdParam(lessonId)
  const parsedBlockId = parseBlockIdParam(blockId)

  if (
    !parsedCourseId.success ||
    !parsedModuleId.success ||
    !parsedLessonId.success ||
    !parsedBlockId.success
  ) {
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

  const block = (await ContentBlock.findOne({
    _id: parsedBlockId.blockId,
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
    lessonId: parsedLessonId.lessonId,
  })
    .select(richTextBlockEditProjection)
    .lean()) as AdminRichTextBlockEditLeanBlock | null

  if (!block || block.type !== 'richText') {
    return null
  }

  return mapToAdminRichTextBlockEditDto({
    courseId: parsedCourseId.courseId,
    moduleId: parsedModuleId.moduleId,
    lessonId: parsedLessonId.lessonId,
    lessonTitle: lesson.title,
    block,
  })
}
