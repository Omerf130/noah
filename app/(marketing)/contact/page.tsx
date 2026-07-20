import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import { resolveContactService } from '../../../lib/contact'
import ContactSection from '../../components/marketing/contact/ContactSection/ContactSection'

export const metadata = buildPageMetadata({
  title: 'צור קשר',
  description: 'צרו קשר עם נועה — ליווי, שיעורים, קורסים ומוצרים לסטודנטים לסיעוד.',
  path: '/contact',
})

type ContactPageProps = {
  searchParams: Promise<{ service?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const defaultService = resolveContactService(params.service)

  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'צור קשר',
          description: 'צרו קשר עם נועה — ליווי, שיעורים, קורסים ומוצרים לסטודנטים לסיעוד.',
          path: '/contact',
        })}
      />
      <ContactSection
        asPage
        showDetails
        defaultService={defaultService}
        title="צרו קשר"
        subtitle="מלאו את הפרטים, התקשרו או שלחו הודעה — ונחזור אליכם בהקדם"
      />
    </>
  )
}
