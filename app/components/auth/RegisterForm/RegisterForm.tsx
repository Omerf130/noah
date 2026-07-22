'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import {
  getFirstFieldError,
  initialAuthActionState,
} from '../../../../lib/auth/actions/action-state'
import { registerAction } from '../../../../lib/auth/actions/register'
import Button from '../../ui/Button/Button'
import ClientMount from '../../ui/ClientMount/ClientMount'
import Input from '../../ui/Input/Input'
import AuthFormMessage from '../AuthFormMessage/AuthFormMessage'
import styles from '../AuthForm/AuthForm.module.scss'

function RegisterFormInner() {
  const [state, formAction, isPending] = useActionState(registerAction, initialAuthActionState)

  return (
    <form className={styles.form} action={formAction} noValidate>
      <AuthFormMessage message={state.formError} />

      <Input
        id="fullName"
        name="fullName"
        label="שם מלא"
        type="text"
        autoComplete="name"
        placeholder="הכניסו שם מלא..."
        defaultValue={state.values?.fullName ?? ''}
        required
        minLength={2}
        aria-invalid={Boolean(getFirstFieldError(state.fieldErrors, 'fullName'))}
        disabled={isPending}
      />
      {getFirstFieldError(state.fieldErrors, 'fullName') && (
        <p className={styles.fieldError}>{getFirstFieldError(state.fieldErrors, 'fullName')}</p>
      )}

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
        autoComplete="new-password"
        placeholder="בחרו סיסמה..."
        required
        minLength={8}
        aria-invalid={Boolean(getFirstFieldError(state.fieldErrors, 'password'))}
        disabled={isPending}
      />
      {getFirstFieldError(state.fieldErrors, 'password') && (
        <p className={styles.fieldError}>{getFirstFieldError(state.fieldErrors, 'password')}</p>
      )}

      <p className={styles.hint}>
        הסיסמה חייבת להכיל לפחות 8 תווים, אות אחת וספרה אחת.
      </p>

      <Input
        id="confirmPassword"
        name="confirmPassword"
        label="אימות סיסמה"
        type="password"
        autoComplete="new-password"
        placeholder="הקלידו שוב את הסיסמה..."
        required
        minLength={8}
        aria-invalid={Boolean(getFirstFieldError(state.fieldErrors, 'confirmPassword'))}
        disabled={isPending}
      />
      {getFirstFieldError(state.fieldErrors, 'confirmPassword') && (
        <p className={styles.fieldError}>
          {getFirstFieldError(state.fieldErrors, 'confirmPassword')}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'נרשמים...' : 'יצירת חשבון'}
        </Button>
      </div>

      <div className={styles.links}>
        <Link href="/login" className={styles.link}>
          כבר יש לכם חשבון? התחברו
        </Link>
      </div>
    </form>
  )
}

export default function RegisterForm() {
  return (
    <ClientMount>
      <RegisterFormInner />
    </ClientMount>
  )
}
