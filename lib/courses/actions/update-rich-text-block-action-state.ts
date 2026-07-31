export type UpdateRichTextBlockActionState = {
  status: 'idle' | 'error' | 'no-op'
  message?: string
  values?: {
    documentJson: string
  }
}

export const initialUpdateRichTextBlockActionState: UpdateRichTextBlockActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_UPDATE_RICH_TEXT_BLOCK_ERROR = 'אין לכם הרשאה לערוך בלוק תוכן'
export const INVALID_UPDATE_RICH_TEXT_BLOCK_REQUEST_ERROR = 'בקשת עריכת בלוק התוכן אינה תקינה.'
export const GENERIC_UPDATE_RICH_TEXT_BLOCK_ERROR =
  'אירעה שגיאה בשמירת בלוק התוכן. נסו שוב מאוחר יותר.'
export const NO_CHANGES_RICH_TEXT_BLOCK_MESSAGE = 'לא בוצעו שינויים.'
