'use client'

import { useMemo, useState } from 'react'
import { COURSE_DIFFICULTIES, DEFAULT_CURRENCY } from '../../../../../lib/courses/constants'
import { getCourseDifficultyLabel } from '../../../../../lib/courses/formatters/admin-display'
import {
  CATEGORY_FUTURE_HELPER_TEXT,
  getCourseCategoryFormOptions,
  getCourseVisibilityFormOptions,
  REGULAR_PRICE_HELPER_TEXT,
  SALE_PRICE_HELPER_TEXT,
} from '../../../../../lib/courses/form/course-form-options'
import {
  getInstructorOptionLabel,
  type InstructorOptionDto,
} from '../../../../../lib/courses/mappers/to-instructor-option-dto'
import type { CourseStatus } from '../../../../../lib/courses/types'
import type { CourseMetadataFormValues } from '../../../../../lib/courses/validators/admin-course-metadata-fields'
import Input from '../../../ui/Input/Input'
import TextArea from '../../../ui/TextArea/TextArea'
import CourseStatusBadge from '../CourseStatusBadge'
import styles from '../CreateCourseForm/CreateCourseForm.module.scss'

type CourseMetadataFieldsProps = {
  values?: CourseMetadataFormValues
  getFieldError: (field: string) => string | undefined
  instructorOptions: InstructorOptionDto[]
  defaultInstructorId: string
  isPending: boolean
  readOnlyStatus?: {
    status: CourseStatus
    label: string
  }
  slugHelpText?: string
}

