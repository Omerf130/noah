'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Container from '../../../ui/Container/Container'
import SectionBand from '../../SectionBand/SectionBand'
import { homepageMetrics } from '../../../../../lib/content/homepage'
import styles from './MetricsBand.module.scss'

export type MetricBandItem = {
  value?: number
  suffix?: string
  label: string
}

type MetricItemProps = {
  metric: MetricBandItem
  index: number
  isVisible: boolean
  reducedMotion: boolean
}

function MetricItem({ metric, index, isVisible, reducedMotion }: MetricItemProps) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)
  const hasNumericValue = typeof metric.value === 'number'

  useEffect(() => {
    if (!hasNumericValue || !isVisible || hasAnimated.current) return
    hasAnimated.current = true
    if (reducedMotion) {
      setCount(metric.value ?? 0)
      return
    }
    const startTime = performance.now()
    const duration = 1400

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * (metric.value ?? 0)))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [hasNumericValue, isVisible, metric.value, reducedMotion])

  return (
    <motion.div
      className={styles.item}
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: reducedMotion ? 0 : index * 0.1 }}
    >
      {hasNumericValue ? (
        <>
          <span className={styles.number}>
            {count}
            {metric.suffix}
          </span>
          <span className={styles.label}>{metric.label}</span>
        </>
      ) : (
        <span className={styles.labelOnly}>{metric.label}</span>
      )}
    </motion.div>
  )
}

type MetricsBandProps = {
  metrics?: MetricBandItem[]
}

export default function MetricsBand({ metrics = homepageMetrics }: MetricsBandProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion() ?? false
  const gridClass =
    metrics.length === 3 ? styles.gridThree : metrics.length === 4 ? styles.gridFour : styles.gridAuto

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <SectionBand variant="purple" className={styles.band}>
      <section ref={sectionRef} className={styles.wrapper}>
        <Container>
          <div className={[styles.grid, gridClass].filter(Boolean).join(' ')}>
            {metrics.map((metric, index) => (
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
