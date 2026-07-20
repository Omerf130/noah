import Button from '../../../ui/Button/Button'
import Container from '../../../ui/Container/Container'
import SectionBand from '../../SectionBand/SectionBand'
import styles from './ConversionBand.module.scss'

export default function ConversionBand() {
  return (
    <SectionBand variant="purple">
      <div className={styles.wrapper}>
        <Container>
          <div className={styles.inner}>
            <h2 className={styles.title}>מוכנים לעשות סדר בדרך?</h2>
            <p className={styles.text}>
              שלחו הודעה — נדבר קצר, נבין מה אתם צריכים, ונראה יחד מה מתאים.
              בלי התחייבות, בלי לחץ.
            </p>
            <Button href="/#contact" variant="secondary">
              לשיחה בוואטסאפ
            </Button>
          </div>
        </Container>
      </div>
    </SectionBand>
  )
}
