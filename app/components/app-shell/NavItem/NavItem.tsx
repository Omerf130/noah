import Link from 'next/link'
import type { AppNavItem } from '../../../../lib/app-shell/navigation'
import styles from './NavItem.module.scss'

type NavItemProps = {
  item: AppNavItem
  isActive: boolean
  onNavigate?: () => void
  variant?: 'dashboard' | 'admin'
}

export default function NavItem({
  item,
  isActive,
  onNavigate,
  variant = 'dashboard',
}: NavItemProps) {
  const className = [
    styles.item,
    styles[variant],
    isActive ? styles.active : '',
    item.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (item.disabled || !item.href) {
    return (
      <span className={className} aria-disabled="true">
        {item.label}
        <span className={styles.soon}>בקרוב</span>
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  )
}
