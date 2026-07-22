import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUserFromSession } from './session'
import type { SafeUser } from './types'

type AuthGuardOptions = {
  returnTo?: string
}

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  return getCurrentUserFromSession()
})

function redirectToLogin(returnTo?: string): never {
  if (returnTo) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }

  redirect('/login')
}

export async function requireUser(options?: AuthGuardOptions): Promise<SafeUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirectToLogin(options?.returnTo)
  }

  return user
}

export async function requireAdmin(options?: AuthGuardOptions): Promise<SafeUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirectToLogin(options?.returnTo)
  }

  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  return user
}