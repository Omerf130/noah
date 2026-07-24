import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { MEDIA_ASSET_KINDS, STORAGE_PROVIDERS } from '../../courses/constants'

const mediaAssetSchema = new Schema(
  {
    kind: {
      type: String,
      enum: MEDIA_ASSET_KINDS,
      required: true,
    },
    storageProvider: {
      type: String,
      enum: STORAGE_PROVIDERS,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
      min: 0,
    },
    url: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    pageCount: {
      type: Number,
      min: 0,
    },
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

mediaAssetSchema.index({ kind: 1, uploadedBy: 1 })

export type MediaAssetDocument = InferSchemaType<typeof mediaAssetSchema> & {
  _id: mongoose.Types.ObjectId
}

export type MediaAssetModel = Model<MediaAssetDocument>

export const MediaAsset =
  (mongoose.models.MediaAsset as MediaAssetModel | undefined) ??
  mongoose.model<MediaAssetDocument>('MediaAsset', mediaAssetSchema)
