import Link from 'next/link'
import {
  getRoleLabel,
  type AppNavItem,
  type AppShellVariant,
} from '../../../../lib/app-shell/navigation'
import type { SafeUser } from '../../../../lib/auth/types'
import LogoutButton from '../LogoutButton/LogoutButton'
import MobileNav from '../MobileNav/MobileNav'
import styles from './AppHeader.module.scss'

type AppHeaderProps = {
  user: SafeUser
  variant: AppShellVariant
  navItems: AppNavItem[]
  showDashboardLink?: boolean
}

export default function AppHeader({
  user,
  variant,
  navItems,
  showDashboardLink = false,
}: AppHeaderProps) {
  return (
    <header className={[styles.header, styles[variant]].filter(Boolean).join(' ')}>
      <div className={styles.start}>
        <MobileNav items={navItems} variant={variant} />
        <Link href="/" className={styles.brandLink}>
          נוח
        </Link>
      </div>

      <div className={styles.end}>
        <div className={styles.userMeta}>
          <span className={styles.userName}>{user.fullName}</span>
          <span className={styles.roleBadge}>{getRoleLabel(user.role)}</span>
        </div>

        {showDashboardLink ? (
          <Link href="/dashboard" className={styles.secondaryLink}>
            לאזור האישי
          </Link>
        ) : null}

        <Link href="/" className={styles.secondaryLink}>
          לאתר הציבורי
        </Link>

        <LogoutButton variant={variant} />
      </div>
    </header>
  )
}
