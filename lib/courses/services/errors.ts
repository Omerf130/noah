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

export type CourseDuplicateKeyField = 'internalName' | 'slug' | 'unknown'

export class CourseDuplicateKeyError extends Error {
  readonly name = 'CourseDuplicateKeyError'
  readonly field: CourseDuplicateKeyField

  constructor(
    field: CourseDuplicateKeyField = 'unknown',
    message = 'A course with this identifier already exists',
  ) {
    super(message)
    this.field = field
  }
}

export type CourseInstructorErrorReason = 'invalid' | 'inactive'

export class CourseInstructorError extends Error {
  readonly name = 'CourseInstructorError'
  readonly reason: CourseInstructorErrorReason

  constructor(reason: CourseInstructorErrorReason) {
    super(reason === 'inactive' ? 'Instructor is inactive' : 'Invalid instructor')
    this.reason = reason
  }
}

export function formatZodError(error: { issues: { message: string }[] }): string {
  return error.issues.map((issue) => issue.message).join('; ')
}
