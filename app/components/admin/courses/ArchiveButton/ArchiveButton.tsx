'use client'

import { useState, useTransition } from 'react'
import { archiveCourseAction } from '../../../../../lib/courses/actions/archive-course'
import type { CourseStatus } from '../../../../../lib/courses/types'
import ConfirmDialog from '../../../ui/ConfirmDialog/ConfirmDialog'
import styles from '../CourseList.module.scss'

type ArchiveButtonProps = {
  courseId: string
  status: CourseStatus
}

export default function ArchiveButton({ courseId, status }: ArchiveButtonProps) {
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (status !== 'draft') {
    return null
  }

  const handleConfirm = () => {
    setErrorMessage(null)

    startTransition(async () => {
      try {
        const result = await archiveCourseAction(courseId)

        if (result?.status === 'error') {
          setErrorMessage(result.message ?? 'אירעה שגיאה בהעברת הקורס לארכיון.')
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
        className={styles.actionButton}
        onClick={() => {
          setErrorMessage(null)
          setOpen(true)
        }}
        disabled={isPending}
      >
        העברה לארכיון
      </button>

      <ConfirmDialog
        open={open}
        title="העברה לארכיון"
        description="הקורס יישאר במערכת ויוצג כבארכיון. לא יימחק תוכן, מטא-דאטה או קישורים."
        confirmLabel="העברה לארכיון"
        onConfirm={handleConfirm}
        onClose={() => {
          if (!isPending) {
            setOpen(false)
          }
        }}
        isPending={isPending}
      />

      {errorMessage && open && (
        <p className={styles.actionError} role="alert">
          {errorMessage}
        </p>
      )}
    </>
  )
}
