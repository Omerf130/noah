'use client'

import { useActionState } from 'react'
import { updateModuleAction } from '../../../../../../lib/courses/actions/update-module'
import {
  getFirstUpdateModuleFieldError,
  initialUpdateModuleActionState,
} from '../../../../../../lib/courses/actions/update-module-action-state'
import type { AdminModuleEditDto } from '../../../../../../lib/courses/mappers/to-admin-module-edit-dto'
import Button from '../../../../ui/Button/Button'
import ClientMount from '../../../../ui/ClientMount/ClientMount'
import ModuleMetadataFields from '../ModuleMetadataFields/ModuleMetadataFields'
import ModuleSystemSettings from '../ModuleSystemSettings/ModuleSystemSettings'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type EditModuleFormProps = {
  module: AdminModuleEditDto
}

function EditModuleFormInner({ module }: EditModuleFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateModuleAction.bind(null, module.courseId, module.moduleId),
    initialUpdateModuleActionState,
  )

  const values = state.values ?? module
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)
  const showErrorSummary = state.status === 'error' && (state.message || hasFieldErrors)
  const showNoOpMessage = state.status === 'no-op' && state.message

  return (
    <form className={styles.form} action={formAction} noValidate aria-busy={isPending}>
      <input type="hidden" name="courseId" value={module.courseId} />
      <input type="hidden" name="moduleId" value={module.moduleId} />

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

      <ModuleMetadataFields
        values={values}
        getFieldError={(field) => getFirstUpdateModuleFieldError(state.fieldErrors, field)}
        isPending={isPending}
      />

      <ModuleSystemSettings settings={module.systemSettings} />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'שומר שינויים...' : 'שמירת שינויים'}
        </Button>
        <Button
          href={`/admin/courses/${module.courseId}/content`}
          variant="secondary"
          tabIndex={isPending ? -1 : 0}
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}

export default function EditModuleForm(props: EditModuleFormProps) {
  return (
    <ClientMount>
      <EditModuleFormInner {...props} />
    </ClientMount>
  )
}
