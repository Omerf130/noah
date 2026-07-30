'use client'

import { useActionState } from 'react'
import { createLessonAction } from '../../../../../../lib/courses/actions/create-lesson'
import {
  getFirstCreateLessonFieldError,
  initialCreateLessonActionState,
} from '../../../../../../lib/courses/actions/create-lesson-action-state'
import Button from '../../../../ui/Button/Button'
import ClientMount from '../../../../ui/ClientMount/ClientMount'
import LessonMetadataFields from '../LessonMetadataFields/LessonMetadataFields'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type CreateLessonFormProps = {
  courseId: string
  moduleId: string
}

function CreateLessonFormInner({ courseId, moduleId }: CreateLessonFormProps) {
  const [state, formAction, isPending] = useActionState(
    createLessonAction.bind(null, courseId, moduleId),
    initialCreateLessonActionState,
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

      <LessonMetadataFields
        values={values}
        getFieldError={(field) => getFirstCreateLessonFieldError(state.fieldErrors, field)}
        isPending={isPending}
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'יוצר שיעור...' : 'יצירת שיעור'}
        </Button>
        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}`}
          variant="ghost"
          tabIndex={isPending ? -1 : 0}
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function CreateLessonForm(props: CreateLessonFormProps) {
  return (
    <ClientMount>
      <CreateLessonFormInner {...props} />
    </ClientMount>
  )
}
