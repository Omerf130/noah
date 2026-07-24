import { COURSE_CATEGORIES, COURSE_VISIBILITIES } from '../constants'
import {
  getCourseCategoryLabel,
  getCourseVisibilityDescription,
  getCourseVisibilityLabel,
} from '../formatters/admin-display'

export const CATEGORY_FUTURE_HELPER_TEXT =
  'ניהול והוספת קטגוריות חדשות יתווספו בהמשך.'

export const REGULAR_PRICE_HELPER_TEXT =
  'מחיר רגיל בש"ח. ניתן להשאיר 0 לקורס חינמי.'

export const SALE_PRICE_HELPER_TEXT =
  'מחיר מבצע הוא אופציונלי וחייב להיות נמוך ממחיר רגיל.'

export type CourseCategoryFormOption = {
  value: (typeof COURSE_CATEGORIES)[number]
  label: string
}

export type CourseVisibilityFormOption = {
  value: (typeof COURSE_VISIBILITIES)[number]
  label: string
  description: string
}

export function getCourseCategoryFormOptions(): CourseCategoryFormOption[] {
  return COURSE_CATEGORIES.map((category) => ({
    value: category,
    label: getCourseCategoryLabel(category) ?? category,
  }))
}

export function getCourseVisibilityFormOptions(): CourseVisibilityFormOption[] {
  return COURSE_VISIBILITIES.map((visibility) => ({
    value: visibility,
    label: getCourseVisibilityLabel(visibility),
    description: getCourseVisibilityDescription(visibility),
  }))
}
