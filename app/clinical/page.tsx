import Nav from '../components/Nav/Nav'
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.scss'

export default function ClinicalPage() {
  return (
    <>
      <Nav />
      <main className={styles.main} dir="rtl">
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>נוח – המלווה הקליני</h1>
            <p className={styles.heroSubtitle}>
              תהליך אישי עצמאי שמלווה סטודנטים לסיעוד לאורך כל התואר.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/#contact" className={styles.primaryBtn}>
                צור קשר
              </Link>
              <Link href="/#contact" className={styles.secondaryBtn}>
                לקבלת פרטים על החוברת
              </Link>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>אם אתם מרגישים ש…</h2>
            <ul className={styles.bulletList}>
              <li>העומס מצטבר ואין לכם סדר ברור</li>
              <li>קשה לכם להחזיק שגרה לימודית ותרגול רציף</li>
              <li>תקופות מבחנים שואבות מכם את הכול</li>
              <li>חוויות מהקליניקה מציפות אתכם</li>
              <li>יש לכם רצון להרגיש יותר ביטחון ומסוגלות</li>
              <li>אתם רוצים דרך מסודרת לגדול לא רק בידע אלא גם בזהות המקצועית</li>
            </ul>
            <p className={styles.softLine}>נוח יכולה להיות המקום שלכם לעצור, לעשות סדר ולהמשיך.</p>
          </div>
        </section>

        {/* What is "נוח" */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>מה זה "נוח"</h2>
            <div className={styles.contentBox}>
              <p className={styles.paragraph}>
                "נוח – המלווה הקליני" היא חוברת עבודה שנועדה ללוות אתכם לאורך כל התואר – בקצב שלכם. זו לא "עוד חוברת" ולא ספר לימוד. זו תהליך אישי עצמאי שמשלב בין למידה יעילה, רפלקציה אישית וארגון – כדי לעזור לכם להתמודד עם אתגרי התואר בנוחות ובביטחון.
              </p>
              <p className={styles.paragraph}>
                החוברת משלבת טיפים מקצועיים ללמידה והכנה למבחנים, השראה ומוטיבציה שבועית, ומרחב לכתיבה אישית – חוויות, תובנות, רגעי הצלחה, שאלות ותהיות. המטרה היא לחבר בין ידע קליני, תובנות אישיות וארגון למידה, כדי לחזק מסוגלות, משמעת עצמית והכרה עצמית לאורך הדרך.
              </p>
              <p className={styles.paragraph}>
                לא מספיק לדעת חומר – צריך לדעת איך לחשוב, להרגיש ולפעול כאחות. נוח נותנת לכם את המרחב והכלים לעשות את זה.
              </p>
            </div>
          </div>
        </section>

        {/* What's Inside - Cards Grid */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>מה תמצאו בתוך החוברת</h2>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>טיפים ללמידה יעילה</h3>
                <p className={styles.cardText}>
                  כלים פרקטיים ללמידה אפקטיבית, טכניקות לזכירה וארגון חומר, ודרכים חכמות לתרגול. לא רק "איך ללמוד" אלא "איך ללמוד נכון בשבילכם".
                </p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>הכנה למבחנים</h3>
                <p className={styles.cardText}>
                  דפי עבודה ותהליכים מובנים להכנה למבחנים – ממיפוי החומר ועד תוכנית חזרה. כלים שיעזרו לכם להתכונן בלי להישבר.
                </p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>השראה ומוטיבציה שבועית</h3>
                <p className={styles.cardText}>
                  תוכן מעורר השראה, ציטוטים, סיפורים קצרים ושאלות למחשבה שיעזרו לכם להישאר מחוברים למה שחשוב ולמה שאתם עושים.
                </p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מרחב לרפלקציה וכתיבה אישית</h3>
                <p className={styles.cardText}>
                  דפים לכתיבה חופשית על חוויות מהקליניקה, תובנות מהלימודים, רגעי הצלחה וקשיים. מקום לעיבוד אישי של מה שעובר עליכם.
                </p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>דפי מעקב, מטרות והצלחות</h3>
                <p className={styles.cardText}>
                  כלים למעקב אחר התקדמות, הצבת מטרות ריאליות, ותיעוד הצלחות קטנות וגדולות. כדי שתוכלו לראות את הדרך שעברתם.
                </p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגשים קליניים: שאלות, תובנות וסיפורי מקרה</h3>
                <p className={styles.cardText}>
                  דפים מיוחדים לעיבוד חוויות מהשטח – שאלות מנחות, מקום לתובנות, וכלים לחשיבה קלינית. כדי שתוכלו לגדול מכל מפגש.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Work With It */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>איך עובדים עם החוברת בפועל</h2>
            <div className={styles.contentBox}>
              <p className={styles.paragraph}>
                החוברת נועדה להיות מלווה שלכם לאורך כל התואר, לא משהו שצריך לסיים בבת אחת. אתם יכולים לעבוד איתה לפי הצורך – יומיומי, בתקופת מבחנים, אחרי קליניקה, או כשיש לכם רגע לעצור ולחשוב.
              </p>
              <ul className={styles.bulletList}>
                <li>כתיבה חופשית לצד שאלות מנחות שמכוונות למחשבה</li>
                <li>תרגולים ודפי עבודה שמותאמים לשלבים שונים בתואר</li>
                <li>חזרה לחוברת לאורך הזמן – לא פעם אחת, אלא תהליך מתמשך</li>
                <li>עבודה לפי צורך – אין חובה, יש אפשרות</li>
                <li>שילוב בין למידה, רפלקציה וארגון – הכל במקום אחד</li>
              </ul>
              <p className={styles.paragraph}>
                המטרה היא שהחוברת תהיה המקום שלכם לעצור רגע, לעשות סדר, ולחזור לדרך עם יותר ביטחון וכלים.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>למי החוברת מתאימה</h2>
            <ul className={styles.bulletList}>
              <li>סטודנטים לסיעוד בכל שלבי התואר – מתחילת הדרך ועד סיום</li>
              <li>מי שמחפש דרך מסודרת, פרקטית ומעצימה ללמוד ולהתפתח</li>
              <li>מי שרוצה לגדול לא רק בידע אלא גם בזהות המקצועית</li>
              <li>מי שמבין שצריך כלים מעבר לחומר הלימוד</li>
              <li>מי שמחפש מקום לעיבוד חוויות מהשטח ולחשיבה קלינית</li>
              <li>מי שמוכן להשקיע בתהליך אישי ולקחת אחריות על הדרך שלו</li>
            </ul>
            <p className={styles.softNote}>
              החוברת מתאימה לכל מי שמחפש דרך נוחה ומסודרת להתמודד עם אתגרי התואר ולגדול לאורך הדרך.
            </p>
          </div>
        </section>

        {/* What It's Not */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>מה החוברת לא</h2>
            <div className={styles.contentBox}>
              <ul className={styles.simpleList}>
                <li>לא ספר לימוד – היא לא מחליפה את החומר הנלמד</li>
                <li>לא חוברת תרגול ידע – היא לא רק שאלות ותשובות</li>
                <li>לא טיפול רגשי – היא כלי לעבודה עצמית, לא תחליף לטיפול מקצועי</li>
              </ul>
              <p className={styles.paragraph}>
                החוברת היא תהליך מלווה שמשלב בין למידה, רפלקציה וארגון – כדי לעזור לכם להתמודד עם אתגרי התואר ולגדול לאורך הדרך. היא לא תחליף לחומר הלימוד או לטיפול, אבל היא כן יכולה להיות כלי משמעותי בתהליך שלכם.
              </p>
            </div>
          </div>
        </section>

        {/* Integration Mention */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.contentBox}>
              <p className={styles.paragraph}>
                נוח היא תהליך עצמאי לגמרי, ומי שרוצים יכולים גם לשלב אותה בליווי אישי או בשיעורים פרטיים – לפי צורך. החוברת עובדת מצוין גם לבד וגם כחלק מתהליך רחב יותר.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>שאלות נפוצות</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>זה מתאים גם לתחילת התואר?</h3>
                <p className={styles.faqAnswer}>כן, בהחלט. החוברת מתאימה לכל שלב בתואר – מתחילת הדרך, דרך אמצע התואר, ועד סיום. כל אחד מגיע עם אתגרים שונים, והחוברת נותנת כלים לכל שלב.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>איך עובדים עם החוברת ביום־יום?</h3>
                <p className={styles.faqAnswer}>אין חובה לעבוד עם החוברת כל יום. אפשר לעבוד איתה לפי הצורך – יומיומי, שבועי, בתקופת מבחנים, או אחרי קליניקה. המטרה היא שהיא תהיה שם כשאתם צריכים אותה.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>זה מתאים גם לתקופת מבחנים?</h3>
                <p className={styles.faqAnswer}>כן, בהחלט. החוברת כוללת דפי עבודה ותהליכים מובנים להכנה למבחנים, כלים לניהול זמן ולמידה יעילה, ומקום לעיבוד הלחץ והקושי. היא יכולה להיות מאוד שימושית בתקופות מבחנים.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>האם זה במקום שיעורים פרטיים?</h3>
                <p className={styles.faqAnswer}>לא בדיוק. החוברת מתמקדת בתהליך אישי, רפלקציה וארגון למידה. אם אתם צריכים עזרה ספציפית בחומר או הכנה ממוקדת למבחן, שיעורים פרטיים יכולים להיות משלימים או נפרדים – תלוי בצרכים שלכם.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>איך אדע אם זה מתאים לי?</h3>
                <p className={styles.faqAnswer}>הדרך הכי טובה לדעת היא לשוחח. נדבר קצת על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד אם החוברת יכולה לעזור. אין התחייבות – רק שיחה פתוחה.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>מוכנים להתחיל?</h2>
            <p className={styles.ctaText}>
              אם אתם מרגישים שנוח יכולה להיות המקום שלכם לעצור, לעשות סדר ולהמשיך – בואו נשוחח. נדבר קצת על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד אם החוברת מתאימה לכם. המטרה היא שתצאו עם כלים מנצחים, חיזוק מוטיבציה ומסוגלות, והקלה בדרך שלכם לאורך התואר.
            </p>
            <Link href="/#contact" className={styles.primaryBtn}>
              צור קשר
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
