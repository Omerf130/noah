import Link from 'next/link'
import styles from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          אתם לא צריכים ללמוד יותר.
        </h1>
        <h2 className={styles.heroTitle}>
          אתם צריכים ללמוד אחרת, בנוח.
        </h2>
        <p className={styles.heroSubtitle}>
          ליווי אישי, שיעורים פרטיים וכלים לסטודנטים לסיעוד שרוצים יותר סדר, יותר ביטחון ויותר שקט בדרך להצלחה
        </p>
        <Link href="/#contact" className={styles.primaryBtn}>
          אני רוצה להצליח בתואר!
        </Link>
      </div>
    </section>
  )
}

export default Hero

