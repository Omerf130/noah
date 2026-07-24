import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { VIDEO_PROVIDERS, VIDEO_STATUSES } from '../../courses/constants'

const playbackCacheSchema = new Schema(
  {
    expiresAt: { type: Date, required: true },
    signedUrl: { type: String, trim: true },
  },
  { _id: false },
)

const videoAssetSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: VIDEO_PROVIDERS,
      default: 'pending',
      required: true,
    },
    providerAssetId: {
      type: String,
      trim: true,
    },
    providerData: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: VIDEO_STATUSES,
      default: 'uploading',
      required: true,
    },
    durationSeconds: {
      type: Number,
      min: 0,
    },
    posterAssetId: {
      type: Schema.Types.ObjectId,
      ref: 'MediaAsset',
    },
    transcriptAssetId: {
      type: Schema.Types.ObjectId,
      ref: 'MediaAsset',
    },
    playbackCache: playbackCacheSchema,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

videoAssetSchema.index({ provider: 1, status: 1 })

export type VideoAssetDocument = InferSchemaType<typeof videoAssetSchema> & {
  _id: mongoose.Types.ObjectId
}

export type VideoAssetModel = Model<VideoAssetDocument>

export const VideoAsset =
  (mongoose.models.VideoAsset as VideoAssetModel | undefined) ??
  mongoose.model<VideoAssetDocument>('VideoAsset', videoAssetSchema)
