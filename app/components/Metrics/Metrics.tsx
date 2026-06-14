'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Metrics.module.scss'

interface Metric {
  value: number
  suffix: string
  label: string
  description: string
}

const metrics: Metric[] = [
  {
    value: 97,
    suffix: '%+',
    label: 'אחוז מעבר',
    description: 'של סטודנטיות שעברו בהצלחה',
  },
  {
    value: 10,
    suffix: '+',
    label: 'סטודנטיות שליוויתי',
    description: 'בליווי אישי וממוקד',
  },
  {
    value: 100,
    suffix: '%',
    label: 'ליווי מותאם אישית',
    description: 'תוכנית למידה לפי הצרכים האישיים',
  },
  {
    value: 50,
    suffix: '+',
    label: 'שעות ליווי ולמידה',
    description: 'שעות של תמיכה, תרגול והכוונה',
  },
]

function useCountUp(end: number, duration: number, shouldAnimate: boolean) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [shouldAnimate, end, duration])

  return count
}

function MetricCard({
  metric,
  shouldAnimate,
  reducedMotion,
}: {
  metric: Metric
  shouldAnimate: boolean
  reducedMotion: boolean
}) {
  const displayCount = useCountUp(
    metric.value,
    reducedMotion ? 0 : 1500,
    shouldAnimate
  )
  const displayValue = reducedMotion && !shouldAnimate ? 0 : displayCount

  return (
    <motion.div
      className={styles.metricCard}
      variants={
        reducedMotion
          ? {}
          : {
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }
      }
      whileHover={
        reducedMotion
          ? {}
          : {
              y: -5,
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            }
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className={styles.metricNumber}>
        {displayValue}
        {metric.suffix}
      </div>
      <div className={styles.metricLabel}>{metric.label}</div>
      <p className={styles.metricDescription}>{metric.description}</p>
    </motion.div>
  )
}

const Metrics = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion() ?? false

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    },
    []
  )

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2,
    })
    observer.observe(node)

    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <section className={styles.metricsWrapper} ref={sectionRef}>
      <div className={styles.metricsContainer}>
        <motion.h2
          className={styles.sectionTitle}
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={
            isVisible ? { opacity: 1, y: 0 } : reducedMotion ? {} : undefined
          }
          transition={{ duration: 0.5 }}
        >
          המספרים שמאחורי ההצלחה
        </motion.h2>
        <motion.p
          className={styles.sectionSubtitle}
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={
            isVisible ? { opacity: 1, y: 0 } : reducedMotion ? {} : undefined
          }
          transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.15 }}
        >
          נתונים שמספרים את הסיפור טוב יותר מכל מילה.
        </motion.p>
        <motion.div
          className={styles.metricsGrid}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={
            reducedMotion
              ? {}
              : {
                  visible: {
                    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
                  },
                }
          }
        >
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              metric={metric}
              shouldAnimate={isVisible}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Metrics
