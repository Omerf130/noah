import "./PrivateLessons.scss";

const PrivateLessons = () => {
  return (
    <section className="lessons-wrapper" id="lessons">
      <div className="lessons-container">
        <h1 className="lessons-header">שיעורים פרטיים בסיעוד</h1>

        <p className="lessons-content">
          השיעורים הפרטיים מיועדים לסטודנטים שזקוקים לעזרה ממוקדת לקראת מבחן,
          הבנת נושא מסוים או חיזוק חשיבה קלינית.
          <br /> במהלך השיעור: 
          <br />✨ נחדד מושגים בצורה ברורה
          <br />✨ נתרגל יחד – ולא רק “נעבור על החומר”
          <br />✨ נתאים את ההסבר לאופן הלמידה שלך
          <br />
          <br />
          המטרה היא לא רק להבין את החומר, אלא לצאת עם ביטחון וכלים להמשך
          למידה עצמאית.
        </p>

        <button className="lessons-btn">לתיאום שיעור פרטי</button>
      </div>
    </section>
  );
};

export default PrivateLessons;
