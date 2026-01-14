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
                        אני נועה, אחות מוסמכת בוגרת תואר ראשון בסיעוד וסטודנטית לתואר שני במנהל מערכות בריאות.
                    </p>
                    <p>
                        לאורך לימודי הסיעוד הבנתי דבר אחד חשוב: לא מספיק רק לדעת את החומר.
                        הקושי האמיתי הוא להחזיק שגרה, להתמיד ולמצוא ביטחון בתוך עומס שלא נגמר.
                    </p>
                    <p>
                        הרבה סטודנטים חכמים ומוכשרים נתקלים בקושי לא בגלל חוסר יכולת, אלא בגלל שאין מי שיעזור להם לעשות סדר, לבנות דרך שמתאימה להם ולהמשיך גם כשקשה.
                    </p>
                    <p>
                        מתוך המקום הזה נולדה ״נוח״. גישה שמחברת בין ידע קליני, תרגול, ארגון למידה והקשבה למה שקורה בדרך – כדי שלא תצטרכו לעבור את התואר לבד.
                    </p>
                    <p>
                        היום אני מלווה סטודנטים לסיעוד דרך ליווי אישי, שיעורים פרטיים וחוברת ״המלווה הקליני״ במטרה לעזור לכם ללמוד בצורה יציבה, להתמיד לאורך זמן ולהרגיש יותר בטוחים בדרך שלכם כאנשי מקצוע.
                    </p>
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

