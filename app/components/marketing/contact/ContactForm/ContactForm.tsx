'use client'

import { FormEvent, useState } from 'react'
import Button from '../../../ui/Button/Button'
import Input from '../../../ui/Input/Input'
import TextArea from '../../../ui/TextArea/TextArea'
import ClientMount from '../../../ui/ClientMount/ClientMount'
import { contactServiceOptions, type ContactServiceSlug } from '../../../../../lib/content/contact'
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  validateContactForm,
  type ContactFormValues,
} from '../../../../../lib/contact'
import { siteConfig } from '../../../../../lib/site'
import styles from './ContactForm.module.scss'

type ContactFormProps = {
  defaultService?: ContactServiceSlug
}

function ContactFormInner({ defaultService = 'general' }: ContactFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const values: ContactFormValues = {
      name: (formData.get('name') as string) || '',
      phone: (formData.get('phone') as string) || '',
      email: (formData.get('email') as string) || '',
      service: (formData.get('service') as ContactServiceSlug) || 'general',
      message: (formData.get('message') as string) || '',
    }

    const validationErrors = validateContactForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    const message = buildWhatsAppMessage(values)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const whatsappUrl = buildWhatsAppUrl(message, siteConfig.whatsappNumber, isMobile)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        id="name"
        name="name"
        label="שם מלא"
        type="text"
        placeholder="הכניסו שם מלא..."
        required
        aria-invalid={Boolean(errors.name)}
      />
      {errors.name && <p className={styles.error}>{errors.name}</p>}

      <Input
        id="phone"
        name="phone"
        label="טלפון"
        type="tel"
        placeholder="הכניסו מספר טלפון..."
        required
        aria-invalid={Boolean(errors.phone)}
      />
      {errors.phone && <p className={styles.error}>{errors.phone}</p>}

      <Input
        id="email"
        name="email"
        label="מייל (אופציונלי)"
        type="email"
        placeholder="הכניסו כתובת מייל..."
      />

      <div className={styles.selectGroup}>
        <label htmlFor="service">נושא הפנייה</label>
        <select id="service" name="service" defaultValue={defaultService} required>
          {contactServiceOptions.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service && <p className={styles.error}>{errors.service}</p>}
      </div>

      <TextArea
        id="message"
        name="message"
        label="הודעה (אופציונלי)"
        placeholder="כתבו לי ואחזור אליכם בהקדם :)"
        className={styles.full}
      />

      <Button type="submit" variant="primary" className={styles.submitBtn}>
        שליחה בוואטסאפ
      </Button>
    </form>
  )
}

export default function ContactForm({ defaultService = 'general' }: ContactFormProps) {
  return (
    <ClientMount fallback={<div className={styles.formShell} aria-hidden="true" />}>
      <ContactFormInner defaultService={defaultService} />
    </ClientMount>
  )
}
