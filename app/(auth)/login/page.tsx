import { redirect } from 'next/navigation'
import AuthShell from '../../components/auth/AuthShell/AuthShell'
import LoginForm from '../../components/auth/LoginForm/LoginForm'
import { getCurrentUser } from '../../../lib/auth/current-user'
import { sanitizeReturnTo } from '../../../lib/auth/return-to'
import { buildPageMetadata } from '../../../lib/seo'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'התחברות',
  description: 'התחברות לאזור האישי של נוח.',
  path: '/login',
  noIndex: true,
})

type LoginPageProps = {
  searchParams: Promise<{
    returnTo?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser()

  if (user) {
    redirect(user.role === 'admin' ? '/admin' : '/dashboard')
  }

  const params = await searchParams
  const returnTo = sanitizeReturnTo(params.returnTo ?? null)

  return (
    <AuthShell
      title="ברוכים השבים"
      subtitle="התחברו לחשבון שלכם כדי לגשת לאזור האישי, לקורסים ולחומרי הלמידה."
    >
      <LoginForm returnTo={returnTo ?? undefined} />
    </AuthShell>
  )
}
