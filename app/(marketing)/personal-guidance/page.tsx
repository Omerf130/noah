import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import ConversionBand from '../../components/marketing/home/ConversionBand/ConversionBand'
import MetricsBand from '../../components/marketing/home/MetricsBand/MetricsBand'
import PainPoints from '../../components/marketing/home/PainPoints/PainPoints'
import FAQ from '../../components/FAQ/FAQ'
import Testimonials from '../../components/Testimonials/Testimonials'
import { personalGuidanceContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import catalogStyles from '../catalog-page.module.scss'
import styles from './page.module.scss'

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
      <div className={catalogStyles.page} dir="rtl">
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

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.process.title}</h2>
            <ul className={catalogStyles.listCards}>
              {content.process.items.map((step) => (
                <li key={step.title}>
                  <strong className={styles.listCardItemTitle}>{step.title}</strong>
                  {step.text}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, styles.includedSection].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.included.title}</h2>
            <ul className={styles.includedCards}>
              {content.included.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
            <h2 className={catalogStyles.sectionTitle}>{content.finalCta.title}</h2>
            <p className={catalogStyles.sectionSub}>{content.finalCta.text}</p>
            <Button href={getContactHref(content.contactService)} variant="primary">
              {content.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
