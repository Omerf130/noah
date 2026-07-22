import Link from 'next/link'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import ConversionBand from '../../components/marketing/home/ConversionBand/ConversionBand'
import FAQ from '../../components/FAQ/FAQ'
import Testimonials from '../../components/Testimonials/Testimonials'
import { personalGuidanceContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'

const content = personalGuidanceContent

export const metadata = buildPageMetadata({
  title: content.seo.title,
  description: content.seo.description,
  path: content.path,
})

export default function PersonalGuidancePage() {
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
          variant="journey"
          eyebrow={content.hero.eyebrow}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          ctaHref={getContactHref(content.contactService)}
          ctaLabel={content.hero.ctaLabel}
        />

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <ul className={styles.list}>
              {content.metrics.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.audience.title}</h2>
            <ul className={styles.list}>
              {content.audience.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.process.title}</h2>
            <ul className={styles.list}>
              {content.process.items.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <br />
                  {step.text}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.included.title}</h2>
            <ul className={styles.list}>
              {content.included.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.whyChoose.title}</h2>
            <ul className={styles.list}>
              {content.whyChoose.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <FAQ items={content.faq} />

        <Testimonials title={content.testimonials.title} />

        <ConversionBand
          title={content.consultation.title}
          text={content.consultation.text}
          buttonLabel={content.consultation.buttonLabel}
          buttonHref={content.consultation.buttonHref}
        />

        <section className={styles.cta}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.finalCta.title}</h2>
            <p className={styles.sectionSub}>{content.finalCta.text}</p>
            <Button href={getContactHref(content.contactService)} variant="primary">
              {content.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{content.crossLinks.title}</h2>
            <ul className={styles.list}>
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
