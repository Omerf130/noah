import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { Course, Lesson } from '../../db/models'
import { CourseNotFoundError } from './errors'
import { getCourseOutline } from './outline-service'

export type PublishValidationIssue = {
  code: string
  message: string
}

export async function validateCourseForPublish(courseId: string): Promise<PublishValidationIssue[]> {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new CourseNotFoundError()
  }

  const outline = await getCourseOutline(courseId)
  const issues: PublishValidationIssue[] = []
  const { course, modules } = outline

  if (!course.title.trim()) {
    issues.push({ code: 'title_missing', message: 'Course title is required' })
  }

  if (!course.slug.trim()) {
    issues.push({ code: 'slug_missing', message: 'Course slug is required' })
  }

  if (!course.shortDescription.trim()) {
    issues.push({ code: 'short_description_missing', message: 'Short description is required' })
  }

  if (!course.seo?.title?.trim()) {
    issues.push({ code: 'seo_title_missing', message: 'SEO title is required' })
  }

  if (!course.seo?.description?.trim()) {
    issues.push({ code: 'seo_description_missing', message: 'SEO description is required' })
  }

  if (!course.thumbnailAssetId) {
    issues.push({ code: 'thumbnail_missing', message: 'Course thumbnail is required' })
  }

  if (modules.length === 0) {
    issues.push({ code: 'modules_missing', message: 'At least one module is required' })
  }

  const lessons = modules.flatMap((courseModule) => courseModule.lessons)
  if (lessons.length === 0) {
    issues.push({ code: 'lessons_missing', message: 'At least one lesson is required' })
  }

  const lessonsWithBlocks = lessons.filter((lesson) => lesson.blocks.length > 0)
  if (lessonsWithBlocks.length === 0) {
    issues.push({
      code: 'lesson_blocks_missing',
      message: 'At least one lesson must contain content blocks',
    })
  }

  return issues
}

export async function canPublishCourse(courseId: string): Promise<boolean> {
  const issues = await validateCourseForPublish(courseId)
  return issues.length === 0
}

export async function getPublishBlockers(courseId: string): Promise<string[]> {
  const issues = await validateCourseForPublish(courseId)
  return issues.map((issue) => issue.message)
}

export async function countPublishedLessons(courseId: string): Promise<number> {
  await connectDb()
  return Lesson.countDocuments({ courseId, status: 'published' })
}

export async function getCoursePublishSummary(courseId: string) {
  await connectDb()

  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new CourseNotFoundError()
  }

  const issues = await validateCourseForPublish(courseId)

  return {
    courseId,
    status: course.status,
    canPublish: issues.length === 0,
    issues,
  }
}
