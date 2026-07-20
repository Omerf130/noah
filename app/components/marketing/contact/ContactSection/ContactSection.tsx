import Container from '../../../ui/Container/Container'
import ContactDetails from '../ContactDetails/ContactDetails'
import ContactForm from '../ContactForm/ContactForm'
import type { ContactServiceSlug } from '../../../../../lib/content/contact'
import styles from './ContactSection.module.scss'

type ContactSectionProps = {
  id?: string
  title?: string
  subtitle?: string
  showDetails?: boolean
  defaultService?: ContactServiceSlug
  asPage?: boolean
}

export default function ContactSection({
  id = 'contact',
  title = 'צרו קשר',
  subtitle = 'מלאו את הפרטים ונחזור אליכם בהקדם',
  showDetails = false,
  defaultService = 'general',
  asPage = false,
}: ContactSectionProps) {
  const Tag = asPage ? 'div' : 'section'

  return (
    <Tag className={styles.wrapper} id={id} aria-labelledby="contact-title">
      <Container>
        <div className={styles.container}>
          <h2 id="contact-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
          {showDetails && <ContactDetails />}
          <ContactForm defaultService={defaultService} />
        </div>
      </Container>
    </Tag>
  )
}
