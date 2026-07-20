'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Container from '../../../ui/Container/Container'
import SectionBand from '../../SectionBand/SectionBand'
import { homepageMetrics } from '../../../../../lib/content/homepage'
import styles from './MetricsBand.module.scss'

function MetricItem({
  metric,
  index,
  isVisible,
  reducedMotion,
}: {
  metric: (typeof homepageMetrics)[0]
  index: number
  isVisible: boolean
  reducedMotion: boolean
}) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true
    if (reducedMotion) {
      setCount(metric.value)
      return
    }
    const startTime = performance.now()
    const duration = 1400

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * metric.value))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [isVisible, metric.value, reducedMotion])

  return (
    <motion.div
      className={styles.item}
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: reducedMotion ? 0 : index * 0.1 }}
    >
      <span className={styles.number}>
        {count}
        {metric.suffix}
      </span>
      <span className={styles.label}>{metric.label}</span>
    </motion.div>
  )
}

export default function MetricsBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <SectionBand variant="purple">
      <section ref={sectionRef} className={styles.wrapper}>
        <Container>
          <div className={styles.grid}>
            {homepageMetrics.map((metric, index) => (
              <MetricItem
                key={metric.label}
                metric={metric}
                index={index}
                isVisible={isVisible}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </Container>
      </section>
    </SectionBand>
  )
}
