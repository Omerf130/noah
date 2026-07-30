'use client'

import { useActionState } from 'react'
import { updateLessonAction } from '../../../../../../lib/courses/actions/update-lesson'
import {
  getFirstUpdateLessonFieldError,
  initialUpdateLessonActionState,
} from '../../../../../../lib/courses/actions/update-lesson-action-state'
import type { AdminLessonEditDto } from '../../../../../../lib/courses/mappers/to-admin-lesson-edit-dto'
import Button from '../../../../ui/Button/Button'
import ClientMount from '../../../../ui/ClientMount/ClientMount'
import LessonMetadataFields from '../LessonMetadataFields/LessonMetadataFields'
import LessonSystemSettings from '../LessonSystemSettings/LessonSystemSettings'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type EditLessonFormProps = {
  lesson: AdminLessonEditDto
}

function EditLessonFormInner({ lesson }: EditLessonFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateLessonAction.bind(null, lesson.courseId, lesson.moduleId, lesson.lessonId),
    initialUpdateLessonActionState,
  )

  const values = state.values ?? lesson
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)
  const showErrorSummary = state.status === 'error' && (state.message || hasFieldErrors)
  const showNoOpMessage = state.status === 'no-op' && state.message

  return (
    <form className={styles.form} action={formAction} noValidate aria-busy={isPending}>
      <input type="hidden" name="courseId" value={lesson.courseId} />
      <input type="hidden" name="moduleId" value={lesson.moduleId} />
      <input type="hidden" name="lessonId" value={lesson.lessonId} />

      {showErrorSummary && (
        <div className={styles.errorSummary} role="alert" aria-live="polite">
          {state.message && <p>{state.message}</p>}
          {hasFieldErrors && <p>יש לתקן את השגיאות בטופס לפני שליחה.</p>}
        </div>
      )}

      {showNoOpMessage && (
        <div className={styles.infoSummary} role="status" aria-live="polite">
          <p>{state.message}</p>
        </div>
      )}

      <LessonMetadataFields
        values={values}
        getFieldError={(field) => getFirstUpdateLessonFieldError(state.fieldErrors, field)}
        isPending={isPending}
      />

      <LessonSystemSettings settings={lesson.systemSettings} />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'שומר שינויים...' : 'שמירת שינויים'}
        </Button>
        <Button
          href={`/admin/courses/${lesson.courseId}/content/${lesson.moduleId}`}
          variant="ghost"
          tabIndex={isPending ? -1 : 0}
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function EditLessonForm(props: EditLessonFormProps) {
  return (
    <ClientMount>
      <EditLessonFormInner {...props} />
    </ClientMount>
  )
}
