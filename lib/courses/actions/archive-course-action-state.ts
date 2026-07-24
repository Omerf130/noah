export const UNAUTHORIZED_ARCHIVE_COURSE_ERROR = 'אין לכם הרשאה להעביר קורס לארכיון.'
export const INVALID_ARCHIVE_COURSE_REQUEST_ERROR = 'בקשת הארכיון אינה תקינה.'
export const ARCHIVE_COURSE_NOT_ALLOWED_ERROR = 'ניתן להעביר לארכיון רק קורסים בסטטוס טיוטה.'
export const GENERIC_ARCHIVE_COURSE_ERROR = 'אירעה שגיאה בהעברת הקורס לארכיון. נסו שוב מאוחר יותר.'

export type ArchiveCourseActionResult = {
  status: 'success' | 'error'
  message?: string
}
