import Image from 'next/image'
import Link from 'next/link'
import Container from '../../ui/Container/Container'
import styles from './AuthShell.module.scss'

type AuthShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className={styles.shell} dir="rtl">
      <header className={styles.header}>
        <Container>
          <Link href="/" className={styles.homeLink}>
            <Image
              src="/pics/logo.jpeg"
              alt="נוח – חזרה לדף הבית"
              width={56}
              height={56}
              className={styles.logo}
            />
            <span>חזרה לדף הבית</span>
          </Link>
        </Container>
      </header>

      <main className={styles.main}>
        <Container>
          <div className={styles.card}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
            {children}
          </div>
        </Container>
      </main>
    </div>
  )
}
