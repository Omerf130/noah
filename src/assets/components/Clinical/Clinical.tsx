import "./Clinical.scss";
import img1 from "../../../../public/pics/clinical.jpeg";

const Clinical = () => {
  return (
    <section className="clinical-wrapper" id="clinical">
      <div className="clinical-container">

        <div className="clinical-image">
          <img src={img1} alt="clinical guide" />
        </div>

        <div className="clinical-content">
          <h1 className="clinical-title">
            המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד
          </h1>

          <p className="clinical-text">
            המלווה הקליני היא חוברת עבודה אישית שנועדה ללוות אתכם לאורך הדרך – בקצב שלכם.
            <br /> החוברת משלבת:
            <br />✨ רפלקציה ועיבוד חוויות
            <br />✨ הצבת מטרות ומעקב אחר התקדמות
            <br />✨ כלים ללמידה, יציאה לשטח ולתקופות מבחנים
            <br />✨ חיזוק פנימי ובניית זהות מקצועית
            <br /><br />
            זהו תהליך עצמאי, שלא מחייב ליווי אישי ומתאים לסטודנטים שרוצים לעצור רגע,
            לעשות סדר ולחזק את עצמם תוך כדי התואר.
          </p>

          <button className="clinical-btn">לקריאה על החוברת</button>
        </div>

      </div>
    </section>
  );
};

export default Clinical;
