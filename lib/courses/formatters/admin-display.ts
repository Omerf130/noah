import type { CourseCategory, CourseStatus, CourseVisibility } from '../types'

const statusLabels: Record<CourseStatus, string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
}

const visibilityLabels: Record<CourseVisibility, string> = {
  public: 'ציבורי',
  private: 'פרטי',
  members: 'משתמשים רשומים',
  unlisted: 'לא רשום',
}

const categoryLabels: Record<CourseCategory, string> = {
  calculations: 'חישובים',
  pharmacology: 'פרמקולוגיה',
  anatomy: 'אנטומיה',
  'nursing-fundamentals': 'יסודות הסיעוד',
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

export function getCourseCategoryLabel(category: CourseCategory | null | undefined): string | null {
  if (!category) {
    return null
  }

  return categoryLabels[category]
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
