'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteModuleAction } from '../../../../../../lib/courses/actions/delete-module'
import { moveModuleAction } from '../../../../../../lib/courses/actions/move-module'
import ConfirmDialog from '../../../../ui/ConfirmDialog/ConfirmDialog'
import Button from '../../../../ui/Button/Button'
import listStyles from '../../CourseList.module.scss'
import styles from '../ModuleContent.module.scss'

type ModuleRowActionsProps = {
  courseId: string
  moduleId: string
  moduleTitle: string
  position: number
  totalItems: number
}

export default function ModuleRowActions({
  courseId,
  moduleId,
  moduleTitle,
  position,
  totalItems,
}: ModuleRowActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMovePending, startMoveTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const showMoveControls = totalItems > 1
  const canMoveUp = showMoveControls && position > 1
  const canMoveDown = showMoveControls && position < totalItems

  const handleMove = (direction: 'up' | 'down') => {
    setErrorMessage(null)

    startMoveTransition(async () => {
      const result = await moveModuleAction(courseId, moduleId, direction)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      router.refresh()
    })
  }

  const handleDeleteConfirm = () => {
    setErrorMessage(null)

    startDeleteTransition(async () => {
      const result = await deleteModuleAction(courseId, moduleId)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      setDeleteOpen(false)
      router.refresh()
    })
  }

  const isPending = isMovePending || isDeletePending

  return (
    <>
      <div className={styles.moduleRowActions}>
        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}`}
          variant="primary"
          className={styles.moduleRowPrimaryAction}
        >
          ניהול שיעורים
        </Button>

        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}/edit`}
          variant="ghost"
        >
          עריכה
        </Button>

        {canMoveUp ? (
          <button
            type="button"
            className={listStyles.actionButton}
            onClick={() => handleMove('up')}
            disabled={isPending}
            aria-label={`העבר למעלה: ${moduleTitle}`}
          >
            העבר למעלה
          </button>
        ) : null}

        {canMoveDown ? (
          <button
            type="button"
            className={listStyles.actionButton}
            onClick={() => handleMove('down')}
            disabled={isPending}
            aria-label={`העבר למטה: ${moduleTitle}`}
          >
            העבר למטה
          </button>
        ) : null}

        <button
          type="button"
          className={[listStyles.actionButton, listStyles.actionButtonDestructive].join(' ')}
          onClick={() => {
            setErrorMessage(null)
            setDeleteOpen(true)
          }}
          disabled={isPending}
        >
          מחיקת פרק
        </button>
      </div>

      {errorMessage && !deleteOpen ? (
        <p className={listStyles.actionError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        title="מחיקת פרק"
        description={`האם למחוק לצמיתות את הפרק "${moduleTitle}"? פעולה זו אינה ניתנת לביטול. ניתן למחוק רק פרקים ללא שיעורים.`}
        confirmLabel="מחק פרק"
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
        {errorMessage ? (
          <p className={listStyles.actionError} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </ConfirmDialog>
    </>
  )
}
