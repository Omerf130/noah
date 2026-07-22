import styles from './LogoutButton.module.scss'
import { logoutAction } from '../../../../lib/auth/actions/logout'
import type { AppShellVariant } from '../../../../lib/app-shell/navigation'

type LogoutButtonProps = {
  variant?: AppShellVariant
}

export default function LogoutButton({ variant = 'dashboard' }: LogoutButtonProps) {
  return (
    <form action={logoutAction} className={[styles.form, styles[variant]].filter(Boolean).join(' ')}>
      <button type="submit" className={styles.button}>
        התנתקות
      </button>
    </form>
  )
}
