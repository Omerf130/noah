import { redirect } from 'next/navigation'
import AuthShell from '../../components/auth/AuthShell/AuthShell'
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm'
import { getCurrentUser } from '../../../lib/auth/current-user'
import { getAuthenticatedAuthRedirect } from '../../../lib/app-shell/navigation'
import { buildPageMetadata } from '../../../lib/seo'

export const runtime = 'nodejs'

export const metadata = buildPageMetadata({
  title: 'הרשמה',
  description: 'יצירת חשבון סטודנט באתר נוח.',
  path: '/register',
  noIndex: true,
})

export default async function RegisterPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(getAuthenticatedAuthRedirect(user.role))
  }

  return (
    <AuthShell
      title="יצירת חשבון"
      subtitle="הצטרפו לאזור האישי כדי לגשת לקורסים, חומרי למידה והתקדמות — כשהם יהיו זמינים."
    >
      <RegisterForm />
    </AuthShell>
  )
}
