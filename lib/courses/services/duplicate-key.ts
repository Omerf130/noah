import { isDuplicateKeyError } from '../../db/models'
import type { CourseDuplicateKeyField } from './errors'

export function getCourseDuplicateKeyField(error: unknown): CourseDuplicateKeyField {
  if (!isDuplicateKeyError(error)) {
    return 'unknown'
  }

  const mongoError = error as {
    keyPattern?: Record<string, unknown>
    keyValue?: Record<string, unknown>
  }

  if (mongoError.keyPattern?.internalName) {
    return 'internalName'
  }

  if (mongoError.keyPattern?.slug) {
    return 'slug'
  }

  if (mongoError.keyValue?.internalName !== undefined) {
    return 'internalName'
  }

  if (mongoError.keyValue?.slug !== undefined) {
    return 'slug'
  }

  return 'unknown'
}
