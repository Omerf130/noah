import { describe, expect, it } from 'vitest'
import { getDatabaseName, getMongoUri } from '../env'

describe('database env validation', () => {
  it('throws when MONGODB_URI is missing', () => {
    delete process.env.MONGODB_URI

    expect(() => getMongoUri()).toThrow('Database configuration error: MONGODB_URI is not set')
  })

  it('returns trimmed MONGODB_URI when set', () => {
    process.env.MONGODB_URI = '  mongodb://localhost:27017/noah2-dev  '

    expect(getMongoUri()).toBe('mongodb://localhost:27017/noah2-dev')
  })

  it('extracts database name without exposing full URI details beyond pathname', () => {
    process.env.MONGODB_URI = 'mongodb+srv://user:secret@cluster.example.net/noah2-dev?retryWrites=true'

    expect(getDatabaseName()).toBe('noah2-dev')
  })

  it('throws for invalid URI format', () => {
    process.env.MONGODB_URI = 'not-a-valid-uri'

    expect(() => getDatabaseName()).toThrow('Database configuration error: invalid MONGODB_URI format')
  })
})
