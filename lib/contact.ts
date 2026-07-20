import { contactServiceOptions, type ContactServiceSlug } from './content/contact'

export function isValidContactService(value: string | null | undefined): value is ContactServiceSlug {
  if (!value) return false
  return contactServiceOptions.some((option) => option.slug === value)
}

export function resolveContactService(value: string | null | undefined): ContactServiceSlug {
  return isValidContactService(value) ? value : 'general'
}

export function getContactHref(service?: ContactServiceSlug): string {
  if (!service || service === 'general') {
    return '/contact'
  }
  return `/contact?service=${service}`
}

export function getServiceLabel(slug: ContactServiceSlug): string {
  const match = contactServiceOptions.find((option) => option.slug === slug)
  return match?.label ?? slug
}

export type ContactFormValues = {
  name: string
  phone: string
  email: string
  service: ContactServiceSlug
  message: string
}

export function validateContactForm(values: ContactFormValues): Partial<Record<keyof ContactFormValues, string>> {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {}

  if (!values.name.trim()) {
    errors.name = 'נא להזין שם מלא'
  }
  if (!values.phone.trim()) {
    errors.phone = 'נא להזין מספר טלפון'
  }
  if (!values.service) {
    errors.service = 'נא לבחור נושא פנייה'
  }

  return errors
}

export function buildWhatsAppMessage(values: ContactFormValues): string {
  const serviceLabel = getServiceLabel(values.service)
  let message = 'שלום, אני מעוניין/ת במידע.\n\n'

  message += `שם: ${values.name.trim()}\n`
  message += `טלפון: ${values.phone.trim()}\n`
  message += `מייל: ${values.email.trim() || 'לא צוין'}\n`
  message += `נושא: ${serviceLabel}\n`
  message += `\nהודעה:\n${values.message.trim() || '—'}`

  return message
}

export function buildWhatsAppUrl(message: string, phoneNumber: string, isMobile: boolean): string {
  const encodedMessage = encodeURIComponent(message)
  return isMobile
    ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
}
