'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteContentBlockAction } from '../../../../../../lib/courses/actions/delete-content-block'
import { moveContentBlockAction } from '../../../../../../lib/courses/actions/move-content-block'
import ConfirmDialog from '../../../../ui/ConfirmDialog/ConfirmDialog'
import listStyles from '../../CourseList.module.scss'
import styles from './ContentBlockRowActions.module.scss'

type ContentBlockRowActionsProps = {
  courseId: string
  moduleId: string
  lessonId: string
  blockId: string
  blockLabel: string
  position: number
  totalItems: number
  editHref: string
}

export default function ContentBlockRowActions({
  courseId,
  moduleId,
  lessonId,
  blockId,
  blockLabel,
  position,
  totalItems,
  editHref,
}: ContentBlockRowActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMovePending, startMoveTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const showMoveControls = totalItems > 1
  const canMoveUp = showMoveControls && position > 1
  const canMoveDown = showMoveControls && position < totalItems
  const isPending = isMovePending || isDeletePending

  const handleMove = (direction: 'up' | 'down') => {
    if (isPending) {
      return
    }

    setErrorMessage(null)

    startMoveTransition(async () => {
      const result = await moveContentBlockAction(
        courseId,
        moduleId,
        lessonId,
        blockId,
        direction,
      )

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      router.refresh()
    })
  }

  const handleDeleteConfirm = () => {
    if (isDeletePending) {
      return
    }

    setErrorMessage(null)

    startDeleteTransition(async () => {
      const result = await deleteContentBlockAction(courseId, moduleId, lessonId, blockId)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      setDeleteOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <div
        className={styles.rowActions}
        aria-busy={isPending || undefined}
        aria-label={`פעולות עבור ${blockLabel}`}
      >
        <Link href={editHref} className={styles.editLink} aria-label={`עריכה: ${blockLabel}`}>
          עריכה
        </Link>

        {canMoveUp ? (
          <button
            type="button"
            className={listStyles.actionButton}
            onClick={() => handleMove('up')}
            disabled={isPending}
            aria-label={`העבר למעלה: ${blockLabel}`}
          >
            {isMovePending ? 'מעדכן...' : 'העבר למעלה'}
          </button>
        ) : (
          <button
            type="button"
            className={[listStyles.actionButton, styles.disabledAction].join(' ')}
            disabled
            aria-disabled="true"
            aria-label={`העבר למעלה: ${blockLabel} (לא זמין)`}
          >
            העבר למעלה
          </button>
        )}

        {canMoveDown ? (
          <button
            type="button"
            className={listStyles.actionButton}
            onClick={() => handleMove('down')}
            disabled={isPending}
            aria-label={`העבר למטה: ${blockLabel}`}
          >
            {isMovePending ? 'מעדכן...' : 'העבר למטה'}
          </button>
        ) : (
          <button
            type="button"
            className={[listStyles.actionButton, styles.disabledAction].join(' ')}
            disabled
            aria-disabled="true"
            aria-label={`העבר למטה: ${blockLabel} (לא זמין)`}
          >
            העבר למטה
          </button>
        )}

        <button
          type="button"
          className={[listStyles.actionButton, listStyles.actionButtonDestructive].join(' ')}
          onClick={() => {
            setErrorMessage(null)
            setDeleteOpen(true)
          }}
          disabled={isPending}
          aria-label={`מחק בלוק: ${blockLabel}`}
        >
          מחיקה
        </button>
      </div>

      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {isMovePending ? `מעדכן את סדר ${blockLabel}` : null}
        {isDeletePending ? `מוחק את ${blockLabel}` : null}
      </div>

      {errorMessage && !deleteOpen ? (
        <p className={listStyles.actionError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        title="מחיקת בלוק תוכן"
        description={`האם למחוק לצמיתות את ${blockLabel}? פעולה זו אינה ניתנת לביטול.`}
        confirmLabel="מחק בלוק"
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!isDeletePending) {
            setDeleteOpen(false)
            setErrorMessage(null)
          }
        }}
        isPending={isDeletePending}
        destructive
      >
        <p className={styles.deleteHint}>
          המחיקה היא לצמיתות. לא ניתן לשחזר את בלוק התוכן לאחר האישור.
        </p>
        {errorMessage ? (
          <p className={listStyles.actionError} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </ConfirmDialog>
    </>
  )
}
