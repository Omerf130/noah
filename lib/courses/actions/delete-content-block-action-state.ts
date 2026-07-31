export const UNAUTHORIZED_DELETE_CONTENT_BLOCK_ERROR = 'אין הרשאה למחוק בלוקי תוכן.'
export const INVALID_DELETE_CONTENT_BLOCK_REQUEST_ERROR =
  'לא ניתן למחוק את בלוק התוכן. בדקו את הקישור ונסו שוב.'
export const GENERIC_DELETE_CONTENT_BLOCK_ERROR =
  'לא ניתן למחוק את בלוק התוכן. נסו לרענן את העמוד ולנסות שוב.'

export type DeleteContentBlockActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
