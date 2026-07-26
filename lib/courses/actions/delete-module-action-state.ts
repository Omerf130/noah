export const UNAUTHORIZED_DELETE_MODULE_ERROR = 'אין הרשאה למחוק פרקים.'
export const INVALID_DELETE_MODULE_REQUEST_ERROR = 'לא ניתן למחוק את הפרק. בדקו את הקישור ונסו שוב.'
export const GENERIC_DELETE_MODULE_ERROR = 'מחיקת הפרק נכשלה. נסו שוב מאוחר יותר.'
export const MODULE_COUNT_SYNC_ERROR =
  'הפרק נמחק אך עדכון ספירת הפרקים נכשל. פנו לתמיכה לסנכרון הנתונים.'

export type DeleteModuleActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
