'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Button from '../ui/Button/Button'
import Container from '../ui/Container/Container'
import PlatformPreview from '../marketing/PlatformPreview/PlatformPreview'
import { homepageHero } from '../../../lib/content/homepage'
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
            <motion.h1 id="hero-title" className={styles.title} {...fade(0.2)}>
              {homepageHero.title}
            </motion.h1>
            <motion.p className={styles.subtitle} {...fade(0.35)}>
              {homepageHero.subtitle}
            </motion.p>
            <motion.div className={styles.actions} {...fade(0.5)}>
              <Button href={homepageHero.primaryHref} variant="primary">
                {homepageHero.primaryCta}
              </Button>
              <Button href={homepageHero.secondaryHref} variant="ghost">
                {homepageHero.secondaryCta}
              </Button>
            </motion.div>
          </div>
          <motion.div className={styles.visual} {...fade(0.3)}>
            <PlatformPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
