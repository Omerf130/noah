import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { RELEASE_RULE_TYPES } from '../../courses/constants'

const releaseRuleSchema = new Schema(
  {
    type: {
      type: String,
      enum: RELEASE_RULE_TYPES,
      required: true,
    },
    value: { type: Schema.Types.Mixed },
  },
  { _id: false },
)

const courseModuleSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    releaseRule: releaseRuleSchema,
    isLockedByDefault: {
      type: Boolean,
    },
    lessonCount: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

courseModuleSchema.index({ courseId: 1, order: 1 })
courseModuleSchema.index({ courseId: 1, slug: 1 }, { unique: true })

export type CourseModuleDocument = InferSchemaType<typeof courseModuleSchema> & {
  _id: mongoose.Types.ObjectId
}

export type CourseModuleModel = Model<CourseModuleDocument>

export const CourseModule =
  (mongoose.models.CourseModule as CourseModuleModel | undefined) ??
  mongoose.model<CourseModuleDocument>('CourseModule', courseModuleSchema)
