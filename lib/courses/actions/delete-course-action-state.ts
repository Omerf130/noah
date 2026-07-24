export const UNAUTHORIZED_DELETE_COURSE_ERROR = 'אין לכם הרשאה למחוק קורס.'
export const INVALID_DELETE_COURSE_REQUEST_ERROR = 'בקשת המחיקה אינה תקינה.'
export const GENERIC_DELETE_COURSE_ERROR = 'אירעה שגיאה במחיקת הקורס. נסו שוב מאוחר יותר.'

export type DeleteCourseActionResult = {
  status: 'success' | 'error'
  message?: string
}
