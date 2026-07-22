import type { ReactNode } from 'react'
import type { AppNavItem, AppShellVariant } from '../../../../lib/app-shell/navigation'
import type { SafeUser } from '../../../../lib/auth/types'
import AppHeader from '../AppHeader/AppHeader'
import AppSidebar from '../AppSidebar/AppSidebar'
import styles from './AppShell.module.scss'

type AppShellProps = {
  user: SafeUser
  variant: AppShellVariant
  navItems: AppNavItem[]
  showDashboardLink?: boolean
  children: ReactNode
}

export default function AppShell({
  user,
  variant,
  navItems,
  showDashboardLink = false,
  children,
}: AppShellProps) {
  return (
    <div className={[styles.shell, styles[variant]].filter(Boolean).join(' ')} dir="rtl">
      <AppHeader
        user={user}
        variant={variant}
        navItems={navItems}
        showDashboardLink={showDashboardLink}
      />

      <div className={styles.body}>
        <AppSidebar items={navItems} variant={variant} />
        <main id="main-content" className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}
