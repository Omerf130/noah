export class CourseValidationError extends Error {
  readonly name = 'CourseValidationError'

  constructor(message: string) {
    super(message)
  }
}

export class CourseNotFoundError extends Error {
  readonly name = 'CourseNotFoundError'

  constructor(message = 'Course not found') {
    super(message)
  }
}

export class CourseModuleNotFoundError extends Error {
  readonly name = 'CourseModuleNotFoundError'

  constructor(message = 'Course module not found') {
    super(message)
  }
}

export class LessonNotFoundError extends Error {
  readonly name = 'LessonNotFoundError'

  constructor(message = 'Lesson not found') {
    super(message)
  }
}

export class CourseDuplicateKeyError extends Error {
  readonly name = 'CourseDuplicateKeyError'

  constructor(message = 'A course with this identifier already exists') {
    super(message)
  }
}

export function formatZodError(error: { issues: { message: string }[] }): string {
  return error.issues.map((issue) => issue.message).join('; ')
}
