import styles from './HowItWorks.module.scss'

const HowItWorks = () => {
  return (
    <section className={styles.howItWorksWrapper} id="how-it-works">
      <div className={styles.howItWorksContainer}>
        <h2 className={styles.sectionTitle}>איך זה עובד</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <p className={styles.stepText}>קראתם והתרשמתם מהשירותים</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <p className={styles.stepText}>שלחתם פנייה ונשב להתייעצות קצרה</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <p className={styles.stepText}>נתאים יחד את הדרך שלכם ללמידה ולהתקדמות</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

