import styles from './loading.module.scss'

export default function Loading() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p>טוען...</p>
    </div>
  )
}
