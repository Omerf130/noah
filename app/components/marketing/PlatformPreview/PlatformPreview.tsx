'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Icon from '../Icon/Icon'
import styles from './PlatformPreview.module.scss'

export default function PlatformPreview() {
  const reducedMotion = useReducedMotion()

  const fade = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        }

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.blobPurple} />
      <div className={styles.blobTeal} />

      <motion.div className={styles.mainCard} {...fade(0.2)}>
        <div className={styles.cardHeader}>
          <span className={styles.badge}>חוויית למידה</span>
          <span className={styles.liveDot} />
        </div>
        <p className={styles.cardTitle}>המסלול שלכם בסיעוד</p>
        <div className={styles.progressRow}>
          <span>התקדמות שבועית</span>
          <strong>68%</strong>
        </div>
        <div className={styles.progressBar}>
          <span style={{ width: '68%' }} />
        </div>
        <div className={styles.statsRow}>
          <div>
            <Icon name="checklist" size={18} />
            <span>12 שיעורים</span>
          </div>
          <div>
            <Icon name="chart" size={18} />
            <span>4 מבחנים</span>
          </div>
        </div>
      </motion.div>

      <motion.div className={styles.lessonCard} {...fade(0.45)}>
        <Icon name="book" size={20} />
        <div>
          <p className={styles.lessonLabel}>שיעור הבא</p>
          <p className={styles.lessonTitle}>יסודות הסיעוד · מודול 2</p>
        </div>
      </motion.div>

      <motion.div className={styles.metricChip} {...fade(0.6)}>
        <span className={styles.chipNumber}>97%+</span>
        <span className={styles.chipLabel}>אחוז מעבר</span>
      </motion.div>
    </div>
  )
}
