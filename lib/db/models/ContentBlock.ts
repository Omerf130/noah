import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { CONTENT_BLOCK_TYPES, RICH_TEXT_SCHEMA_VERSION } from '../../courses/constants/content-block'

const richTextBlockDataSchema = new Schema(
  {
    schemaVersion: {
      type: Number,
      enum: [RICH_TEXT_SCHEMA_VERSION],
      default: RICH_TEXT_SCHEMA_VERSION,
      required: true,
    },
    document: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
)

const contentBlockSchema = new Schema(
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
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: CONTENT_BLOCK_TYPES,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    richTextData: {
      type: richTextBlockDataSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

contentBlockSchema.index({ lessonId: 1, order: 1 }, { unique: true })
contentBlockSchema.index({ courseId: 1, moduleId: 1, lessonId: 1 })

export type ContentBlockDocument = InferSchemaType<typeof contentBlockSchema> & {
  _id: mongoose.Types.ObjectId
}

export type ContentBlockModel = Model<ContentBlockDocument>

export const ContentBlock =
  (mongoose.models.ContentBlock as ContentBlockModel | undefined) ??
  mongoose.model<ContentBlockDocument>('ContentBlock', contentBlockSchema)
