'use client'

import { useMemo, useState } from 'react'
import { useActionState } from 'react'
import { COURSE_DIFFICULTIES, DEFAULT_CURRENCY } from '../../../../../lib/courses/constants'
import { createCourseAction } from '../../../../../lib/courses/actions/create-course'
import {
  getFirstCreateCourseFieldError,
  initialCreateCourseActionState,
} from '../../../../../lib/courses/actions/create-course-action-state'
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
import Button from '../../../ui/Button/Button'
import ClientMount from '../../../ui/ClientMount/ClientMount'
import Input from '../../../ui/Input/Input'
import TextArea from '../../../ui/TextArea/TextArea'
import styles from './CreateCourseForm.module.scss'

type CreateCourseFormProps = {
  instructorOptions: InstructorOptionDto[]
  defaultInstructorId: string
}

function CreateCourseFormInner({
  instructorOptions,
  defaultInstructorId,
}: CreateCourseFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCourseAction,
    initialCreateCourseActionState,
  )

  const categoryOptions = useMemo(() => getCourseCategoryFormOptions(), [])
  const visibilityOptions = useMemo(() => getCourseVisibilityFormOptions(), [])
  const values = state.values
  const initialVisibility = values?.visibility ?? 'private'
  const [selectedVisibility, setSelectedVisibility] = useState(initialVisibility)

  const selectedVisibilityDescription = useMemo(
    () =>
      visibilityOptions.find((option) => option.value === selectedVisibility)?.description ??
      '',
    [selectedVisibility, visibilityOptions],
  )

  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)

  return (
    <form className={styles.form} action={formAction} noValidate aria-busy={isPending}>
      {(state.message || hasFieldErrors) && (
        <div className={styles.errorSummary} role="alert" aria-live="polite">
          {state.message && <p>{state.message}</p>}
          {hasFieldErrors && <p>יש לתקן את השגיאות בטופס לפני שליחה.</p>}
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={[styles.field, styles.fieldFull].join(' ')}>
          <Input
            id="title"
            name="title"
            label="שם הקורס"
            type="text"
            required
            defaultValue={values?.title ?? ''}
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'title'))}
            disabled={isPending}
          />
          {getFirstCreateCourseFieldError(state.fieldErrors, 'title') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'title')}
            </p>
          )}
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'slug'))}
            aria-describedby="slug-help"
            disabled={isPending}
          />
          <p id="slug-help" className={styles.hint}>
            כתובת slug באנגלית קטנה, מספרים ומקפים בלבד. המערכת תיצור ממנה מזהה פנימי יציב. לדוגמה:
            pharmaceutical-calculations
          </p>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'slug') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'slug')}
            </p>
          )}
        </div>

        <div className={[styles.field, styles.fieldFull].join(' ')}>
          <TextArea
            id="shortDescription"
            name="shortDescription"
            label="תיאור קצר"
            required
            defaultValue={values?.shortDescription ?? ''}
            aria-invalid={Boolean(
              getFirstCreateCourseFieldError(state.fieldErrors, 'shortDescription'),
            )}
            disabled={isPending}
          />
          {getFirstCreateCourseFieldError(state.fieldErrors, 'shortDescription') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'shortDescription')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'category'))}
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
          {getFirstCreateCourseFieldError(state.fieldErrors, 'category') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'category')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'instructorId'))}
            disabled={isPending}
          >
            {instructorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {getInstructorOptionLabel(option)}
              </option>
            ))}
          </select>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'instructorId') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'instructorId')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'price'))}
            aria-describedby="price-help"
            disabled={isPending}
          />
          <p id="price-help" className={styles.hint}>
            {REGULAR_PRICE_HELPER_TEXT}
          </p>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'price') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'price')}
            </p>
          )}
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'salePrice'))}
            aria-describedby="salePrice-help"
            disabled={isPending}
          />
          <p id="salePrice-help" className={styles.hint}>
            {SALE_PRICE_HELPER_TEXT}
          </p>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'salePrice') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'salePrice')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'currency'))}
            disabled={isPending}
          >
            <option value="ILS">ILS</option>
          </select>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'currency') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'currency')}
            </p>
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
            aria-invalid={Boolean(
              getFirstCreateCourseFieldError(state.fieldErrors, 'estimatedDurationHours'),
            )}
            disabled={isPending}
          />
          {getFirstCreateCourseFieldError(state.fieldErrors, 'estimatedDurationHours') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'estimatedDurationHours')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'difficulty'))}
            disabled={isPending}
          >
            <option value="">ללא</option>
            {COURSE_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {getCourseDifficultyLabel(difficulty)}
              </option>
            ))}
          </select>
          {getFirstCreateCourseFieldError(state.fieldErrors, 'difficulty') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'difficulty')}
            </p>
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
            aria-invalid={Boolean(getFirstCreateCourseFieldError(state.fieldErrors, 'visibility'))}
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
          {getFirstCreateCourseFieldError(state.fieldErrors, 'visibility') && (
            <p className={styles.fieldError}>
              {getFirstCreateCourseFieldError(state.fieldErrors, 'visibility')}
            </p>
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

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'יוצר קורס...' : 'יצירת קורס'}
        </Button>
        <Button href="/admin/courses" variant="secondary" tabIndex={isPending ? -1 : 0}>
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function CreateCourseForm(props: CreateCourseFormProps) {
  return (
    <ClientMount>
      <CreateCourseFormInner {...props} />
    </ClientMount>
  )
}
