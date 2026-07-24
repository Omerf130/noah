import mongoose from 'mongoose'
import { z } from 'zod'
import { INTERNAL_NAME_PATTERN, SLUG_PATTERN } from '../constants'

export const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
  })

export const internalNameSchema = z
  .string()
  .trim()
  .min(3, 'Internal name must be at least 3 characters')
  .max(120, 'Internal name must be at most 120 characters')
  .regex(INTERNAL_NAME_PATTERN, 'Internal name must be lowercase kebab-case')

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(120, 'Slug must be at most 120 characters')
  .regex(SLUG_PATTERN, 'Slug must be lowercase kebab-case')

export const optionalObjectIdSchema = objectIdSchema.optional()

export function normalizeInternalName(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizeSlug(value: string): string {
  return value.trim().toLowerCase()
}
