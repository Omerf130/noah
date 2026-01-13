import Nav from '../components/Nav/Nav'
import Link from 'next/link'
import styles from './page.module.scss'

export default function PrivateLessonsPage() {
  return (
    <>
      <Nav />
      <main className={styles.main} dir="rtl">
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>שיעורים פרטיים בסיעוד</h1>
            <p className={styles.heroSubtitle}>
              שיעורים מובנים בזום, עם הסברים צעד אחר צעד, דוגמאות ותרגול. המטרה היא שתצאו עם בהירות, ביטחון וכלים להמשך למידה עצמאית.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/#contact" className={styles.primaryBtn}>
                לתיאום שיעור פרטי
              </Link>
              <Link href="/#contact" className={styles.secondaryBtn}>
                צור קשר
              </Link>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>אם אתם מרגישים ש…</h2>
            <ul className={styles.bulletList}>
              <li>אתם קוראים ולא מצליחים להבין לעומק</li>
              <li>אתם הולכים לאיבוד בין מושגים וחומר</li>
              <li>קשה לכם לזכור לבד לקראת מבחן</li>
              <li>חסרה לכם שיטה לתרגול</li>
              <li>אתם נלחצים ולא יודעים מאיפה להתחיל</li>
              <li>אתם רוצים הסבר פשוט עם דוגמאות</li>
              <li>אתם מרגישים שאתם ממש מאחור ולא יודעים איך להדביק</li>
            </ul>
            <p className={styles.softLine}>יש מצב ששיעור פרטי יכול לעשות לכם סדר.</p>
          </div>
        </section>

        {/* What the Private Lesson Is */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>מה זה שיעור פרטי</h2>
            <div className={styles.contentBox}>
              <p className={styles.paragraph}>
                השיעורים הפרטיים הם מפגש מובנה בזום של 60 דקות שמטרתו לעזור לכם להבין את החומר לעומק, לתרגל בצורה חכמה, ולבנות שיטת למידה שעובדת בשבילכם. זה לא רק "נעבור על החומר" – זה הסבר צעד אחר צעד עם דוגמאות, תרגול משותף, וכלים להמשך.
              </p>
              <p className={styles.paragraph}>
                השיעורים מתקיימים בזום בלבד כרגע, וכל שיעור נמשך 60 דקות. אפשר לשלוח חומר מראש כדי למקד את השיעור ולנצל את הזמן בצורה מיטבית – זה לא חובה, אבל זה עוזר.
              </p>
              <p className={styles.paragraph}>
                המטרה היא לא רק להבין את החומר, אלא לצאת עם ביטחון, שיטה, וכלים להמשך למידה עצמאית. אחרי כל שיעור יש תרגול להמשך – כי הבנה לבד לא מספיקה, צריך גם תרגול שמחבר את ההבנה לזיכרון.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>איך זה עובד</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>שולחים נושא/חומר מראש (מומלץ)</h3>
                <p className={styles.stepText}>
                  אפשר לשלוח את הנושא, החומר, או השאלות שמעסיקות אתכם. זה עוזר למקד את השיעור ולנצל את הזמן בצורה מיטבית.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>מגיעים לשיעור זום של 60 דקות</h3>
                <p className={styles.stepText}>
                  השיעור מתקיים בזום, בנוחות של הבית שלכם. 60 דקות של עבודה ממוקדת ומותאמת אישית.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>עושים סדר, הסברים ודוגמאות</h3>
                <p className={styles.stepText}>
                  נבין יחד את החומר, נעשה סדר במושגים, נסביר צעד אחר צעד עם דוגמאות שעוזרות לזכור ולהבין.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>4</div>
                <h3 className={styles.stepTitle}>מתרגלים בצורה חכמה</h3>
                <p className={styles.stepText}>
                  לא רק נסביר – גם נתרגל יחד. תרגול שמחבר את ההבנה לזיכרון ועוזר לכם לזכור גם אחרי השיעור.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>5</div>
                <h3 className={styles.stepTitle}>יוצאים עם תרגול להמשך + כיוון ברור</h3>
                <p className={styles.stepText}>
                  כל שיעור מסתיים עם תרגול להמשך – משהו קונקרטי לעבוד איתו, וכיוון ברור להמשך הלמידה.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Get */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>מה תקבלו</h2>
            <div className={styles.valueGrid}>
              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>בהירות וסדר בחומר</h3>
                <p className={styles.valueText}>
                  הסבר מובנה שמבהיר את החומר ומסדר את המושגים בצורה שקל להבין ולזכור.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>דוגמאות שעוזרות לזכור</h3>
                <p className={styles.valueText}>
                  לא רק הסבר תיאורטי – דוגמאות קונקרטיות שמחברות את החומר למציאות ועוזרות לזכור.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>תרגול שמחבר הבנה לזיכרון</h3>
                <p className={styles.valueText}>
                  תרגול משותף בשיעור ותרגול להמשך – כדי שההבנה תישאר גם אחרי השיעור.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>התאמה אישית לקצב שלכם</h3>
                <p className={styles.valueText}>
                  כל שיעור מותאם לקצב שלכם, לאופן הלמידה שלכם, ולמקום שבו אתם נמצאים.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>חיזוק ביטחון + משמעת לתרגול</h3>
                <p className={styles.valueText}>
                  המטרה היא לא רק להבין, אלא גם לחזק ביטחון עצמי ולבנות משמעת לתרגול עצמאי.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>זמינות לשאלות והתייעצות</h3>
                <p className={styles.valueText}>
                  אפשר לשלוח שאלות והתייעצויות בין השיעורים – לא 24/7, אבל יש זמינות לתמיכה.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Covered */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>נושאים ומקצועות</h2>
            <div className={styles.topicsGrid}>
              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>יסודות ועקרונות</h3>
                <ul className={styles.topicList}>
                  <li>יסודות הסיעוד</li>
                  <li>עקרונות הסיעוד</li>
                </ul>
              </div>

              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>מקצועות בסיס</h3>
                <ul className={styles.topicList}>
                  <li>כימיה</li>
                  <li>אנטומיה</li>
                  <li>גנטיקה</li>
                  <li>תזונה</li>
                </ul>
              </div>

              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>סיעוד המבוגר</h3>
                <ul className={styles.topicList}>
                  <li>סיעוד פנימי</li>
                  <li>סיעוד כירורגי</li>
                </ul>
              </div>

              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>סיעוד מיוחד</h3>
                <ul className={styles.topicList}>
                  <li>סיעוד האישה</li>
                  <li>סיעוד הילד</li>
                </ul>
              </div>

              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>תחומים נוספים</h3>
                <ul className={styles.topicList}>
                  <li>בריאות הנפש</li>
                  <li>גריאטריה</li>
                </ul>
              </div>

              <div className={styles.topicGroup}>
                <h3 className={styles.topicGroupTitle}>ועוד</h3>
                <ul className={styles.topicList}>
                  <li>לפי הצורך</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>למי זה מתאים</h2>
            <div className={styles.contentBox}>
              <p className={styles.paragraph}>
                השיעורים הפרטיים מתאימים לסטודנטים שמחפשים הבנה ברורה, מובנית וצעד אחר צעד. למי שרוצה להבין לעומק ולא רק "לעבור על החומר". למי שמוכן לתרגל גם אחרי השיעור ולבנות שיטת למידה שעובדת.
              </p>
              <p className={styles.paragraph}>
                השיעורים מתאימים למי שמרגישים שהם מאחור ורוצים להדביק, למי שמתכוננים למבחן ספציפי, למי שמתקשים בנושא מסוים, ולמי שרוצים לחזק את הבסיס שלהם.
              </p>
              <p className={styles.softNote}>
                השיעורים פחות מתאימים למי שמחפשים פתרון קסם בלי תרגול, או למי שלא מוכנים להשקיע גם מעבר לשיעור. זה בסדר – לא כל דבר מתאים לכולם.
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
                <h3 className={styles.faqQuestion}>זה מתאים גם אם אני מרגיש/ה שאני ממש מאחור?</h3>
                <p className={styles.faqAnswer}>כן, בהחלט. השיעורים מתאימים גם למי שמרגישים שהם מאחור ורוצים להדביק. נבנה יחד תוכנית שמתאימה למקום שבו אתם נמצאים ונלך צעד אחר צעד.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>מה צריך להכין לפני השיעור?</h3>
                <p className={styles.faqAnswer}>מומלץ לשלוח מראש את הנושא או החומר שמעסיק אתכם – זה עוזר למקד את השיעור. אם יש לכם שאלות ספציפיות או מקומות שמתקשים בהם, אפשר לשלוח גם את זה. זה לא חובה, אבל זה עוזר לנצל את הזמן בצורה מיטבית.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>אפשר להתמקד במבחן ספציפי?</h3>
                <p className={styles.faqAnswer}>כן, בהחלט. אפשר להתמקד במבחן ספציפי, בנושא מסוים, או בחומר מסוים. נדבר מראש על מה אתם צריכים ונתאים את השיעור לזה.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>איך נראה התרגול אחרי השיעור?</h3>
                <p className={styles.faqAnswer}>אחרי כל שיעור תקבלו תרגול קונקרטי להמשך – שאלות, תרגילים, או משימות שמותאמות למה שעברנו בשיעור. המטרה היא שההבנה תישאר גם אחרי השיעור.</p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>זה בזום בלבד?</h3>
                <p className={styles.faqAnswer}>כן, כרגע השיעורים מתקיימים בזום בלבד. זה נותן גמישות ונוחות, ומאפשר עבודה ממוקדת גם מרחוק.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>מוכנים להתחיל?</h2>
            <p className={styles.ctaText}>
              אם אתם מרגישים ששיעור פרטי יכול לעשות לכם סדר, לתת לכם בהירות, ולעזור לכם לבנות שיטת למידה שעובדת – בואו נשוחח. נדבר קצת על האתגרים שלכם, על מה אתם מחפשים, ונראה יחד אם השיעורים הפרטיים מתאימים לכם. המטרה היא שתצאו עם יותר שלווה לקראת מבחנים, יותר שליטה והבנה, וידע איך לתרגל ולהמשיך לבד.
            </p>
            <Link href="/#contact" className={styles.primaryBtn}>
              לתיאום שיעור פרטי
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
