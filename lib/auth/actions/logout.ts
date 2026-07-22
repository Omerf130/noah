'use server'

import { redirect } from 'next/navigation'
import { revalidatePublicNavigation } from '../revalidate-public-nav'
import { destroyUserSession } from '../session'

export async function logoutAction(): Promise<void> {
  try {
    await destroyUserSession()
    revalidatePublicNavigation()
  } catch (error) {
    console.error('Logout failed', {
      error: error instanceof Error ? error.message : 'Unknown logout error',
    })
  }

  redirect('/login')
}
