import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { ContentBlock, CourseModule, Lesson } from '../../db/models'
import {
  mapToAdminLessonEditDto,
  type AdminLessonEditDto,
  type AdminLessonEditLeanLesson,
} from '../mappers/to-admin-lesson-edit-dto'
import { parseCourseIdParam } from '../validators/course-id'
import { parseLessonIdParam } from '../validators/lesson-id'
import { parseModuleIdParam } from '../validators/module-id'

export async function getAdminLessonEdit(
  courseId: string,
  moduleId: string,
  lessonId: string,
): Promise<AdminLessonEditDto | null> {
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

  const [lesson] = await Lesson.aggregate<AdminLessonEditLeanLesson>([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(parsedLessonId.lessonId),
        courseId: new mongoose.Types.ObjectId(parsedCourseId.courseId),
        moduleId: new mongoose.Types.ObjectId(parsedModuleId.moduleId),
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        summary: 1,
        order: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        courseId: 1,
        moduleId: 1,
        legacyBlockCount: { $size: { $ifNull: ['$blocks', []] } },
      },
    },
    {
      $lookup: {
        from: ContentBlock.collection.name,
        let: { lessonId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$lessonId', '$$lessonId'] },
                  { $eq: ['$courseId', new mongoose.Types.ObjectId(parsedCourseId.courseId)] },
                  { $eq: ['$moduleId', new mongoose.Types.ObjectId(parsedModuleId.moduleId)] },
                ],
              },
            },
          },
          { $count: 'count' },
        ],
        as: 'contentBlockStats',
      },
    },
    {
      $addFields: {
        contentBlockCount: {
          $ifNull: [{ $arrayElemAt: ['$contentBlockStats.count', 0] }, 0],
        },
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        summary: 1,
        order: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        courseId: 1,
        moduleId: 1,
        blockCount: {
          $cond: {
            if: { $gt: ['$contentBlockCount', 0] },
            then: '$contentBlockCount',
            else: '$legacyBlockCount',
          },
        },
      },
    },
  ])

  if (!lesson) {
    return null
  }

  return mapToAdminLessonEditDto(
    parsedCourseId.courseId,
    parsedModuleId.moduleId,
    lesson,
  )
}
