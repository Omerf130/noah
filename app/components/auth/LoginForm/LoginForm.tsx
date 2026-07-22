'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import {
  getFirstFieldError,
  initialAuthActionState,
} from '../../../../lib/auth/actions/action-state'
import { loginAction } from '../../../../lib/auth/actions/login'
import Button from '../../ui/Button/Button'
import ClientMount from '../../ui/ClientMount/ClientMount'
import Input from '../../ui/Input/Input'
import AuthFormMessage from '../AuthFormMessage/AuthFormMessage'
import styles from '../AuthForm/AuthForm.module.scss'

type LoginFormProps = {
  returnTo?: string | null
}

function LoginFormInner({ returnTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialAuthActionState)

  return (
    <form className={styles.form} action={formAction} noValidate>
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

      <AuthFormMessage message={state.formError} />

      <Input
        id="email"
        name="email"
        label="אימייל"
        type="email"
        autoComplete="email"
        placeholder="הכניסו כתובת אימייל..."
        defaultValue={state.values?.email ?? ''}
        required
        aria-invalid={Boolean(getFirstFieldError(state.fieldErrors, 'email'))}
        disabled={isPending}
      />
      {getFirstFieldError(state.fieldErrors, 'email') && (
        <p className={styles.fieldError}>{getFirstFieldError(state.fieldErrors, 'email')}</p>
      )}

      <Input
        id="password"
        name="password"
        label="סיסמה"
        type="password"
        autoComplete="current-password"
        placeholder="הכניסו סיסמה..."
        required
        aria-invalid={Boolean(getFirstFieldError(state.fieldErrors, 'password'))}
        disabled={isPending}
      />
      {getFirstFieldError(state.fieldErrors, 'password') && (
        <p className={styles.fieldError}>{getFirstFieldError(state.fieldErrors, 'password')}</p>
      )}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'מתחברים...' : 'התחברות'}
        </Button>
      </div>

      <div className={styles.links}>
        <Link href="/register" className={styles.link}>
          אין לכם חשבון? הירשמו
        </Link>
        <Link href="/forgot-password" className={styles.link}>
          שכחתם סיסמה?
        </Link>
      </div>
    </form>
  )
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <ClientMount>
      <LoginFormInner {...props} />
    </ClientMount>
  )
}
