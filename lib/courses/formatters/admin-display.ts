import type {
  CourseCategory,
  CourseDifficulty,
  CourseStatus,
  CourseVisibility,
  PublicationStatus,
} from '../types'

const statusLabels: Record<CourseStatus, string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
}

const visibilityLabels: Record<CourseVisibility, string> = {
  public: 'ציבורי',
  private: 'מוסתר',
  members: 'למשתמשים מחוברים',
  unlisted: 'דרך קישור בלבד',
}

const visibilityDescriptions: Record<CourseVisibility, string> = {
  public:
    'כולם יכולים לראות את עמוד הקורס. גישה לשיעורים עדיין תדרוש הרשאה או רכישה.',
  private: 'רק מנהלי המערכת יכולים לראות את הקורס.',
  members:
    'רק משתמשים שנכנסו לחשבון יכולים לראות את פרטי הקורס. הדבר אינו מעניק גישה לשיעורים.',
  unlisted: 'הקורס אינו מופיע ברשימות, אך מי שקיבל קישור ישיר יכול לראות את פרטיו.',
}

const categoryLabels: Record<CourseCategory, string> = {
  calculations: 'חישובים',
  pharmacology: 'פרמקולוגיה',
  anatomy: 'אנטומיה',
  'nursing-fundamentals': 'יסודות הסיעוד',
}

const difficultyLabels: Record<CourseDifficulty, string> = {
  beginner: 'מתחילים',
  intermediate: 'בינוני',
  advanced: 'מתקדמים',
}

const publicationStatusLabels: Record<PublicationStatus, string> = {
  draft: 'מוסתר',
  published: 'מפורסם',
}

const adminDateFormatter = new Intl.DateTimeFormat('he-IL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function getCourseStatusLabel(status: CourseStatus): string {
  return statusLabels[status]
}

export function getCourseVisibilityLabel(visibility: CourseVisibility): string {
  return visibilityLabels[visibility]
}

export function getCourseVisibilityDescription(visibility: CourseVisibility): string {
  return visibilityDescriptions[visibility]
}

export function getCourseCategoryLabel(category: CourseCategory | null | undefined): string | null {
  if (!category) {
    return null
  }

  return categoryLabels[category]
}

export function getCourseDifficultyLabel(
  difficulty: CourseDifficulty | null | undefined,
): string | null {
  if (!difficulty) {
    return null
  }

  return difficultyLabels[difficulty]
}

export function getPublicationStatusLabel(status: PublicationStatus): string {
  return publicationStatusLabels[status]
}

export function formatAdminDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  return adminDateFormatter.format(date)
}

export function formatAdminPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatUserDisplayName(fullName: string | null | undefined): string {
  const trimmed = fullName?.trim()
  if (!trimmed) {
    return 'משתמש/ת'
  }

  return trimmed
}

export function formatFeaturedLabel(featured: boolean): string {
  return featured ? 'כן' : 'לא'
}
