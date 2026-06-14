import styles from './Story.module.scss'

const Story = () => {
  return (
    <section className={styles.storyWrapper}>
      <div className={styles.storyContainer}>
        <h2 className={styles.sectionTitle}>
          אני לומדת כל הזמן, אז למה אני לא מרגישה שאני מתקדמת?
        </h2>

        <div className={styles.storyCard}>
          <p className={styles.intro}>אני זוכרת שגם אני הרגשתי ככה.</p>

          <div className={styles.shortLines}>
            <p>השקעתי שעות.</p>
            <p>הכנתי סיכומים.</p>
            <p>ישבתי ללמוד.</p>
          </div>

          <p className={styles.bridge}>
            ובכל זאת, בסוף היום נשארה אותה תחושה:
          </p>

          <blockquote className={styles.quoteBlock}>
            <p>
              ״אני עושה כל כך הרבה… אז למה זה עדיין מרגיש לא מספיק?״
            </p>
          </blockquote>

          <div className={styles.closingSection}>
            <p>עם הזמן הבנתי שלא תמיד חסר לנו עוד זמן ללמוד.</p>

            <div className={styles.closingLines}>
              <p>לפעמים חסר סדר.</p>
              <p>לפעמים חסרה דרך.</p>
            </div>

            <p className={styles.closingFinal}>
              ולפעמים פשוט חסר מישהו שיעזור לנו לראות את התמונה הגדולה ולא
              רק את המשימה הבאה.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Story
