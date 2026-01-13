'use client'

import { FormEvent } from 'react'
import styles from './Contact.module.scss'

const Contact = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const name = formData.get('name') as string || ''
    const phone = formData.get('phone') as string || ''
    const email = formData.get('email') as string || ''
    const service = formData.get('service') as string || ''
    const message = formData.get('message') as string || ''
    
    // Build WhatsApp message
    let whatsappMessage = 'שלום, אני מעוניין/ת במידע על השירותים שלך.\n\n'
    
    if (name) {
      whatsappMessage += `שם: ${name}\n`
    }
    if (phone) {
      whatsappMessage += `טלפון: ${phone}\n`
    }
    if (email) {
      whatsappMessage += `מייל: ${email}\n`
    }
    if (service) {
      const serviceNames: Record<string, string> = {
        'private-lessons': 'שיעורים פרטיים',
        'private-process': 'ליווי אישי',
        'booklet': 'מידע על החוברת'
      }
      whatsappMessage += `שירות: ${serviceNames[service] || service}\n`
    }
    if (message) {
      whatsappMessage += `\nהודעה:\n${message}`
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const phoneNumber = '972543050482'
    
    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Create WhatsApp URL
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className={styles.contactWrapper} id="contact">
      <div className={styles.contactContainer}>
        <h1 className={styles.contactTitle}>צרו קשר</h1>
        <p className={styles.contactSub}>
          מלאו את הפרטים ונחזור אליכם בהקדם
        </p>

        <form className={styles.contactForm} onSubmit={handleSubmit} suppressHydrationWarning>
          <div className={styles.formGroup}>
            <label htmlFor="name">שם פרטי</label>
            <input 
              id="name"
              name="name"
              type="text" 
              placeholder="הכניסו שם..." 
              suppressHydrationWarning
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">טלפון</label>
            <input 
              id="phone"
              name="phone"
              type="tel" 
              placeholder="הכניסו מספר טלפון..." 
              suppressHydrationWarning
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">מייל</label>
            <input 
              id="email"
              name="email"
              type="email" 
              placeholder="הכניסו כתובת מייל..." 
              suppressHydrationWarning
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service">בחירת שירות</label>
            <select id="service" name="service" suppressHydrationWarning>
              <option value="private-lessons">שיעורים פרטיים</option>
              <option value="private-process">ליווי אישי</option>
              <option value="booklet">מידע על החוברת</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label htmlFor="message">טקסט חופשי</label>
            <textarea 
              id="message"
              name="message"
              placeholder="כתבו לי ואחזור אליכם בהקדם :)" 
              suppressHydrationWarning
            ></textarea>
          </div>

          <button type="submit" className={styles.contactBtn} suppressHydrationWarning>
            שליחה
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;


