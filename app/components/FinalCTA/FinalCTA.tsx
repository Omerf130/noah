import Link from 'next/link'
import styles from './FinalCTA.module.scss'

const FinalCTA = () => {
  return (
    <section className={styles.finalCTAWrapper}>
      <div className={styles.finalCTAContainer}>
        <Link href="/#contact" className={styles.finalCTABtn}>
          לשאלות והתייעצות
        </Link>
      </div>
    </section>
  )
}

export default FinalCTA

