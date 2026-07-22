import mongoose from 'mongoose'
import { connectDb, disconnectDb } from '../db/connect'
import { getDatabaseName } from '../db/env'
import { User, isDuplicateKeyError } from '../db/models/User'
import {
  decideAdminCreateAction,
  decideAdminPromotionAction,
  parseAdminCreateInput,
  parseAdminPromotionEmail,
  type AdminCreateInput,
} from './admin-provisioning'
import { hashPassword } from '../auth/password'

export type AdminCreateOutcome =
  | { status: 'created'; email: string }
  | { status: 'existing_admin'; email: string }
  | { status: 'existing_student'; email: string }
  | { status: 'inactive_user'; email: string }
  | { status: 'duplicate_key'; email: string }

export async function createAdminUser(input: AdminCreateInput): Promise<AdminCreateOutcome> {
  await connectDb()

  const existingUser = await User.findOne({ email: input.email }).lean()
  const decision = decideAdminCreateAction(
    existingUser
      ? {
          email: String(existingUser.email),
          role: existingUser.role as 'student' | 'admin',
          isActive: Boolean(existingUser.isActive),
        }
      : null,
  )

  switch (decision.type) {
    case 'existing_admin':
      return { status: 'existing_admin', email: input.email }
    case 'existing_student':
      return { status: 'existing_student', email: input.email }
    case 'inactive_user':
      return { status: 'inactive_user', email: input.email }
    case 'create':
      break
  }

  const passwordHash = await hashPassword(input.password)

  try {
    await User.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: 'admin',
      isActive: true,
    })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { status: 'duplicate_key', email: input.email }
    }

    throw error
  }

  return { status: 'created', email: input.email }
}

export type AdminPromotionOutcome =
  | { status: 'promoted'; email: string }
  | { status: 'user_not_found'; email: string }
  | { status: 'already_admin'; email: string }
  | { status: 'inactive_user'; email: string }

export async function promoteUserToAdmin(email: string): Promise<AdminPromotionOutcome> {
  await connectDb()

  const user = await User.findOne({ email })
  const decision = decideAdminPromotionAction(
    user
      ? {
          email: String(user.email),
          role: user.role as 'student' | 'admin',
          isActive: Boolean(user.isActive),
        }
      : null,
  )

  switch (decision.type) {
    case 'user_not_found':
      return { status: 'user_not_found', email }
    case 'already_admin':
      return { status: 'already_admin', email }
    case 'inactive_user':
      return { status: 'inactive_user', email }
    case 'promote':
      user!.role = 'admin'
      await user!.save()
      return { status: 'promoted', email }
  }
}

export async function runAdminCreateFromEnv(env: NodeJS.ProcessEnv) {
  const parsed = parseAdminCreateInput({
    fullName: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  })

  if (!parsed.success) {
    return { exitCode: 1 as const, message: parsed.message }
  }

  try {
    const outcome = await createAdminUser(parsed.data)

    switch (outcome.status) {
      case 'created':
        return {
          exitCode: 0 as const,
          message: `Admin created successfully for ${outcome.email} in database "${getDatabaseName()}".`,
        }
      case 'existing_admin':
        return {
          exitCode: 0 as const,
          message: `An admin account already exists for ${outcome.email}. No changes were made.`,
        }
      case 'existing_student':
        return {
          exitCode: 1 as const,
          message: `An active student account already exists for ${outcome.email}. Use "npm run admin:promote" with CONFIRM_ADMIN_PROMOTION=true instead.`,
        }
      case 'inactive_user':
        return {
          exitCode: 1 as const,
          message: `An inactive account already exists for ${outcome.email}. No changes were made.`,
        }
      case 'duplicate_key':
        return {
          exitCode: 1 as const,
          message: `An account with email ${outcome.email} already exists. No changes were made.`,
        }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin creation failure'
    return { exitCode: 1 as const, message: `Admin creation failed: ${message}` }
  } finally {
    await disconnectDb()
    await mongoose.connection.close()
  }
}

export async function runAdminPromoteFromEnv(env: NodeJS.ProcessEnv) {
  if (env.CONFIRM_ADMIN_PROMOTION !== 'true') {
    return {
      exitCode: 1 as const,
      message: 'Promotion aborted. Set CONFIRM_ADMIN_PROMOTION=true to continue.',
    }
  }

  const parsed = parseAdminPromotionEmail(env.ADMIN_EMAIL)
  if (!parsed.success) {
    return { exitCode: 1 as const, message: parsed.message }
  }

  try {
    const outcome = await promoteUserToAdmin(parsed.email)

    switch (outcome.status) {
      case 'promoted':
        return {
          exitCode: 0 as const,
          message: `User ${outcome.email} was promoted to admin in database "${getDatabaseName()}".`,
        }
      case 'user_not_found':
        return {
          exitCode: 1 as const,
          message: `No user was found for ${outcome.email}.`,
        }
      case 'already_admin':
        return {
          exitCode: 0 as const,
          message: `${outcome.email} is already an admin. No changes were made.`,
        }
      case 'inactive_user':
        return {
          exitCode: 1 as const,
          message: `${outcome.email} is inactive. No changes were made.`,
        }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin promotion failure'
    return { exitCode: 1 as const, message: `Admin promotion failed: ${message}` }
  } finally {
    await disconnectDb()
    await mongoose.connection.close()
  }
}
