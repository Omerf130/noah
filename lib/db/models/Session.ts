import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    versionKey: false,
  },
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  _id: mongoose.Types.ObjectId
}

export type SessionModel = Model<SessionDocument>

export const Session =
  (mongoose.models.Session as SessionModel | undefined) ??
  mongoose.model<SessionDocument>('Session', sessionSchema)
