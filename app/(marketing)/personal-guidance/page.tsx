import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import PackageCards from '../../components/marketing/content/PackageCards/PackageCards'
import ComparisonSection from '../../components/marketing/content/ComparisonSection/ComparisonSection'
import { personalGuidanceContent } from '../../../lib/content/services'
import { getContactHref } from '../../../lib/contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'
import pageStyles from './page.module.scss'

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
          ctaLabel="לבירור התאמה"
        />

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>חבילות ליווי</h2>
            <p className={styles.sectionSub}>בחרו את קצב התהליך שמתאים לכם - ללא הצגת מחיר בשלב זה.</p>
            <PackageCards packages={content.packages} />
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>מה כולל התהליך</h2>
            <ul className={styles.list}>
              {content.process.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>ליווי אישי מול שיעור פרטי</h2>
            <p className={styles.sectionSub}>ההבדל המרכזי - תהליך מתמשך מול מפגש ממוקד.</p>
            <ComparisonSection
              guidance={content.comparison.guidance}
              lesson={content.comparison.lesson}
            />
          </Container>
        </section>

        <section className={pageStyles.cta}>
          <Container>
            <Button href={getContactHref(content.contactService)} variant="primary">
              לבירור התאמה לליווי
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
