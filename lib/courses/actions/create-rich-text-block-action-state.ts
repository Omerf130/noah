export type CreateRichTextBlockActionState = {
  status: 'idle' | 'error'
  message?: string
  values?: {
    documentJson: string
  }
}

export const initialCreateRichTextBlockActionState: CreateRichTextBlockActionState = {
  status: 'idle',
}

export const UNAUTHORIZED_CREATE_RICH_TEXT_BLOCK_ERROR = 'אין לכם הרשאה ליצור בלוק תוכן'
export const INVALID_CREATE_RICH_TEXT_BLOCK_REQUEST_ERROR = 'בקשת יצירת בלוק התוכן אינה תקינה.'
export const GENERIC_CREATE_RICH_TEXT_BLOCK_ERROR =
  'אירעה שגיאה ביצירת בלוק התוכן. נסו שוב מאוחר יותר.'
