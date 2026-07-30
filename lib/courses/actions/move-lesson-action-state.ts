export const UNAUTHORIZED_MOVE_LESSON_ERROR = 'אין הרשאה לעדכן את סדר השיעורים.'
export const INVALID_MOVE_LESSON_REQUEST_ERROR =
  'לא ניתן לעדכן את סדר השיעור. בדקו את הקישור ונסו שוב.'
export const GENERIC_MOVE_LESSON_ERROR =
  'לא ניתן לעדכן את סדר השיעורים. נסו לרענן את העמוד ולנסות שוב.'

export type MoveLessonActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
