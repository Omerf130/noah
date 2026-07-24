'use client'

import { useActionState } from 'react'
import { createCourseAction } from '../../../../../lib/courses/actions/create-course'
import {
  getFirstCreateCourseFieldError,
  initialCreateCourseActionState,
} from '../../../../../lib/courses/actions/create-course-action-state'
import type { InstructorOptionDto } from '../../../../../lib/courses/mappers/to-instructor-option-dto'
import Button from '../../../ui/Button/Button'
import ClientMount from '../../../ui/ClientMount/ClientMount'
import CourseMetadataFields from '../CourseMetadataFields/CourseMetadataFields'
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

  const values = state.values
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)

  return (
    <form className={styles.form} action={formAction} noValidate aria-busy={isPending}>
      {(state.message || hasFieldErrors) && (
        <div className={styles.errorSummary} role="alert" aria-live="polite">
          {state.message && <p>{state.message}</p>}
          {hasFieldErrors && <p>יש לתקן את השגיאות בטופס לפני שליחה.</p>}
        </div>
      )}

      <CourseMetadataFields
        values={values}
        getFieldError={(field) => getFirstCreateCourseFieldError(state.fieldErrors, field)}
        instructorOptions={instructorOptions}
        defaultInstructorId={defaultInstructorId}
        isPending={isPending}
        slugHelpText="כתובת slug באנגלית קטנה, מספרים ומקפים בלבד. המערכת תיצור ממנה מזהה פנימי יציב. לדוגמה: pharmaceutical-calculations"
      />

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
