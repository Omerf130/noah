import Container from './components/ui/Container/Container'
import Button from './components/ui/Button/Button'
import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <Container>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>הדף לא נמצא</h1>
        <p className={styles.text}>ייתכן שהקישור שגוי או שהדף הוסר.</p>
        <Button href="/" variant="primary">
          חזרה לדף הבית
        </Button>
      </div>
    </Container>
  )
}
