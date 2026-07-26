export const UNAUTHORIZED_MOVE_MODULE_ERROR = 'אין הרשאה לעדכן את סדר הפרקים.'
export const INVALID_MOVE_MODULE_REQUEST_ERROR = 'לא ניתן לעדכן את סדר הפרק. בדקו את הקישור ונסו שוב.'
export const GENERIC_MOVE_MODULE_ERROR =
  'לא ניתן לעדכן את סדר הפרקים. נסו לרענן את העמוד ולנסות שוב.'

export type MoveModuleActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
