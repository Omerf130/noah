import Link from 'next/link'
import styles from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          עוזרת לכם לעשות סדר בלימודי סיעוד ולהתמיד לאורך זמן
        </h1>
        <p className={styles.heroSubtitle}>
          שילוב של שיטה ללמידה ותרגול, חיזוק משמעת עצמית וביטחון,
          וליווי שמחזיק את הדרך – לא רק את המבחן הבא.
        </p>
        <div className={styles.heroButtons}>
          <Link href="/#contact" className={styles.primaryBtn}>
            להתייעצות
          </Link>
          <Link href="/#services" className={styles.secondaryBtn}>
            להכיר את השירותים
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero

