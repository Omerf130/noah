'use client'

import { useActionState } from 'react'
import { updateCourseAction } from '../../../../../lib/courses/actions/update-course'
import {
  getFirstUpdateCourseFieldError,
  initialUpdateCourseActionState,
} from '../../../../../lib/courses/actions/update-course-action-state'
import type { AdminCourseEditDto } from '../../../../../lib/courses/mappers/to-admin-course-edit-dto'
import type { InstructorOptionDto } from '../../../../../lib/courses/mappers/to-instructor-option-dto'
import Button from '../../../ui/Button/Button'
import ClientMount from '../../../ui/ClientMount/ClientMount'
import CourseMetadataFields from '../CourseMetadataFields/CourseMetadataFields'
import styles from '../CreateCourseForm/CreateCourseForm.module.scss'

type EditCourseFormProps = {
  course: AdminCourseEditDto
  instructorOptions: InstructorOptionDto[]
}

function EditCourseFormInner({ course, instructorOptions }: EditCourseFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCourseAction.bind(null, course.courseId),
    initialUpdateCourseActionState,
  )

  const values = state.values ?? course
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)
  const showErrorSummary = state.status === 'error' && (state.message || hasFieldErrors)
  const showNoOpMessage = state.status === 'no-op' && state.message

  return (
    <form className={styles.form} action={formAction} noValidate aria-busy={isPending}>
      <input type="hidden" name="courseId" value={course.courseId} />

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

      <CourseMetadataFields
        values={values}
        getFieldError={(field) => getFirstUpdateCourseFieldError(state.fieldErrors, field)}
        instructorOptions={instructorOptions}
        defaultInstructorId={course.instructorId}
        isPending={isPending}
        readOnlyStatus={{ status: course.status, label: course.statusLabel }}
        slugHelpText="כתובת slug באנגלית קטנה, מספרים ומקפים בלבד. שינוי הכתובת אינו משנה את המזהה הפנימי הקבוע."
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'שומר שינויים...' : 'שמירת שינויים'}
        </Button>
        <Button href={`/admin/courses/${course.courseId}`} variant="secondary" tabIndex={isPending ? -1 : 0}>
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function EditCourseForm(props: EditCourseFormProps) {
  return (
    <ClientMount>
      <EditCourseFormInner {...props} />
    </ClientMount>
  )
}
