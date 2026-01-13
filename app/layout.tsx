import type { Metadata, Viewport } from 'next'
import './globals.scss'
import BackgroundWrapper from './components/BackgroundWrapper/BackgroundWrapper'

export const metadata: Metadata = {
  title: 'נועה - ליווי סטודנטים לסיעוד',
  description: 'ליווי אישי, שיעורים פרטיים והמלווה הקליני לסטודנטים לסיעוד',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <BackgroundWrapper>{children}</BackgroundWrapper>
      </body>
    </html>
  )
}


