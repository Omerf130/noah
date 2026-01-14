import Link from 'next/link'
import styles from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          בואו ללמוד סיעוד בנוח
        </h1>
        <p className={styles.heroSubtitle}>
          שילוב של שיטה ללמידה ותרגול, חיזוק משמעת עצמית וביטחון,
          וליווי שמחזיק את הדרך – לא רק את המבחן הבא.
        </p>
        <Link href="/#contact" className={styles.primaryBtn}>
          לשאלות והתייעצות
        </Link>
      </div>
    </section>
  )
}

export default Hero

