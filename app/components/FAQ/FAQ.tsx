'use client'

import { useState } from 'react'
import ClientMount from '../ui/ClientMount/ClientMount'
import { homepageFaq } from '../../../lib/content/services'
import styles from './FAQ.module.scss'

type FaqItem = {
  question: string
  answer: string
}

type FAQProps = {
  items?: FaqItem[]
  title?: string
  subtitle?: string
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.faqList}>
      {items.map((faq, index) => (
        <div key={faq.question} className={styles.faqItem}>
          <button
            className={styles.faqQuestion}
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
          >
            <span>{faq.question}</span>
            <span className={styles.arrow}>{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className={styles.faqAnswer}>
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function FaqStaticFallback({ items }: { items: FaqItem[] }) {
  return (
    <div className={styles.faqList}>
      {items.map((faq) => (
        <div key={faq.question} className={styles.faqItem}>
          <div className={styles.staticQuestion}>
            <span>{faq.question}</span>
            <span className={styles.arrow}>+</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FAQ({
  items = homepageFaq,
  title = 'שאלות נפוצות',
  subtitle = 'אם עדיין יש ספק – יכול להיות שהתשובה כאן',
}: FAQProps) {
  return (
    <section className={styles.faqWrapper} id="faq">
      <div className={styles.faqContainer}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <ClientMount fallback={<FaqStaticFallback items={items} />}>
          <FaqAccordion items={items} />
        </ClientMount>
      </div>
    </section>
  )
}
