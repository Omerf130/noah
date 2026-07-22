const MONGODB_URI_ENV = 'MONGODB_URI'

export function getMongoUri(): string {
  const uri = process.env[MONGODB_URI_ENV]?.trim()

  if (!uri) {
    throw new Error('Database configuration error: MONGODB_URI is not set')
  }

  return uri
}

export function getDatabaseName(): string {
  const uri = getMongoUri()

  try {
    const parsed = new URL(uri)
    const pathname = parsed.pathname.replace(/^\//, '').trim()
    return pathname || 'test'
  } catch {
    throw new Error('Database configuration error: invalid MONGODB_URI format')
  }
}
