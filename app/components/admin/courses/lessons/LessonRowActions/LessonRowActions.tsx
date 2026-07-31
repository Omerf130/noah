'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteLessonAction } from '../../../../../../lib/courses/actions/delete-lesson'
import { moveLessonAction } from '../../../../../../lib/courses/actions/move-lesson'
import { moveLessonToModuleAction } from '../../../../../../lib/courses/actions/move-lesson-to-module'
import Button from '../../../../ui/Button/Button'
import ConfirmDialog from '../../../../ui/ConfirmDialog/ConfirmDialog'
import listStyles from '../../CourseList.module.scss'
import formStyles from '../../CreateCourseForm/CreateCourseForm.module.scss'
import styles from '../LessonContent.module.scss'
import MoveLessonToModuleModal, {
  type LessonMoveTargetModule,
} from '../MoveLessonToModuleModal/MoveLessonToModuleModal'

export type { LessonMoveTargetModule }

type LessonRowActionsProps = {
  courseId: string
  moduleId: string
  lessonId: string
  lessonTitle: string
  position: number
  totalItems: number
  siblingModules: LessonMoveTargetModule[]
}

export default function LessonRowActions({
  courseId,
  moduleId,
  lessonId,
  lessonTitle,
  position,
  totalItems,
  siblingModules,
}: LessonRowActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [moveToModuleOpen, setMoveToModuleOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMovePending, startMoveTransition] = useTransition()
  const [isMoveToModulePending, startMoveToModuleTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const showMoveControls = totalItems > 1
  const canMoveUp = showMoveControls && position > 1
  const canMoveDown = showMoveControls && position < totalItems
  const canMoveToModule = siblingModules.length > 0

  const handleMove = (direction: 'up' | 'down') => {
    setErrorMessage(null)

    startMoveTransition(async () => {
      const result = await moveLessonAction(courseId, moduleId, lessonId, direction)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      router.refresh()
    })
  }

  const handleMoveToModuleConfirm = (targetModuleId: string) => {
    setErrorMessage(null)

    startMoveToModuleTransition(async () => {
      const result = await moveLessonToModuleAction(courseId, lessonId, targetModuleId)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      setMoveToModuleOpen(false)
      router.refresh()
    })
  }

  const handleDeleteConfirm = () => {
    setErrorMessage(null)

    startDeleteTransition(async () => {
      const result = await deleteLessonAction(courseId, moduleId, lessonId)

      if (result.status === 'error') {
        setErrorMessage(result.message)
        return
      }

      setDeleteOpen(false)
      router.refresh()
    })
  }

  const isPending = isMovePending || isMoveToModulePending || isDeletePending
  const dialogOpen = deleteOpen || moveToModuleOpen

  return (
    <>
      <div className={styles.lessonRowActions}>
        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`}
          variant="ghost"
        >
          ניהול תוכן
        </Button>

        <Button
          href={`/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/edit`}
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
            aria-label={`העבר למעלה: ${lessonTitle}`}
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
            aria-label={`העבר למטה: ${lessonTitle}`}
          >
            העבר למטה
          </button>
        ) : null}

        {canMoveToModule ? (
          <button
            type="button"
            className={listStyles.actionButton}
            onClick={() => {
              setErrorMessage(null)
              setMoveToModuleOpen(true)
            }}
            disabled={isPending}
          >
            העבר לפרק אחר
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
          מחיקת שיעור
        </button>
      </div>

      {errorMessage && !dialogOpen ? (
        <p className={listStyles.actionError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <MoveLessonToModuleModal
        open={moveToModuleOpen}
        lessonTitle={lessonTitle}
        modules={siblingModules}
        onConfirm={handleMoveToModuleConfirm}
        onClose={() => {
          if (!isMoveToModulePending) {
            setMoveToModuleOpen(false)
            setErrorMessage(null)
          }
        }}
        isPending={isMoveToModulePending}
        errorMessage={errorMessage}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="מחיקת שיעור"
        description={`האם למחוק לצמיתות את השיעור "${lessonTitle}"? פעולה זו אינה ניתנת לביטול.`}
        confirmLabel="מחק שיעור"
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
        <p className={formStyles.hint}>
          ניתן למחוק רק שיעורים ללא בלוקי תוכן. אם קיימים בלוקים, יש להסיר אותם לפני המחיקה.
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
