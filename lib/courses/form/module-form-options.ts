import { PUBLICATION_STATUSES } from '../constants'
import type { PublicationStatus } from '../types'

export type ModulePublicationStatusFormOption = {
  value: PublicationStatus
  label: string
  description: string
}

export function getModulePublicationStatusFormOptions(): ModulePublicationStatusFormOption[] {
  return [
    {
      value: 'draft',
      label: 'מוסתר',
      description: 'הפרק אינו מוצג לתלמידים.',
    },
    {
      value: 'published',
      label: 'מוצג לתלמידים',
      description: 'הפרק יוצג בעתיד בהתאם להרשאות הגישה לקורס.',
    },
  ]
}

export function getModulePublicationStatusFormOption(
  status: PublicationStatus,
): ModulePublicationStatusFormOption {
  const option = getModulePublicationStatusFormOptions().find((entry) => entry.value === status)

  if (!option) {
    return getModulePublicationStatusFormOptions()[0]
  }

  return option
}

export function isPublicationStatus(value: string): value is PublicationStatus {
  return (PUBLICATION_STATUSES as readonly string[]).includes(value)
}
