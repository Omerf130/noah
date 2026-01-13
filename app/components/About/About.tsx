import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.scss";

const About = () => {
    return (
        <section className={styles.aboutWrapper} id="about">
            <div className={styles.aboutContainer}>
                <div className={styles.aboutContent}>
                    <h2>נעים להכיר</h2>
                    <p>
                        אני נועה, אחות מוסמכת ומלווה סטודנטים לסיעוד.
                        במהלך הלימודים והעבודה פגשתי הרבה סטודנטים חכמים, רציניים ומוכשרים שנתקלים בעומס, חוסר סדר, קושי בהתמדה וחוסר ביטחון.
                        מתוך החוויה האישית והמקצועית שלי בניתי כלים, תהליכים ומסגרות שנועדו לעזור לסטודנטים להחזיק את הדרך:
                        לבנות שגרה אפשרית, לתרגל בצורה חכמה, ולהרגיש שיש מי שמבין את האתגרים מבפנים.
                        הגישה שלי משלבת ליווי אנושי עם עבודה פרקטית בלי לחץ מיותר וחיזוק תחושת מסוגלות עצמית.
                    </p>
                    <Link href="#contact" className={styles.aboutBtn}>
                        לשיחת היכרות
                    </Link>
                </div>

                <div className={styles.aboutImage}>
                    <Image
                        src="/pics/logo.jpeg"
                        alt="about"
                        width={280}
                        height={280}
                        style={{ borderRadius: '50%', border: '6px solid #500889' }}
                    />
                </div>
            </div>
        </section>
    );
};

export default About;

