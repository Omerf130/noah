import { revalidatePath } from 'next/cache'

export function revalidatePublicNavigation(): void {
  revalidatePath('/', 'layout')
}
