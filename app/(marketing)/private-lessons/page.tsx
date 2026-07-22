import Link from 'next/link'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import ConversionBand from '../../components/marketing/home/ConversionBand/ConversionBand'
import MetricsBand from '../../components/marketing/home/MetricsBand/MetricsBand'
import PainPoints from '../../components/marketing/home/PainPoints/PainPoints'
import FAQ from '../../components/FAQ/FAQ'
import Testimonials from '../../components/Testimonials/Testimonials'
import { privateLessonsContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import catalogStyles from '../catalog-page.module.scss'
import styles from './page.module.scss'

const content = privateLessonsContent

function PeopleIcon({ count }: { count: 1 | 2 | 3 }) {
  if (count === 1) {
    return (
      <svg className={styles.peopleIcon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="currentColor" />
        <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" fill="currentColor" />
      </svg>
    )
  }

  if (count === 2) {
    return (
      <svg className={styles.peopleIcon} viewBox="0 0 32 24" aria-hidden="true">
        <circle cx="10" cy="8" r="3" fill="currentColor" />
        <path d="M4 20c0-3.3 2.7-6 6-6s2 .4 2.8 1.2C11.6 16.4 10 18 10 20" fill="currentColor" />
        <circle cx="22" cy="8" r="3" fill="currentColor" />
        <path d="M16 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className={styles.peopleIcon} viewBox="0 0 40 24" aria-hidden="true">
      <circle cx="8" cy="8" r="2.8" fill="currentColor" />
      <path d="M2 20c0-2.8 2.2-5 5-5s3 .5 4 1.5C9.5 17.5 8 19 8 20" fill="currentColor" />
      <circle cx="20" cy="8" r="2.8" fill="currentColor" />
      <path d="M14 20c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="currentColor" />
      <circle cx="32" cy="8" r="2.8" fill="currentColor" />
      <path d="M26 20c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="currentColor" />
    </svg>
  )
}

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
          ctaLabel={content.hero.ctaLabel}
        />

        <MetricsBand metrics={content.metrics} />

        <PainPoints title={content.audience.title} items={content.audience.items} />

        <section className={styles.chips}>
          <Container>
            <h2>{content.topics.title}</h2>
            <div className={styles.cloud}>
              {content.topics.items.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.steps}>
          <Container>
            <h2>{content.steps.title}</h2>
            <div className={styles.stepsGrid}>
              {content.steps.items.map((step, i) => (
                <article key={step.title} className={styles.stepCard}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <h3>{step.title}</h3>
                  {step.text ? <p>{step.text}</p> : null}
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.whyChoose.title}</h2>
            <ul className={styles.checkListCard}>
              {content.whyChoose.items.map((item) => (
                <li key={item}>
                  <span className={styles.checkMark} aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.learningOptions.title}</h2>
            <ul className={styles.learningOptionsCard}>
              {content.learningOptions.items.map((option, index) => (
                <li key={option.title}>
                  <PeopleIcon count={(index + 1) as 1 | 2 | 3} />
                  <div className={styles.learningOptionCopy}>
                    <strong>{option.title}</strong>
                    <p>{option.highlight}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>מחירים וחבילות</h2>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingGroupTitle}>{content.pricing.title}</h3>
              <ul className={styles.pricingList}>
                {content.pricing.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className={styles.pricingGroupTitle}>{content.packages.title}</h3>
              <ul className={styles.pricingList}>
                {content.packages.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <Testimonials title={content.testimonials.title} />

        <ConversionBand
          title={content.consultation.title}
          text={content.consultation.text}
          buttonLabel={content.consultation.buttonLabel}
          buttonHref={content.consultation.buttonHref}
        />

        <FAQ items={content.faq} />

        <section className={styles.cta}>
          <Container>
            <h2>{content.finalCta.title}</h2>
            <p>{content.finalCta.text}</p>
            <Button href={getContactHref(content.contactService)} variant="primary">
              {content.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.crossLinks.title}</h2>
            <ul className={catalogStyles.listCards}>
              {content.crossLinks.items.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </div>
    </>
  )
}
