import Link from 'next/link'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import CatalogCard from '../../components/marketing/catalog/CatalogCard/CatalogCard'
import { coursesCatalog, coursesPage } from '../../../lib/content/courses'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'

export const metadata = buildPageMetadata({
  title: coursesPage.seo.title,
  description: coursesPage.seo.description,
  path: '/courses',
})

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: coursesPage.seo.title,
          description: coursesPage.seo.description,
          path: '/courses',
        })}
      />
      <div className={styles.page} dir="rtl">
        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h1 className={styles.sectionTitle}>{coursesPage.title}</h1>
            <p className={styles.sectionSub}>{coursesPage.intro}</p>
            <div className={styles.cta}>
              <Button href={coursesPage.heroCtaHref} variant="primary">
                {coursesPage.heroCta}
              </Button>
            </div>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{coursesPage.whyChoose.title}</h2>
            <ul className={styles.listCards}>
              {coursesPage.whyChoose.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')} id="courses">
          <Container>
            <div className={styles.grid}>
              {coursesCatalog.map((course) => (
                <CatalogCard
                  key={course.slug}
                  title={course.title}
                  subtitle={course.subtitle}
                  description={course.shortDescription}
                  href={course.path}
                  contactService={course.contactService}
                  status={course.status}
                  accent="lavender"
                  ctaLabel={course.ctaLabel}
                />
              ))}
            </div>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{coursesPage.deliverables.title}</h2>
            <ul className={styles.listCards}>
              {coursesPage.deliverables.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <h2 className={styles.sectionTitle}>{coursesPage.finalCta.title}</h2>
            <p className={styles.sectionSub}>{coursesPage.finalCta.text}</p>
            <Button href={coursesPage.finalCta.buttonHref} variant="primary">
              {coursesPage.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{coursesPage.crossLinks.title}</h2>
            <ul className={styles.listCards}>
              {coursesPage.crossLinks.items.map((link) => (
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
