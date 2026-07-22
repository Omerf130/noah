import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import { revalidatePublicNavigation } from '../revalidate-public-nav'

describe('revalidatePublicNavigation', () => {
  it('revalidates the root layout after auth state changes', () => {
    revalidatePublicNavigation()

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })
})
