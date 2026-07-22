import { requireAdmin } from '../../../lib/auth/current-user'
import { adminNavItems } from '../../../lib/app-shell/navigation'
import AppShell from '../../components/app-shell/AppShell/AppShell'

export const runtime = 'nodejs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin({ returnTo: '/admin' })

  return (
    <AppShell
      user={user}
      variant="admin"
      navItems={adminNavItems}
      showDashboardLink
    >
      {children}
    </AppShell>
  )
}
