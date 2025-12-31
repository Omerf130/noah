import "./Contact.scss";

const Contact = () => {
  return (
    <section className="contact-wrapper" id="contact">
      <div className="contact-container">
        <h1 className="contact-title">צרו קשר</h1>
        <p className="contact-sub">
          מלאו את הפרטים ונחזור אליכם בהקדם
        </p>

        <form className="contact-form">
          <div className="form-group">
            <label>שם פרטי</label>
            <input type="text" placeholder="הכניסו שם..." />
          </div>

          <div className="form-group">
            <label>טלפון</label>
            <input type="tel" placeholder="הכניסו מספר טלפון..." />
          </div>

          <div className="form-group">
            <label>מייל</label>
            <input type="email" placeholder="הכניסו כתובת מייל..." />
          </div>

          <div className="form-group">
            <label>בחירת שירות</label>
            <select>
              <option>שיעורים פרטיים</option>
              <option>ליווי אישי</option>
              <option>מידע על החוברת</option>
            </select>
          </div>

          <div className="form-group full">
            <label>טקסט חופשי</label>
            <textarea placeholder="כתבו לי ואחזור אליכם בהקדם :)"></textarea>
          </div>

          <button className="contact-btn">שליחה</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
