import { requireUser } from '../../../lib/auth/current-user'
import { studentNavItems } from '../../../lib/app-shell/navigation'
import AppShell from '../../components/app-shell/AppShell/AppShell'

export const runtime = 'nodejs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser({ returnTo: '/dashboard' })

  return (
    <AppShell user={user} variant="dashboard" navItems={studentNavItems}>
      {children}
    </AppShell>
  )
}
