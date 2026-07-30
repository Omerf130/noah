'use client'

import { useEffect, useId, useState } from 'react'
import ConfirmDialog from '../../../../ui/ConfirmDialog/ConfirmDialog'
import listStyles from '../../CourseList.module.scss'
import formStyles from '../../CreateCourseForm/CreateCourseForm.module.scss'

export type LessonMoveTargetModule = {
  id: string
  title: string
}

type MoveLessonToModuleModalProps = {
  open: boolean
  lessonTitle: string
  modules: LessonMoveTargetModule[]
  onConfirm: (targetModuleId: string) => void
  onClose: () => void
  isPending: boolean
  errorMessage?: string | null
}

export default function MoveLessonToModuleModal({
  open,
  lessonTitle,
  modules,
  onConfirm,
  onClose,
  isPending,
  errorMessage,
}: MoveLessonToModuleModalProps) {
  const selectId = useId()
  const [selectedModuleId, setSelectedModuleId] = useState('')

  useEffect(() => {
    if (open) {
      setSelectedModuleId(modules[0]?.id ?? '')
    }
  }, [open, modules])

  return (
    <ConfirmDialog
      open={open}
      title="העברת שיעור לפרק אחר"
      description={`בחרו את הפרק שאליו יועבר השיעור "${lessonTitle}".`}
      confirmLabel="העבר לפרק"
      onConfirm={() => {
        if (selectedModuleId) {
          onConfirm(selectedModuleId)
        }
      }}
      onClose={onClose}
      confirmDisabled={!selectedModuleId}
      isPending={isPending}
    >
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor={selectId}>
          פרק יעד
        </label>
        <select
          id={selectId}
          className={formStyles.select}
          value={selectedModuleId}
          onChange={(event) => setSelectedModuleId(event.target.value)}
          disabled={isPending}
        >
          {modules.map((courseModule) => (
            <option key={courseModule.id} value={courseModule.id}>
              {courseModule.title}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? (
        <p className={listStyles.actionError} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </ConfirmDialog>
  )
}
