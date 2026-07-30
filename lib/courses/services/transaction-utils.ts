import mongoose, { type ClientSession } from 'mongoose'
import { connectDb } from '../../db/connect'

export async function mongoSupportsTransactions(): Promise<boolean> {
  await connectDb()

  if (!mongoose.connection.db) {
    return false
  }

  try {
    const admin = mongoose.connection.db.admin()
    const serverStatus = await admin.command({ hello: 1 })
    const setName = serverStatus.setName

    return typeof setName === 'string' && setName.length > 0
  } catch {
    return false
  }
}

export async function runInTransaction<T>(
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> {
  await connectDb()

  const session = await mongoose.startSession()

  try {
    let result: T | undefined

    await session.withTransaction(async () => {
      result = await operation(session)
    })

    if (result === undefined) {
      throw new Error('Transaction completed without returning a result')
    }

    return result
  } finally {
    await session.endSession()
  }
}
