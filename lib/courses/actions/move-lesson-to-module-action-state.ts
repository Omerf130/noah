export const UNAUTHORIZED_MOVE_LESSON_TO_MODULE_ERROR = 'אין הרשאה להעביר שיעורים בין פרקים.'
export const INVALID_MOVE_LESSON_TO_MODULE_REQUEST_ERROR =
  'לא ניתן להעביר את השיעור. בדקו את הקישור ונסו שוב.'
export const GENERIC_MOVE_LESSON_TO_MODULE_ERROR =
  'העברת השיעור לפרק אחר נכשלה. נסו לרענן את העמוד ולנסות שוב.'

export type MoveLessonToModuleActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string }
