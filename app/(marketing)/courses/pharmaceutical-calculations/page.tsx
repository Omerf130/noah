import Link from 'next/link'
import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import MediaPlaceholder from '../../../components/marketing/course/MediaPlaceholder/MediaPlaceholder'
import FAQ from '../../../components/FAQ/FAQ'
import ConversionBand from '../../../components/marketing/home/ConversionBand/ConversionBand'
import Testimonials from '../../../components/Testimonials/Testimonials'
import { pharmaceuticalCalculationsCourse } from '../../../../lib/content/courses'
import { getContactHref } from '../../../../lib/contact'
import { buildPageMetadata, buildCourseJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../lib/JsonLd'
import styles from '../../catalog-page.module.scss'
import detailStyles from './page.module.scss'

const course = pharmaceuticalCalculationsCourse

export const metadata = buildPageMetadata({
  title: course.seo.title,
  description: course.seo.description,
  path: course.path,
})

export default function PharmaceuticalCalculationsPage() {
  return (
    <>
      <JsonLd
        data={buildCourseJsonLd({
          title: course.seo.title,
          description: course.seo.description,
          path: course.path,
        })}
      />
      <div className={styles.page} dir="rtl">
        <PageHero
          variant="focus"
          eyebrow={course.hero.eyebrow}
          stat={course.hero.stat}
          title={course.hero.title}
          subtitle={course.hero.subtitle}
          ctaHref={getContactHref(course.contactService)}
          ctaLabel={course.hero.ctaLabel}
        />

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <ul className={styles.list}>
              {course.metrics.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <p className={detailStyles.lead}>{course.intro.title}</p>
            <p className={detailStyles.lead}>{course.intro.text}</p>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.audience.title}</h2>
            <ul className={styles.list}>
              {course.audience.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.modules.title}</h2>
            <p className={styles.sectionSub}>{course.modules.intro}</p>
            <ul className={styles.list}>
              {course.modules.items.map((module) => (
                <li key={module.title}>
                  <strong>{module.title}</strong>
                  <br />
                  {module.text}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.deliverables.title}</h2>
            <ul className={styles.list}>
              {course.deliverables.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.whyItWorks.title}</h2>
            <ul className={styles.list}>
              {course.whyItWorks.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.preview.title}</h2>
            <p className={styles.sectionSub}>{course.preview.caption}</p>
            <MediaPlaceholder videoUrl={course.syllabusVideoUrl} />
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>ערכת תרגול משלימה</h2>
            <p className={detailStyles.lead}>
              הקורס משתלב עם{' '}
              <Link href={course.relatedProductPath}>ערכת התרגול</Link> לתרגול עצמאי נוסף.
            </p>
          </Container>
        </section>

        <Testimonials title={course.testimonials.title} />

        <ConversionBand
          title={course.consultation.title}
          text={course.consultation.text}
          buttonLabel={course.consultation.buttonLabel}
          buttonHref={course.consultation.buttonHref}
        />

        <FAQ items={course.faq} />

        <section className={styles.cta}>
          <Container>
            <h2 className={styles.sectionTitle}>{course.finalCta.title}</h2>
            <p className={styles.sectionSub}>{course.finalCta.text}</p>
            <Button href={getContactHref(course.contactService)} variant="primary">
              {course.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
