'use client'

import { useMemo, useState } from 'react'
import { getModulePublicationStatusFormOptions } from '../../../../../../lib/courses/form/module-form-options'
import type { PublicationStatus } from '../../../../../../lib/courses/types'
import type { ModuleMetadataFormValues } from '../../../../../../lib/courses/validators/admin-module-metadata-fields'
import Input from '../../../../ui/Input/Input'
import TextArea from '../../../../ui/TextArea/TextArea'
import styles from '../../CreateCourseForm/CreateCourseForm.module.scss'

type ModuleMetadataFieldsProps = {
  values?: ModuleMetadataFormValues
  getFieldError: (field: string) => string | undefined
  isPending: boolean
}

export default function ModuleMetadataFields({
  values,
  getFieldError,
  isPending,
}: ModuleMetadataFieldsProps) {
  const publicationOptions = useMemo(() => getModulePublicationStatusFormOptions(), [])
  const initialPublicationStatus = values?.publicationStatus ?? 'draft'
  const [selectedPublicationStatus, setSelectedPublicationStatus] = useState(
    initialPublicationStatus,
  )

  const selectedPublicationDescription = useMemo(
    () =>
      publicationOptions.find((option) => option.value === selectedPublicationStatus)
        ?.description ?? '',
    [publicationOptions, selectedPublicationStatus],
  )

  return (
    <div className={styles.formGrid}>
      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <Input
          id="title"
          name="title"
          label="שם הפרק"
          type="text"
          required
          defaultValue={values?.title ?? ''}
          aria-invalid={Boolean(getFieldError('title'))}
          disabled={isPending}
        />
        {getFieldError('title') && <p className={styles.fieldError}>{getFieldError('title')}</p>}
      </div>

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <TextArea
          id="description"
          name="description"
          label="תיאור"
          defaultValue={values?.description ?? ''}
          aria-invalid={Boolean(getFieldError('description'))}
          disabled={isPending}
        />
        {getFieldError('description') && (
          <p className={styles.fieldError}>{getFieldError('description')}</p>
        )}
      </div>

      <div className={[styles.field, styles.fieldFull].join(' ')}>
        <label className={styles.label} htmlFor="publicationStatus">
          סטטוס תצוגה
        </label>
        <select
          id="publicationStatus"
          name="publicationStatus"
          className={styles.select}
          defaultValue={initialPublicationStatus}
          onChange={(event) =>
            setSelectedPublicationStatus(event.target.value as PublicationStatus)
          }
          aria-invalid={Boolean(getFieldError('publicationStatus'))}
          aria-describedby="publicationStatus-help"
          disabled={isPending}
        >
          {publicationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p id="publicationStatus-help" className={styles.hint}>
          {selectedPublicationDescription}
        </p>
        {getFieldError('publicationStatus') && (
          <p className={styles.fieldError}>{getFieldError('publicationStatus')}</p>
        )}
      </div>
    </div>
  )
}
