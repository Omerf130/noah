import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import {
  COURSE_CATEGORIES,
  COURSE_DIFFICULTIES,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
  DEFAULT_CURRENCY,
  DRIP_RELEASE_STRATEGIES,
  LOCK_STRATEGIES,
} from '../../courses/constants'

const pricingSchema = new Schema(
  {
    price: { type: Number, required: true, min: 0, default: 0 },
    salePrice: { type: Number, min: 0 },
    currency: { type: String, required: true, default: DEFAULT_CURRENCY, trim: true },
  },
  { _id: false },
)

const seoSchema = new Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    ogImageAssetId: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
  },
  { _id: false },
)

const dripSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, required: true },
    defaultReleaseStrategy: {
      type: String,
      enum: DRIP_RELEASE_STRATEGIES,
    },
  },
  { _id: false },
)

const accessRulesSchema = new Schema(
  {
    requiresEnrollment: { type: Boolean, required: true },
    lockStrategy: {
      type: String,
      enum: LOCK_STRATEGIES,
    },
  },
  { _id: false },
)

const courseSchema = new Schema(
  {
    internalName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    slugHistory: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: COURSE_CATEGORIES,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnailAssetId: {
      type: Schema.Types.ObjectId,
      ref: 'MediaAsset',
    },
    coverAssetId: {
      type: Schema.Types.ObjectId,
      ref: 'MediaAsset',
    },
    pricing: {
      type: pricingSchema,
      required: true,
      default: () => ({ price: 0, currency: DEFAULT_CURRENCY }),
    },
    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: 'draft',
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: COURSE_VISIBILITIES,
      default: 'private',
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      required: true,
    },
    publishedAt: { type: Date },
    archivedAt: { type: Date },
    estimatedDurationMinutes: { type: Number, min: 0 },
    difficulty: {
      type: String,
      enum: COURSE_DIFFICULTIES,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    moduleCount: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    lessonCount: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    certificateTemplateId: {
      type: Schema.Types.ObjectId,
    },
    dripSettings: dripSettingsSchema,
    accessRules: accessRulesSchema,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

courseSchema.index({ status: 1, visibility: 1, featured: -1 })
courseSchema.index({ category: 1 }, { sparse: true })

export type CourseDocument = InferSchemaType<typeof courseSchema> & {
  _id: mongoose.Types.ObjectId
}

export type CourseModel = Model<CourseDocument>

export const Course =
  (mongoose.models.Course as CourseModel | undefined) ??
  mongoose.model<CourseDocument>('Course', courseSchema)
