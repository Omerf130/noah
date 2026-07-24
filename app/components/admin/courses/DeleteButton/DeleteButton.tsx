'use client'

import { useState, useTransition } from 'react'
import { deleteCourseAction } from '../../../../../lib/courses/actions/delete-course'
import { matchesCourseDeleteConfirmation } from '../../../../../lib/courses/validators/course-delete-confirmation'
import ConfirmDialog from '../../../ui/ConfirmDialog/ConfirmDialog'
import styles from '../CourseList.module.scss'

type DeleteButtonProps = {
  courseId: string
  courseTitle: string
}

export default function DeleteButton({ courseId, courseTitle }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [confirmationTitle, setConfirmationTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canConfirm = matchesCourseDeleteConfirmation(courseTitle, confirmationTitle)

  const handleConfirm = () => {
    setErrorMessage(null)

    startTransition(async () => {
      try {
        const result = await deleteCourseAction(courseId, confirmationTitle)

        if (result?.status === 'error') {
          setErrorMessage(result.message ?? 'אירעה שגיאה במחיקת הקורס.')
        }
      } catch {
        // redirect throws on success
      }
    })
  }

  return (
    <>
      <button
        type="button"
        className={[styles.actionButton, styles.actionButtonDestructive].join(' ')}
        onClick={() => {
          setConfirmationTitle('')
          setErrorMessage(null)
          setOpen(true)
        }}
        disabled={isPending}
      >
        מחיקה לצמיתות
      </button>

      <ConfirmDialog
        open={open}
        title="מחיקה לצמיתות"
        description="פעולה זו אינה ניתנת לביטול. הקורס יימחק לצמיתות רק אם עומד בתנאי המחיקה בשרת. להסרה זמנית, השתמשו בהעברה לארכיון."
        confirmLabel="מחק לצמיתות"
        onConfirm={handleConfirm}
        onClose={() => {
          if (!isPending) {
            setOpen(false)
            setConfirmationTitle('')
          }
        }}
        confirmDisabled={!canConfirm}
        isPending={isPending}
        destructive
      >
        <label className={styles.dialogLabel} htmlFor={`delete-confirm-${courseId}`}>
          הקלידו את שם הקורס בדיוק: {courseTitle}
        </label>
        <input
          id={`delete-confirm-${courseId}`}
          className={styles.dialogInput}
          type="text"
          value={confirmationTitle}
          onChange={(event) => setConfirmationTitle(event.target.value)}
          autoComplete="off"
          disabled={isPending}
        />
        {errorMessage && (
          <p className={styles.actionError} role="alert">
            {errorMessage}
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
