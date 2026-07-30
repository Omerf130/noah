import { describe, expect, it } from 'vitest'
import {
  LESSON_SLUG_FALLBACK,
  buildLessonSlugCandidate,
  slugifyLessonTitle,
} from '../services/lesson-slug'

describe('lesson slug utilities', () => {
  it('slugifies ASCII titles', () => {
    expect(slugifyLessonTitle('Intro Lesson')).toBe('intro-lesson')
    expect(slugifyLessonTitle('  Hello   World  ')).toBe('hello-world')
  })

  it('falls back to lesson for Hebrew-only titles', () => {
    expect(slugifyLessonTitle('שיעור ראשון')).toBe(LESSON_SLUG_FALLBACK)
    expect(slugifyLessonTitle('   ')).toBe(LESSON_SLUG_FALLBACK)
  })

  it('builds collision suffix candidates', () => {
    expect(buildLessonSlugCandidate('intro-lesson', 0)).toBe('intro-lesson')
    expect(buildLessonSlugCandidate('intro-lesson', 1)).toBe('intro-lesson-2')
    expect(buildLessonSlugCandidate('lesson', 2)).toBe('lesson-3')
  })

  it('never produces an empty slug candidate from fallback base', () => {
    const base = slugifyLessonTitle('שיעור')
    expect(base.length).toBeGreaterThan(0)
    expect(buildLessonSlugCandidate(base, 0)).toBe(LESSON_SLUG_FALLBACK)
  })
})
