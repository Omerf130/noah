import { connectDb } from '../../db/connect'
import { Lesson } from '../../db/models'
import { normalizeSlug } from '../validators/shared'
import {
  findAvailableLessonSlug,
  slugifyLessonTitle,
} from './lesson-slug'

export { slugifyLessonTitle, buildLessonSlugCandidate, LESSON_SLUG_FALLBACK } from './lesson-slug'

export async function lessonSlugExists(courseId: string, slug: string): Promise<boolean> {
  await connectDb()
  return Boolean(await Lesson.exists({ courseId, slug: normalizeSlug(slug) }))
}

export async function generateLessonSlug(courseId: string, title: string): Promise<string> {
  await connectDb()

  const baseSlug = slugifyLessonTitle(title)
  return findAvailableLessonSlug(courseId, baseSlug, lessonSlugExists)
}

export async function generateLessonSlugWithSuffixAttempt(
  courseId: string,
  title: string,
  suffixAttempt: number,
): Promise<string> {
  await connectDb()

  const baseSlug = slugifyLessonTitle(title)
  return findAvailableLessonSlug(courseId, baseSlug, lessonSlugExists, suffixAttempt)
}
