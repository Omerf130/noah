import "./About.scss";
import img1 from "../../../../public/pics/logo.jpeg";

const About = () => {
  return (
    <section className="about-wrapper" id="about">
      <div className="about-container">
        <div className="about-content">
          <h2>נעים להכיר</h2>
          <p>
            אני נועה, אחות מוסמכת ומלווה סטודנטים לסיעוד.
            במהלך הלימודים והעבודה פגשתי הרבה סטודנטים חכמים, רציניים ומוכשרים שנתקלים בעומס, חוסר סדר, קושי בהתמדה וחוסר ביטחון.
            מתוך החוויה האישית והמקצועית שלי בניתי כלים, תהליכים ומסגרות שנועדו לעזור לסטודנטים להחזיק את הדרך:
            לבנות שגרה אפשרית, לתרגל בצורה חכמה, ולהרגיש שיש מי שמבין את האתגרים מבפנים.
            הגישה שלי משלבת ליווי אנושי עם עבודה פרקטית בלי לחץ מיותר וחיזוק תחושת מסוגלות עצמית.
          </p>
          <button className="about-btn">לשיחת היכרות</button>
        </div>

        <div className="about-image">
          <img src={img1} alt="about" />
        </div>
      </div>
    </section>
  );
};

export default About;
