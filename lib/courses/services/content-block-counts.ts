import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { ContentBlock, Lesson } from '../../db/models'

export type LessonBlockCountSource = 'contentBlock' | 'legacyEmbedded'

export function resolveTransitionalBlockCount(input: {
  contentBlockCount: number
  legacyBlockCount: number
}): { count: number; source: LessonBlockCountSource } {
  if (input.contentBlockCount > 0) {
    return { count: input.contentBlockCount, source: 'contentBlock' }
  }

  return { count: input.legacyBlockCount, source: 'legacyEmbedded' }
}

export async function countContentBlocksForLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
): Promise<number> {
  await connectDb()

  return ContentBlock.countDocuments({
    courseId,
    moduleId,
    lessonId,
  })
}

export async function contentBlockExistsForLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
): Promise<boolean> {
  await connectDb()

  const exists = await ContentBlock.exists({
    courseId,
    moduleId,
    lessonId,
  })

  return Boolean(exists)
}

export async function getContentBlockCountsByLessonIds(
  lessonIds: string[],
  scope?: { courseId?: string; moduleId?: string },
): Promise<Map<string, number>> {
  await connectDb()

  const counts = new Map<string, number>()
  if (lessonIds.length === 0) {
    return counts
  }

  const objectIds = lessonIds.map((lessonId) => new mongoose.Types.ObjectId(lessonId))
  const match: Record<string, unknown> = { lessonId: { $in: objectIds } }

  if (scope?.courseId) {
    match.courseId = new mongoose.Types.ObjectId(scope.courseId)
  }

  if (scope?.moduleId) {
    match.moduleId = new mongoose.Types.ObjectId(scope.moduleId)
  }

  const aggregated = await ContentBlock.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
    { $match: match },
    { $group: { _id: '$lessonId', count: { $sum: 1 } } },
  ])

  for (const row of aggregated) {
    counts.set(String(row._id), row.count)
  }

  return counts
}

export async function getTransitionalBlockCountsForModuleLessons(
  courseId: string,
  moduleId: string,
  lessons: Array<{ _id: { toString(): string }; blocks?: unknown[] | null }>,
): Promise<Map<string, number>> {
  const lessonIds = lessons.map((lesson) => lesson._id.toString())
  const contentBlockCounts = await getContentBlockCountsByLessonIds(lessonIds, {
    courseId,
    moduleId,
  })
  const result = new Map<string, number>()

  for (const lesson of lessons) {
    const lessonId = lesson._id.toString()
    const resolved = resolveTransitionalBlockCount({
      contentBlockCount: contentBlockCounts.get(lessonId) ?? 0,
      legacyBlockCount: lesson.blocks?.length ?? 0,
    })
    result.set(lessonId, resolved.count)
  }

  return result
}

export async function lessonHasTransitionalContent(input: {
  courseId: string
  moduleId: string
  lessonId: string
  legacyBlocks?: unknown[] | null
}): Promise<boolean> {
  const hasContentBlocks = await contentBlockExistsForLesson(
    input.courseId,
    input.moduleId,
    input.lessonId,
  )

  if (hasContentBlocks) {
    return true
  }

  return (input.legacyBlocks?.length ?? 0) > 0
}

export async function countTransitionalLessonBlocksForCourse(courseId: string): Promise<number> {
  await connectDb()

  const lessons = await Lesson.find({ courseId }).select({ blocks: 1 }).lean()
  const contentBlockCounts = await getContentBlockCountsByLessonIds(
    lessons.map((lesson) => String(lesson._id)),
  )

  return lessons.reduce((total, lesson) => {
    const lessonId = String(lesson._id)
    const resolved = resolveTransitionalBlockCount({
      contentBlockCount: contentBlockCounts.get(lessonId) ?? 0,
      legacyBlockCount: lesson.blocks?.length ?? 0,
    })
    return total + resolved.count
  }, 0)
}

export async function courseHasTransitionalLessonContent(courseId: string): Promise<boolean> {
  await connectDb()

  const lessons = await Lesson.find({ courseId }).select({ blocks: 1 }).lean()
  if (lessons.length === 0) {
    return false
  }

  const contentBlockLessonIds = new Set(
    (await ContentBlock.distinct('lessonId', { courseId })).map(String),
  )

  for (const lesson of lessons) {
    const lessonId = String(lesson._id)
    if (contentBlockLessonIds.has(lessonId)) {
      return true
    }

    if ((lesson.blocks?.length ?? 0) > 0) {
      return true
    }
  }

  return false
}
