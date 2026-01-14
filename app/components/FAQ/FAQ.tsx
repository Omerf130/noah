'use client'

import { useState } from 'react'
import styles from './FAQ.module.scss'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'מה ההבדל בין ליווי אישי לשיעור פרטי?',
      answer: 'ליווי אישי הוא תהליך מובנה של 6 מפגשים שמתמקד בבניית כלים, שגרה ומשמעת עצמית. שיעור פרטי הוא מפגש ממוקד בחומר ספציפי או הכנה למבחן. אפשר לשלב ביניהם לפי הצורך.',
    },
    {
      question: 'זה מתאים גם לתחילת התואר?',
      answer: 'כן, בהחלט. השירותים מתאימים לכל שלב בתואר – מתחילת הדרך ועד סיום. כל אחד מגיע עם אתגרים שונים, והתהליך מותאם למקום שבו אתם נמצאים.',
    },
    {
      question: 'זה מתקיים בזום?',
      answer: 'נכון לעכשיו השיעורים הפרטיים והליווי מתקיימים בזום.',
    },
    {
      question: 'כמה זמן לוקח לראות שינוי?',
      answer: 'זה תלוי במקום שבו אתם נמצאים ובמה שאתם עובדים עליו. יש סטודנטים שמרגישים שינוי כבר אחרי כמה מפגשים, ויש שצריכים יותר זמן. המטרה היא תהליך מתמשך ולא פתרון מהיר.',
    },
    {
      question: 'האם החוברת מתאימה גם בלי ליווי?',
      answer: 'כן, בהחלט. החוברת היא תהליך עצמאי לגמרי וניתן לעבוד איתה לבד. מי שרוצים יכולים גם לשלב אותה עם ליווי אישי או שיעורים פרטיים.',
    },
    {
      question: 'אפשר לשלב בין השירותים?',
      answer: 'כן, בהחלט. אפשר לשלב בין השירותים לפי הצורך – למשל, ליווי אישי עם שיעורים פרטיים, או חוברת עם ליווי. נדבר יחד על מה מתאים לכם.',
    },
    {
      question: 'איך מתחילים?',
      answer: 'פשוט שולחים פנייה דרך הטופס או וואטסאפ, ונשב להתייעצות קצרה. נדבר על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד מה מתאים.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.faqWrapper} id="faq">
      <div className={styles.faqContainer}>
        <h2 className={styles.sectionTitle}>שאלות נפוצות</h2>
        <p className={styles.subtitle}>אם עדיין יש ספק – יכול להיות שהתשובה כאן</p>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                suppressHydrationWarning
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
      </div>
    </section>
  )
}

export default FAQ

