import Link from 'next/link'
import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import MediaPlaceholder from '../../../components/marketing/course/MediaPlaceholder/MediaPlaceholder'
import FAQ from '../../../components/FAQ/FAQ'
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
          title={course.hero.title}
          subtitle={course.hero.subtitle}
          ctaHref={getContactHref(course.contactService)}
          ctaLabel="השאירו פרטים"
        />

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>על הקורס</h2>
            <p className={detailStyles.lead}>{course.shortDescription}</p>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>למי הקורס מתאים</h2>
            <ul className={styles.list}>
              {course.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>מה תקבלו</h2>
            <ul className={styles.list}>
              {course.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>סילבוס</h2>
            <ul className={styles.list}>
              {course.syllabus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>סרטון הסילבוס</h2>
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

        <FAQ items={course.faq} />

        <section className={styles.cta}>
          <Container>
            <Button href={getContactHref(course.contactService)} variant="primary">
              השאירו פרטים לקורס
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
