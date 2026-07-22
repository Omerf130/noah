'use client'

import { usePathname } from 'next/navigation'
import type { AppNavItem, AppShellVariant } from '../../../../lib/app-shell/navigation'
import NavItem from '../NavItem/NavItem'
import styles from './AppSidebar.module.scss'

type AppSidebarProps = {
  items: AppNavItem[]
  variant: AppShellVariant
  onNavigate?: () => void
  className?: string
}

export default function AppSidebar({
  items,
  variant,
  onNavigate,
  className = '',
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <nav
      className={[styles.sidebar, styles[variant], className].filter(Boolean).join(' ')}
      aria-label="ניווט אזור אישי"
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <NavItem
              item={item}
              isActive={Boolean(item.href && item.href === pathname)}
              onNavigate={onNavigate}
              variant={variant}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