export default function CourseMetadataFields({
  values,
  getFieldError,
  instructorOptions,
  defaultInstructorId,
  isPending,
  readOnlyStatus,
  slugHelpText = 'כתובת slug באנגלית קטנה, מספרים ומקפים בלבד. לדוגמה: pharmaceutical-calculations',
}: CourseMetadataFieldsProps) {
  const categoryOptions = useMemo(() => getCourseCategoryFormOptions(), [])
  const visibilityOptions = useMemo(() => getCourseVisibilityFormOptions(), [])
  const initialVisibility = values?.visibility ?? 'private'
  const [selectedVisibility, setSelectedVisibility] = useState(initialVisibility)

  const selectedVisibilityDescription = useMemo(
    () =>
      visibilityOptions.find((option) => option.value === selectedVisibility)?.description ??
      '',
    [selectedVisibility, visibilityOptions],
  )

  return (
    <div className={styles.formGrid}>
      {readOnlyStatus && (
        <div className={[styles.field, styles.fieldFull].join(' ')}>
          <span className={styles.label}>סטטוס</span>
          <div>
            <CourseStatusBadge status={readOnlyStatus.status} label={readOnlyStatus.label} />
          </div>
        </div>
      )}

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <Input
          id="title"
          name="title"
          label="שם הקורס"
          type="text"
          required
          defaultValue={values?.title ?? ''}
          aria-invalid={Boolean(getFieldError('title'))}
          disabled={isPending}
        />
        {getFieldError('title') && <p className={styles.fieldError}>{getFieldError('title')}</p>}
      </div>

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <Input
          id="slug"
          name="slug"
          label="כתובת הקורס"
          type="text"
          required
          autoComplete="off"
          spellCheck={false}
          defaultValue={values?.slug ?? ''}
          aria-invalid={Boolean(getFieldError('slug'))}
          aria-describedby="slug-help"
          disabled={isPending}
        />
        <p id="slug-help" className={styles.hint}>
          {slugHelpText}
        </p>
        {getFieldError('slug') && <p className={styles.fieldError}>{getFieldError('slug')}</p>}
      </div>

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <TextArea
          id="shortDescription"
          name="shortDescription"
          label="תיאור קצר"
          required
          defaultValue={values?.shortDescription ?? ''}
          aria-invalid={Boolean(getFieldError('shortDescription'))}
          disabled={isPending}
        />
        {getFieldError('shortDescription') && (
          <p className={styles.fieldError}>{getFieldError('shortDescription')}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">
          קטגוריה <span className={styles.requiredMark}>*</span>
        </label>
        <select
          id="category"
          name="category"
          className={styles.select}
          required
          defaultValue={values?.category ?? ''}
          aria-invalid={Boolean(getFieldError('category'))}
          aria-describedby="category-help"
          disabled={isPending}
        >
          <option value="">בחרו קטגוריה</option>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <p id="category-help" className={styles.hint}>
          {CATEGORY_FUTURE_HELPER_TEXT}
        </p>
        {getFieldError('category') && (
          <p className={styles.fieldError}>{getFieldError('category')}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="instructorId">
          מדריך <span className={styles.requiredMark}>*</span>
        </label>
        <select
          id="instructorId"
          name="instructorId"
          className={styles.select}
          required
          defaultValue={values?.instructorId || defaultInstructorId}
          aria-invalid={Boolean(getFieldError('instructorId'))}
          disabled={isPending}
        >
          {instructorOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {getInstructorOptionLabel(option)}
            </option>
          ))}
        </select>
        {getFieldError('instructorId') && (
          <p className={styles.fieldError}>{getFieldError('instructorId')}</p>
        )}
      </div>

      <div className={styles.field}>
        <Input
          id="price"
          name="price"
          label="מחיר רגיל"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={values?.price ?? '0'}
          aria-invalid={Boolean(getFieldError('price'))}
          aria-describedby="price-help"
          disabled={isPending}
        />
        <p id="price-help" className={styles.hint}>
          {REGULAR_PRICE_HELPER_TEXT}
        </p>
        {getFieldError('price') && <p className={styles.fieldError}>{getFieldError('price')}</p>}
      </div>

      <div className={styles.field}>
        <Input
          id="salePrice"
          name="salePrice"
          label="מחיר מבצע"
          type="number"
          min={0}
          step="0.01"
          defaultValue={values?.salePrice ?? ''}
          aria-invalid={Boolean(getFieldError('salePrice'))}
          aria-describedby="salePrice-help"
          disabled={isPending}
        />
        <p id="salePrice-help" className={styles.hint}>
          {SALE_PRICE_HELPER_TEXT}
        </p>
        {getFieldError('salePrice') && (
          <p className={styles.fieldError}>{getFieldError('salePrice')}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="currency">
          מטבע <span className={styles.requiredMark}>*</span>
        </label>
        <select
          id="currency"
          name="currency"
          className={styles.select}
          required
          defaultValue={values?.currency ?? DEFAULT_CURRENCY}
          aria-invalid={Boolean(getFieldError('currency'))}
          disabled={isPending}
        >
          <option value="ILS">ILS</option>
        </select>
        {getFieldError('currency') && (
          <p className={styles.fieldError}>{getFieldError('currency')}</p>
        )}
      </div>

      <div className={styles.field}>
        <Input
          id="estimatedDurationHours"
          name="estimatedDurationHours"
          label="משך משוער בשעות"
          type="number"
          min={0}
          step="0.25"
          defaultValue={values?.estimatedDurationHours ?? ''}
          aria-invalid={Boolean(getFieldError('estimatedDurationHours'))}
          disabled={isPending}
        />
        {getFieldError('estimatedDurationHours') && (
          <p className={styles.fieldError}>{getFieldError('estimatedDurationHours')}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="difficulty">
          רמת קושי
        </label>
        <select
          id="difficulty"
          name="difficulty"
          className={styles.select}
          defaultValue={values?.difficulty ?? ''}
          aria-invalid={Boolean(getFieldError('difficulty'))}
          disabled={isPending}
        >
          <option value="">ללא</option>
          {COURSE_DIFFICULTIES.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {getCourseDifficultyLabel(difficulty)}
            </option>
          ))}
        </select>
        {getFieldError('difficulty') && (
          <p className={styles.fieldError}>{getFieldError('difficulty')}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="visibility">
          נראות
        </label>
        <select
          id="visibility"
          name="visibility"
          className={styles.select}
          defaultValue={initialVisibility}
          onChange={(event) => setSelectedVisibility(event.target.value)}
          aria-invalid={Boolean(getFieldError('visibility'))}
          aria-describedby="visibility-help"
          disabled={isPending}
        >
          {visibilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p id="visibility-help" className={styles.hint}>
          {selectedVisibilityDescription}
        </p>
        {getFieldError('visibility') && (
          <p className={styles.fieldError}>{getFieldError('visibility')}</p>
        )}
      </div>

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <div className={styles.checkboxRow}>
          <input
            id="featured"
            name="featured"
            type="checkbox"
            className={styles.checkbox}
            defaultChecked={values?.featured ?? false}
            disabled={isPending}
          />
          <label className={styles.label} htmlFor="featured">
            קורס מומלץ
          </label>
        </div>
      </div>
    </div>
  )
}
