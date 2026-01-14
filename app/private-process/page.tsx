import Nav from '../components/Nav/Nav'
import Link from 'next/link'
import styles from './page.module.scss'

export default function PrivateProcessPage() {
  return (
    <>
      <Nav />
      <main className={styles.main} dir="rtl">
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>ליווי אישי לסטודנטים לסיעוד</h1>
            <p className={styles.heroSubtitle}>
              תהליך מובנה של 6 מפגשים שמטרתו לעזור לכם לבנות שגרה, לפתח משמעת עצמית ולחזק ביטחון – לא רק בחומר, אלא בדרך שלכם.
            </p>
            <Link href="/#contact" className={styles.primaryBtn}>
              לבירור התאמה
            </Link>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>אם אתם מרגישים ש…</h2>
            <ul className={styles.bulletList}>
              <li>אתם מבינים את החומר אבל מתקשים לשמור על שגרה לימודית</li>
              <li>יש לכם עומס גדול וקשה לכם לנהל את הזמן בצורה יעילה</li>
              <li>דחיינות וקושי בהתמדה מלווים אתכם לאורך התואר</li>
              <li>יש לכם ירידות מוטיבציה וקשה לכם להחזיק תרגול רציף</li>
              <li>אתם מרגישים לבד עם האתגרים ולא יודעים איך להתמודד</li>
              <li>יש לכם לחץ גדול לקראת מבחנים או יציאה לשטח</li>
            </ul>
            <p className={styles.softLine}>יכול להיות שהמקום הזה בשבילכם.</p>
          </div>
        </section>

        {/* What It Is / What It's Not */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>אז מה זה בעצם ליווי אישי</h2>
            <p className={styles.sectionSubtitle}>כדי לדעת אם זה מתאים לכם חשוב להבין מה זה כולל וגם מה לא.</p>
            <div className={styles.twoCardsGrid}>
              <div className={styles.yesNoCard}>
                <h3 className={styles.yesNoCardTitle}>מה הליווי האישי כן כולל</h3>
                <ul className={styles.yesNoList}>
                  <li>✨ תהליך מובנה שמלווה אותכם לאורך תקופה</li>
                  <li>✨ עבודה על שגרה, התמדה ותרגול</li>
                  <li>✨ כלים ללמידה ולהתמודדות עם עומס</li>
                  <li>✨ ליווי אנושי ותומך בתוך התהליך</li>
                </ul>
              </div>
              <div className={styles.yesNoCard}>
                <h3 className={styles.yesNoCardTitle}>מה הליווי האישי לא</h3>
                <ul className={styles.yesNoList}>
                  <li>✨ זה לא טיפול רגשי</li>
                  <li>✨ זה לא שיעור פרטי קלאסי</li>
                  <li>✨ זה לא פתרון קסם או תהליך מיידי</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Goal of Process */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>לאן התהליך מכוון</h2>
            <div className={styles.goalCardsGrid}>
              <div className={styles.goalCard}>
                <div className={styles.goalCardIcon}>📅</div>
                <h3 className={styles.goalCardTitle}>שגרה</h3>
                <p className={styles.goalCardText}>
                  בניית שגרה לא מושלמת אלא כזו שמתאימה לחיים שלכם באמת
                </p>
              </div>
              <div className={styles.goalCard}>
                <div className={styles.goalCardIcon}>📚</div>
                <h3 className={styles.goalCardTitle}>תרגול</h3>
                <p className={styles.goalCardText}>
                  יכולת לתרגל ולהתקדם לאורך זמן גם כשאין מוטיבציה גבוהה
                </p>
              </div>
              <div className={styles.goalCard}>
                <div className={styles.goalCardIcon}>💪</div>
                <h3 className={styles.goalCardTitle}>ביטחון</h3>
                <p className={styles.goalCardText}>
                  לדעת לעצור, לדייק ולהמשיך בלי להילחץ מכל שלב.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>למי זה מתאים</h2>
            <ul className={styles.bulletList}>
              <li>סטודנטים שמבינים את החומר אבל מתקשים בשגרה והתמדה</li>
              <li>מי שמחפש מסגרת תומכת וברורה ללא לחץ מיותר</li>
              <li>מי שמוכן להשקיע בתהליך ולקחת אחריות על הדרך שלו</li>
              <li>מי שמבין שזה תהליך ולא פתרון מהיר</li>
              <li>מי שמחפש כלים פרקטיים ולא רק מוטיבציה</li>
              <li>מי שמוכן לעבוד גם בין המפגשים</li>
            </ul>
            <p className={styles.softNote}>
              הליווי פחות מתאים למי שמחפש פתרון מיידי או למי שלא מוכן להשקיע בתהליך. זה בסדר – לא כל דבר מתאים לכולם.
            </p>
          </div>
        </section>

        {/* 6 Sessions */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>איך נראה התהליך בפועל</h2>
            <p className={styles.introParagraph}>
              כל מפגש נמשך כשעה וחצי, מתקיים פעם בשבוע, ומשלב ליווי אישי עם כלי פרקטי לשבוע הקרוב. המטרה היא שתצאו מכל מפגש עם משהו קונקרטי לעבוד איתו.
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 1: מיפוי + מטרות + נקודת פתיחה</h3>
                <p className={styles.cardText}>
                  נבין יחד איפה אתם עומדים, מה האתגרים העיקריים, ומה המטרות שלכם לתהליך. נגדיר יחד נקודת פתיחה ברורה כדי שנוכל למדוד התקדמות.
                </p>
                <p className={styles.cardOutcome}>יוצאים עם: הבנה ברורה של המצב הנוכחי ומטרות מוגדרות</p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 2: בניית שגרה ולו״ז ריאלי</h3>
                <p className={styles.cardText}>
                  נבנה יחד שגרה לימודית שמתאימה לחיים שלכם – לא אידיאלית, אלא ריאלית. נלמד איך לבנות לו״ז שמחזיק לאורך זמן ולא קורס אחרי שבוע.
                </p>
                <p className={styles.cardOutcome}>יוצאים עם: שגרה מותאמת אישית וכלים לניהול זמן</p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 3: משמעת עצמית + התמדה + עבודה עם דחיינות</h3>
                <p className={styles.cardText}>
                  נעמיק בכלים לבניית משמעת עצמית דרך תרגול רציף. נלמד איך להתמודד עם דחיינות, איך לחזור אחרי נפילות, ואיך לשמור על התמדה גם כשלא בא לכם.
                </p>
                <p className={styles.cardOutcome}>מקבלים כלים ל: התמודדות עם דחיינות ובניית התמדה</p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 4: למידה יעילה + תרגול חכם + הכנה למבחנים</h3>
                <p className={styles.cardText}>
                  נעסוק בטכניקות למידה יעילות, איך לתרגל בצורה חכמה (ולא רק "לעבור על החומר"), ואיך להתכונן למבחנים בלי להישבר. נדבר גם על יציאה לשטח והתמודדות עם לחץ.
                </p>
                <p className={styles.cardOutcome}>יוצאים עם: כלים ללמידה יעילה והכנה אפקטיבית</p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 5: ביטחון עצמי + התמודדות עם עומס/שבירה + חיזוק מוטיבציה</h3>
                <p className={styles.cardText}>
                  נעסוק בחיזוק ביטחון עצמי ומסוגלות – לא רק בלמידה, אלא גם בשטח. נלמד איך להתמודד עם עומס גדול, איך לזהות סימני שבירה, ואיך לחזק מוטיבציה כשקשה.
                </p>
                <p className={styles.cardOutcome}>מקבלים כלים ל: חיזוק ביטחון והתמודדות עם עומס</p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>מפגש 6: סיכום + תוכנית המשך + איך ממשיכים לבד לאורך התואר</h3>
                <p className={styles.cardText}>
                  נסכם יחד את מה שעברנו, נזהה את הכלים שהכי עבדו לכם, ונבנה תוכנית המשך שתחזיק אתכם לאורך התואר. המטרה היא שתצאו עם ביטחון שאתם יכולים להמשיך לבד.
                </p>
                <p className={styles.cardOutcome}>יוצאים עם: תוכנית המשך אישית וביטחון להמשך הדרך</p>
              </div>
            </div>
            <p className={styles.betweenSessionsNote}>
              בין המפגשים יש מקום ליישום ותרגול עצמאי עם זמינות לשאלות והתייעצות לפי הצורך.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>שאלות נפוצות</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>זה מתאים גם אם אני בתחילת התואר?</h3>
                <p className={styles.faqAnswer}>כן, בהחלט. הליווי מתאים גם לסטודנטים בתחילת הדרך וגם למי שכבר באמצע או בסוף התואר. כל אחד מגיע עם אתגרים שונים, והתהליך מותאם למקום שבו אתם נמצאים.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>זה במקום שיעורים פרטיים?</h3>
                <p className={styles.faqAnswer}>לא בדיוק. הליווי האישי מתמקד בכלים, שגרה ומשמעת עצמית. אם אתם צריכים עזרה ספציפית בחומר או הכנה למבחן, שיעורים פרטיים יכולים להיות משלימים או נפרדים – תלוי בצרכים שלכם.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>כמה זמן נמשך כל מפגש?</h3>
                <p className={styles.faqAnswer}>כל מפגש נמשך כשעה וחצי. זה נותן זמן מספיק לעבוד יחד, להבין לעומק, ולצאת עם כלי פרקטי לשבוע הקרוב.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>מה אם אני עמוס/ה ולא מצליח/ה לעמוד בלו״ז?</h3>
                <p className={styles.faqAnswer}>זה חלק מהתהליך. אם יש שבוע שבו קשה לעמוד בלו״ז, נדבר על זה ונמצא פתרון יחד. המטרה היא לא להיות מושלמים, אלא ללמוד איך להתמודד גם כשקשה.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>איך יודעים אם זה מתאים לי?</h3>
                <p className={styles.faqAnswer}>הדרך הכי טובה לדעת היא לשוחח. נדבר קצת על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד אם הליווי יכול לעזור. אין התחייבות – רק שיחה פתוחה.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>מוכנים להתחיל?</h2>
            <p className={styles.ctaText}>
              אם אתם מרגישים שהליווי הזה יכול לעזור לכם, בואו נשוחח. נדבר קצת על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד אם זה המקום הנכון בשבילכם.
            </p>
            <Link href="/#contact" className={styles.primaryBtn}>
              לבירור התאמה
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
