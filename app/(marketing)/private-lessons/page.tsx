import Link from 'next/link'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import PackageCards from '../../components/marketing/content/PackageCards/PackageCards'
import ConversionBand from '../../components/marketing/home/ConversionBand/ConversionBand'
import FAQ from '../../components/FAQ/FAQ'
import Testimonials from '../../components/Testimonials/Testimonials'
import { privateLessonsContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import catalogStyles from '../catalog-page.module.scss'
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
          ctaLabel={content.hero.ctaLabel}
        />

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <ul className={catalogStyles.list}>
              {content.metrics.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.audience.title}</h2>
            <ul className={catalogStyles.list}>
              {content.audience.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

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
            <div className={styles.grid}>
              {content.steps.items.map((step, i) => (
                <article key={step.title}>
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
            <ul className={catalogStyles.list}>
              {content.whyChoose.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.learningOptions.title}</h2>
            <PackageCards packages={content.learningOptions.items} />
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.pricing.title}</h2>
            <ul className={catalogStyles.list}>
              {content.pricing.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{content.packages.title}</h2>
            <ul className={catalogStyles.list}>
              {content.packages.items.map((item) => (
                <li key={item}>{item}</li>
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
            <ul className={catalogStyles.list}>
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
