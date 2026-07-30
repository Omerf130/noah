export const UNAUTHORIZED_DELETE_LESSON_ERROR = 'אין הרשאה למחוק שיעורים.'
export const INVALID_DELETE_LESSON_REQUEST_ERROR =
  'לא ניתן למחוק את השיעור. בדקו את הקישור ונסו שוב.'
export const GENERIC_DELETE_LESSON_ERROR = 'מחיקת השיעור נכשלה. נסו שוב מאוחר יותר.'
export const LESSON_COUNT_SYNC_ERROR =
  'השיעור נמחק אך עדכון ספירת השיעורים נכשל. פנו לתמיכה לסנכרון הנתונים.'

export type DeleteLessonActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
