import Button from '../../../ui/Button/Button'
import Container from '../../../ui/Container/Container'
import SectionBand from '../../SectionBand/SectionBand'
import styles from './ConversionBand.module.scss'

type ConversionBandProps = {
  title: string
  subtitle?: string
  text: string
  buttonLabel: string
  buttonHref: string
  variant?: 'purple'
}

export default function ConversionBand({
  title,
  subtitle,
  text,
  buttonLabel,
  buttonHref,
  variant = 'purple',
}: ConversionBandProps) {
  return (
    <SectionBand variant={variant}>
      <div className={styles.wrapper}>
        <Container>
          <div className={styles.inner}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <p className={styles.text}>{text}</p>
            <Button href={buttonHref} variant="secondary">
              {buttonLabel}
            </Button>
          </div>
        </Container>
      </div>
    </SectionBand>
  )
}
