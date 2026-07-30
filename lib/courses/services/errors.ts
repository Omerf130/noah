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

  constructor(message = 'הפרק המבוקש לא נמצא.') {
    super(message)
  }
}

export class LessonNotFoundError extends Error {
  readonly name = 'LessonNotFoundError'

  constructor(message = 'השיעור המבוקש לא נמצא.') {
    super(message)
  }
}

export class LessonDuplicateSlugError extends Error {
  readonly name = 'LessonDuplicateSlugError'

  constructor(message = 'כבר קיים שיעור עם מזהה מערכת זה בקורס.') {
    super(message)
  }
}

/**
 * Raised when a lesson insert transaction cannot increment parent lessonCount on exactly one document.
 * The surrounding transaction aborts so no partial lesson or count update remains.
 */
export class LessonCountSyncError extends Error {
  readonly name = 'LessonCountSyncError'

  constructor(message = 'יצירת השיעור נכשלה בעדכון ספירת השיעורים. נסו שוב מאוחר יותר.') {
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

export class CourseArchiveNotAllowedError extends Error {
  readonly name = 'CourseArchiveNotAllowedError'

  constructor(message = 'ניתן להעביר לארכיון רק קורסים בסטטוס טיוטה.') {
    super(message)
  }
}

export class CourseDeletionNotEligibleError extends Error {
  readonly name = 'CourseDeletionNotEligibleError'

  constructor(message = 'לא ניתן למחוק קורס זה. ניתן להעביר אותו לארכיון במקום.') {
    super(message)
  }
}

export class CourseDeletionConfirmationError extends Error {
  readonly name = 'CourseDeletionConfirmationError'

  constructor(message = 'יש להקליד את שם הקורס בדיוק כדי לאשר מחיקה.') {
    super(message)
  }
}

export class CourseDeletionFailedError extends Error {
  readonly name = 'CourseDeletionFailedError'

  constructor(message = 'מחיקת הקורס נכשלה. נסו שוב מאוחר יותר.') {
    super(message)
  }
}

export class ModuleDeletionFailedError extends Error {
  readonly name = 'ModuleDeletionFailedError'

  constructor(message = 'מחיקת הפרק נכשלה. נסו שוב מאוחר יותר.') {
    super(message)
  }
}

/**
 * Raised when a module was deleted but Course.moduleCount could not be decremented.
 * Repair: recount CourseModule documents for courseId and set Course.moduleCount to match.
 */
export class ModuleCountSyncError extends Error {
  readonly name = 'ModuleCountSyncError'

  constructor(
    message = 'הפרק נמחק אך עדכון ספירת הפרקים נכשל. פנו לתמיכה לסנכרון הנתונים.',
  ) {
    super(message)
  }
}
