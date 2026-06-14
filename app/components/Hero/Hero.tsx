'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Hero.module.scss'

const Hero = () => {
  const reducedMotion = useReducedMotion()
  const ease = [0.25, 0.1, 0.25, 1] as const

  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        }

  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroOverlay} />

      <div className={styles.heroContainer}>
        <motion.h1 className={styles.heroTitle} {...fadeUp(0.15)}>
          אתם לא צריכים ללמוד יותר.
        </motion.h1>
        <motion.h2 className={styles.heroTitle2} {...fadeUp(0.3)}>
          אתם צריכים ללמוד{' '}
          <span className={styles.heroHighlight}>אחרת, בנוח.</span>
        </motion.h2>
        <motion.p className={styles.heroSubtitle} {...fadeUp(0.45)}>
          ליווי אישי, שיעורים פרטיים וכלים לסטודנטים לסיעוד שרוצים יותר
          סדר, יותר ביטחון ויותר שקט בדרך להצלחה
        </motion.p>
        <motion.div className={styles.heroButtons} {...fadeUp(0.6)}>
          <Link href="/#contact" className={styles.primaryBtn}>
            לתיאום שיחת היכרות
          </Link>
          <Link href="/#services" className={styles.secondaryBtn}>
            לצפייה בשירותים
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
