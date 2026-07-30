import { SLUG_PATTERN } from '../constants'
import { normalizeSlug } from '../validators/shared'

export const LESSON_SLUG_FALLBACK = 'lesson'

export function slugifyLessonTitle(title: string): string {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  if (normalized.length > 0 && SLUG_PATTERN.test(normalized)) {
    return normalized
  }

  return LESSON_SLUG_FALLBACK
}

export function buildLessonSlugCandidate(baseSlug: string, suffixAttempt: number): string {
  if (suffixAttempt <= 0) {
    return baseSlug
  }

  return `${baseSlug}-${suffixAttempt + 1}`
}

export async function findAvailableLessonSlug(
  courseId: string,
  baseSlug: string,
  exists: (courseId: string, slug: string) => Promise<boolean>,
  startSuffixAttempt = 0,
): Promise<string> {
  let suffixAttempt = startSuffixAttempt

  while (suffixAttempt < 100) {
    const candidate = normalizeSlug(buildLessonSlugCandidate(baseSlug, suffixAttempt))
    const taken = await exists(courseId, candidate)

    if (!taken) {
      return candidate
    }

    suffixAttempt += 1
  }

  throw new Error('Unable to resolve a unique lesson slug')
}
