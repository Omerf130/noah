import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { privateLessonsContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from './page.module.scss'

const content = privateLessonsContent

export const metadata = buildPageMetadata({
  title: content.seo.title,
  description: content.seo.description,
  path: content.path,
})

export default function PrivateLessonsPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: content.seo.title,
          description: content.seo.description,
          path: content.path,
        })}
      />
      <div className={styles.page} dir="rtl">
        <PageHero
          variant="focus"
          eyebrow={content.hero.eyebrow}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          ctaHref={getContactHref(content.contactService)}
          ctaLabel="לתיאום שיעור"
        />

        <section className={styles.chips}>
          <Container>
            <h2>נושאים ומקצועות</h2>
            <div className={styles.cloud}>
              {content.topics.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.steps}>
          <Container>
            <h2>איך שיעור נראה בפועל</h2>
            <div className={styles.grid}>
              {content.steps.map((step, i) => (
                <article key={step.title}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <Button href={getContactHref(content.contactService)} variant="primary">
              לתיאום שיעור פרטי
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
