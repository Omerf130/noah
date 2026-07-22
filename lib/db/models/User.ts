import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { normalizeEmail } from '../../auth/normalize-email'

type UserTransformRecord = Record<string, unknown> & {
  passwordHash?: string
}

function toSafeUserObject(ret: UserTransformRecord) {
  const { passwordHash, ...safe } = ret
  void passwordHash
  return safe
}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        return toSafeUserObject(ret as UserTransformRecord)
      },
    },
    toObject: {
      transform(_doc, ret) {
        return toSafeUserObject(ret as UserTransformRecord)
      },
    },
  },
)

userSchema.pre('save', function normalizeUserFields() {
  if (this.isModified('email') && typeof this.email === 'string') {
    this.email = normalizeEmail(this.email)
  }

  if (this.isModified('fullName') && typeof this.fullName === 'string') {
    this.fullName = this.fullName.trim()
  }
})

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId
}

export type UserModel = Model<UserDocument>

export const User =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<UserDocument>('User', userSchema)

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  )
}
