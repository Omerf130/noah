import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { BLOCK_TYPES, LESSON_STATUSES, RELEASE_RULE_TYPES } from '../../courses/constants'

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

const lessonBlockSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: BLOCK_TYPES,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  { _id: false },
)

const lessonSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'CourseModule',
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
    summary: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    blocks: {
      type: [lessonBlockSchema],
      default: [],
    },
    estimatedDurationMinutes: {
      type: Number,
      min: 0,
    },
    quizId: {
      type: Schema.Types.ObjectId,
    },
    prerequisiteLessonIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    releaseRule: releaseRuleSchema,
    isPreviewFree: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: LESSON_STATUSES,
      default: 'draft',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

lessonSchema.index({ moduleId: 1, order: 1 })
lessonSchema.index({ courseId: 1, slug: 1 }, { unique: true })

export type LessonDocument = InferSchemaType<typeof lessonSchema> & {
  _id: mongoose.Types.ObjectId
}

export type LessonModel = Model<LessonDocument>

export const Lesson =
  (mongoose.models.Lesson as LessonModel | undefined) ??
  mongoose.model<LessonDocument>('Lesson', lessonSchema)
