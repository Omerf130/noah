'use client'

import { useActionState } from 'react'
import { createRichTextBlockAction } from '../../../../../../lib/courses/actions/create-rich-text-block'
import {
  initialCreateRichTextBlockActionState,
} from '../../../../../../lib/courses/actions/create-rich-text-block-action-state'
import { updateRichTextBlockAction } from '../../../../../../lib/courses/actions/update-rich-text-block'
import {
  initialUpdateRichTextBlockActionState,
} from '../../../../../../lib/courses/actions/update-rich-text-block-action-state'
import Button from '../../../../ui/Button/Button'
import ClientMount from '../../../../ui/ClientMount/ClientMount'
import formStyles from '../../CreateCourseForm/CreateCourseForm.module.scss'
import RichTextEditor from '../RichTextEditor/RichTextEditor'

type RichTextBlockFormBaseProps = {
  courseId: string
  moduleId: string
  lessonId: string
  documentJson: string
}

function CreateRichTextBlockFormInner({
  courseId,
  moduleId,
  lessonId,
  documentJson,
}: RichTextBlockFormBaseProps) {
  const [state, formAction, isPending] = useActionState(
    createRichTextBlockAction.bind(null, courseId, moduleId, lessonId),
    initialCreateRichTextBlockActionState,
  )
  const contentPath = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
  const currentDocumentJson = state.values?.documentJson ?? documentJson

  return (
    <form className={formStyles.form} action={formAction} noValidate aria-busy={isPending}>
      {state.message ? (
        <div className={formStyles.errorSummary} role="alert" aria-live="polite">
          <p>{state.message}</p>
        </div>
      ) : null}

      <RichTextEditor initialDocumentJson={currentDocumentJson} disabled={isPending} />

      <div className={formStyles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'שומר...' : 'יצירת בלוק'}
        </Button>
        <Button href={contentPath} variant="ghost" tabIndex={isPending ? -1 : 0}>
          ביטול
        </Button>
      </div>
    </form>
  )
}

function EditRichTextBlockFormInner({
  courseId,
  moduleId,
  lessonId,
  blockId,
  documentJson,
}: RichTextBlockFormBaseProps & { blockId: string }) {
  const [state, formAction, isPending] = useActionState(
    updateRichTextBlockAction.bind(null, courseId, moduleId, lessonId, blockId),
    initialUpdateRichTextBlockActionState,
  )
  const contentPath = `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`
  const currentDocumentJson = state.values?.documentJson ?? documentJson

  return (
    <form className={formStyles.form} action={formAction} noValidate aria-busy={isPending}>
      {state.message ? (
        <div className={formStyles.errorSummary} role="alert" aria-live="polite">
          <p>{state.message}</p>
        </div>
      ) : null}

      <RichTextEditor initialDocumentJson={currentDocumentJson} disabled={isPending} />

      <div className={formStyles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'שומר...' : 'שמירת בלוק'}
        </Button>
        <Button href={contentPath} variant="ghost" tabIndex={isPending ? -1 : 0}>
          ביטול
        </Button>
      </div>
    </form>
  )
}

export function CreateRichTextBlockForm(props: RichTextBlockFormBaseProps) {
  return (
    <ClientMount>
      <CreateRichTextBlockFormInner {...props} />
    </ClientMount>
  )
}

export function EditRichTextBlockForm(props: RichTextBlockFormBaseProps & { blockId: string }) {
  return (
    <ClientMount>
      <EditRichTextBlockFormInner {...props} />
    </ClientMount>
  )
}
