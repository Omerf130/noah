'use client'

import { useActionState } from 'react'
import { createModuleAction } from '../../../../../../lib/courses/actions/create-module'
import {
  getFirstCreateModuleFieldError,
  initialCreateModuleActionState,
} from '../../../../../../lib/courses/actions/create-module-action-state'
import Button from '../../../../ui/Button/Button'
import ClientMount from '../../../../ui/ClientMount/ClientMount'
import ModuleMetadataFields from '../ModuleMetadataFields/ModuleMetadataFields'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type CreateModuleFormProps = {
  courseId: string
}

function CreateModuleFormInner({ courseId }: CreateModuleFormProps) {
  const [state, formAction, isPending] = useActionState(
    createModuleAction.bind(null, courseId),
    initialCreateModuleActionState,
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

      <ModuleMetadataFields
        values={values}
        getFieldError={(field) => getFirstCreateModuleFieldError(state.fieldErrors, field)}
        isPending={isPending}
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'יוצר פרק...' : 'יצירת פרק'}
        </Button>
        <Button
          href={`/admin/courses/${courseId}/content`}
          variant="secondary"
          tabIndex={isPending ? -1 : 0}
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function CreateModuleForm(props: CreateModuleFormProps) {
  return (
    <ClientMount>
      <CreateModuleFormInner {...props} />
    </ClientMount>
  )
}
