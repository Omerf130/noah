import crypto from 'crypto'
import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

const authAttemptSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['login', 'register'],
      required: true,
    },
    scope: {
      type: String,
      enum: ['ip', 'email'],
      required: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  },
)

authAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
authAttemptSchema.index({ action: 1, scope: 1, identifier: 1 })

export type AuthAttemptAction = 'login' | 'register'
export type AuthAttemptScope = 'ip' | 'email'

export type AuthAttemptDocument = InferSchemaType<typeof authAttemptSchema> & {
  _id: mongoose.Types.ObjectId
}

export type AuthAttemptModel = Model<AuthAttemptDocument>

export const AuthAttempt =
  (mongoose.models.AuthAttempt as AuthAttemptModel | undefined) ??
  mongoose.model<AuthAttemptDocument>('AuthAttempt', authAttemptSchema)

export function buildAuthAttemptKey(
  action: AuthAttemptAction,
  scope: AuthAttemptScope,
  identifier: string,
): string {
  const hash = crypto
    .createHash('sha256')
    .update(`${action}:${scope}:${identifier}`)
    .digest('hex')

  return `${action}:${scope}:${hash}`
}
