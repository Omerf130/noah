export const UNAUTHORIZED_MOVE_CONTENT_BLOCK_ERROR = 'אין הרשאה לעדכן את סדר בלוקי התוכן.'
export const INVALID_MOVE_CONTENT_BLOCK_REQUEST_ERROR =
  'לא ניתן לעדכן את סדר בלוק התוכן. בדקו את הקישור ונסו שוב.'
export const GENERIC_MOVE_CONTENT_BLOCK_ERROR =
  'לא ניתן לעדכן את סדר בלוקי התוכן. נסו לרענן את העמוד ולנסות שוב.'

export type MoveContentBlockActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
