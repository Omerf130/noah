import 'server-only'

import { cache } from 'react'
import { getCurrentUser } from '../auth/current-user'
import { buildPublicAuthNavigation, type PublicAuthNavigation } from './auth-nav'

export const getPublicAuthNavigation = cache(async (): Promise<PublicAuthNavigation> => {
  const user = await getCurrentUser()
  return buildPublicAuthNavigation(user)
})
