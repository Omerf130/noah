'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Button from '../ui/Button/Button'
import Container from '../ui/Container/Container'
import PlatformPreview from '../marketing/PlatformPreview/PlatformPreview'
import styles from './Hero.module.scss'

export default function Hero() {
  const reducedMotion = useReducedMotion()

  const fade = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        }

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.meshGlow} aria-hidden="true" />
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <motion.span className={styles.eyebrow} {...fade(0.1)}>
              ליווי, שיעורים וכלים לסטודנטים לסיעוד
            </motion.span>
            <motion.h1 id="hero-title" className={styles.title} {...fade(0.2)}>
              לומדים סיעוד — בקצב שלכם, בדרך שעובדת
            </motion.h1>
            <motion.p className={styles.subtitle} {...fade(0.35)}>
              נועה מלווה סטודנטים לסיעוד בליווי אישי, שיעורים פרטיים והמלווה הקליני —
              עם סדר, ביטחון ותחושה שיש מי שמבין את הדרך.
            </motion.p>
            <motion.div className={styles.actions} {...fade(0.5)}>
              <Button href="/#contact" variant="primary">
                לשיחת היכרות בוואטסאפ
              </Button>
              <Button href="/#services" variant="ghost">
                גלו את השירותים
              </Button>
            </motion.div>
            <motion.p className={styles.trustLine} {...fade(0.6)}>
              6 מפגשי ליווי · שיעורים בזום · חוברת עצמאית לכל התואר
            </motion.p>
          </div>
          <motion.div className={styles.visual} {...fade(0.3)}>
            <PlatformPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
