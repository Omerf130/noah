'use client'

import { useEffect } from 'react'
import Container from './components/ui/Container/Container'
import Button from './components/ui/Button/Button'
import styles from './error.module.scss'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>משהו השתבש</h1>
        <p className={styles.text}>אירעה שגיאה בטעינת הדף. אפשר לנסות שוב.</p>
        <div className={styles.actions}>
          <Button onClick={reset} variant="primary">
            נסו שוב
          </Button>
          <Button href="/" variant="ghost">
            חזרה לדף הבית
          </Button>
        </div>
      </div>
    </Container>
  )
}
