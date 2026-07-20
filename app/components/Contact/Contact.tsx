'use client'

import { FormEvent } from 'react'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import TextArea from '../ui/TextArea/TextArea'
import Container from '../ui/Container/Container'
import ClientMount from '../ui/ClientMount/ClientMount'
import styles from './Contact.module.scss'

function ContactFormShell() {
  return <div className={styles.formShell} aria-hidden="true" />
}

function ContactForm({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <Input id="name" name="name" label="שם פרטי" type="text" placeholder="הכניסו שם..." />
      <Input id="phone" name="phone" label="טלפון" type="tel" placeholder="הכניסו מספר טלפון..." />
      <Input id="email" name="email" label="מייל" type="email" placeholder="הכניסו כתובת מייל..." />

      <div className={styles.selectGroup}>
        <label htmlFor="service">בחירת שירות</label>
        <select id="service" name="service">
          <option value="private-lessons">שיעורים פרטיים</option>
          <option value="private-process">ליווי אישי</option>
          <option value="booklet">מידע על החוברת</option>
        </select>
      </div>

      <TextArea
        id="message"
        name="message"
        label="טקסט חופשי"
        placeholder="כתבו לי ואחזור אליכם בהקדם :)"
        className={styles.full}
      />

      <Button type="submit" variant="primary" className={styles.submitBtn}>
        שליחה
      </Button>
    </form>
  )
}

const Contact = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get('name') as string) || ''
    const phone = (formData.get('phone') as string) || ''
    const email = (formData.get('email') as string) || ''
    const service = (formData.get('service') as string) || ''
    const message = (formData.get('message') as string) || ''

    let whatsappMessage = 'שלום, אני מעוניין/ת במידע על השירותים שלך.\n\n'

    if (name) whatsappMessage += `שם: ${name}\n`
    if (phone) whatsappMessage += `טלפון: ${phone}\n`
    if (email) whatsappMessage += `מייל: ${email}\n`
    if (service) {
      const serviceNames: Record<string, string> = {
        'private-lessons': 'שיעורים פרטיים',
        'private-process': 'ליווי אישי',
        booklet: 'מידע על החוברת',
      }
      whatsappMessage += `שירות: ${serviceNames[service] || service}\n`
    }
    if (message) whatsappMessage += `\nהודעה:\n${message}`

    const encodedMessage = encodeURIComponent(whatsappMessage)
    const phoneNumber = '972543050482'
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className={styles.contactWrapper} id="contact" aria-labelledby="contact-title">
      <Container>
        <div className={styles.contactContainer}>
          <h2 id="contact-title" className={styles.contactTitle}>
            צרו קשר
          </h2>
          <p className={styles.contactSub}>מלאו את הפרטים ונחזור אליכם בהקדם</p>

          <ClientMount fallback={<ContactFormShell />}>
            <ContactForm onSubmit={handleSubmit} />
          </ClientMount>
        </div>
      </Container>
    </section>
  )
}

export default Contact
