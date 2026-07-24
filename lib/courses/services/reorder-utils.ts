import mongoose from 'mongoose'
import { CourseValidationError } from './errors'

export function validateScopedReorderIds(
  orderedIds: string[],
  scopedExistingIds: Set<string>,
  entityLabel: string,
): void {
  if (orderedIds.length !== scopedExistingIds.size) {
    throw new CourseValidationError(
      `Reorder payload must include every ${entityLabel} in the parent scope`,
    )
  }

  const seen = new Set<string>()

  for (const id of orderedIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CourseValidationError(`Reorder payload contains an invalid ${entityLabel} id`)
    }

    if (seen.has(id)) {
      throw new CourseValidationError('Reorder payload contains duplicate ids')
    }

    seen.add(id)

    if (!scopedExistingIds.has(id)) {
      throw new CourseValidationError(`Reorder payload contains an invalid ${entityLabel} id`)
    }
  }
}

export function buildScopedOrderUpdates(
  parentFilter: Record<string, mongoose.Types.ObjectId>,
  orderedIds: string[],
  orderGap: number,
) {
  return orderedIds.map((id, index) => ({
    updateOne: {
      filter: {
        _id: new mongoose.Types.ObjectId(id),
        ...parentFilter,
      },
      update: {
        $set: {
          order: (index + 1) * orderGap,
        },
      },
    },
  }))
}

export function assertBulkWriteMatchedAll(
  matchedCount: number | undefined,
  expectedCount: number,
  entityLabel: string,
): void {
  if (matchedCount !== expectedCount) {
    throw new CourseValidationError(
      `Reorder failed to update all ${entityLabel} records in the parent scope`,
    )
  }
}
