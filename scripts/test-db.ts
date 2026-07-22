import mongoose from 'mongoose'
import { connectDb, disconnectDb } from '../lib/db/connect'
import { getDatabaseName } from '../lib/db/env'
import { AuthAttempt } from '../lib/db/models/AuthAttempt'
import { Session } from '../lib/db/models/Session'
import { User } from '../lib/db/models/User'

type MongoIndex = {
  name?: string
  key?: Record<string, unknown>
  expireAfterSeconds?: number
}

function hasTtlIndexOnExpiresAt(indexes: MongoIndex[]): boolean {
  return indexes.some(
    (index) => index.key?.expiresAt === 1 && index.expireAfterSeconds === 0,
  )
}

async function syncModelIndexes(model: typeof User | typeof Session | typeof AuthAttempt) {
  try {
    await model.syncIndexes()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (!message.includes('equivalent index already exists')) {
      throw error
    }

    const indexes = await model.collection.indexes()
    const expiresAtIndex = indexes.find((index) => index.name === 'expiresAt_1')

    if (
      expiresAtIndex &&
      (expiresAtIndex as MongoIndex).expireAfterSeconds !== 0
    ) {
      await model.collection.dropIndex('expiresAt_1')
      await model.syncIndexes()
      return
    }

    throw error
  }
}

async function main() {
  try {
    await connectDb()

    await syncModelIndexes(User)
    await syncModelIndexes(Session)
    await syncModelIndexes(AuthAttempt)

    const [userIndexes, sessionIndexes, authAttemptIndexes] = await Promise.all([
      User.collection.indexes(),
      Session.collection.indexes(),
      AuthAttempt.collection.indexes(),
    ])

    const sessionTtlOk = hasTtlIndexOnExpiresAt(sessionIndexes as MongoIndex[])
    const authAttemptTtlOk = hasTtlIndexOnExpiresAt(authAttemptIndexes as MongoIndex[])

    if (!sessionTtlOk || !authAttemptTtlOk) {
      throw new Error('Database index verification failed: required TTL indexes are missing')
    }

    const databaseName = getDatabaseName()

    console.log('Database connection successful.')
    console.log(`Database name: ${databaseName}`)
    console.log(`User indexes synchronized: ${userIndexes.length}`)
    console.log(`Session indexes synchronized: ${sessionIndexes.length}`)
    console.log(`AuthAttempt indexes synchronized: ${authAttemptIndexes.length}`)
    console.log('Session TTL index on expiresAt: confirmed')
    console.log('AuthAttempt TTL index on expiresAt: confirmed')
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Database connection test failed unexpectedly'
    console.error(`Database connection test failed: ${message}`)
    process.exitCode = 1
  } finally {
    await disconnectDb()
    await mongoose.connection.close()
  }
}

void main()
