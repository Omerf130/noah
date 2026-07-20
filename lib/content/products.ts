export const productsCatalog = [
  {
    slug: 'booklet',
    path: '/products/booklet',
    title: 'המלווה הקליני',
    subtitle: 'חוברת תהליכים לכל התואר',
    shortDescription: 'חוברת שמלווה אתכם לאורך כל התואר - רפלקציה, ארגון למידה וכלים מעשיים.',
    status: 'available' as const,
    contactService: 'booklet' as const,
    image: { src: '/pics/noabook.jpeg', alt: 'כריכת המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד' },
    seo: {
      title: 'המלווה הקליני — חוברת תהליכים',
      description: 'חוברת תהליכים אישית לסטודנטים לסיעוד — רפלקציה, ארגון למידה וכלים לכל שלבי התואר.',
    },
  },
  {
    slug: 'practice-kit',
    path: '/products/practice-kit',
    title: 'ערכת תרגול',
    subtitle: 'תרגול משלים לקורס החישובים',
    shortDescription: 'ערכת תרגול שמשלימה את הקורס ומאפשרת תרגול עצמאי מסודר.',
    status: 'available' as const,
    contactService: 'practice-kit' as const,
    seo: {
      title: 'ערכת תרגול',
      description: 'ערכת תרגול משלימה לקורס חישוב רוקחי — פנו לפרטים.',
    },
  },
]

export const bookletProduct = {
  slug: 'booklet',
  path: '/products/booklet',
  contactService: 'booklet' as const,
  hero: {
    eyebrow: 'מוצר לימוד',
    title: 'חוברת שמלווה אתכם לאורך כל התואר',
    subtitle: 'תהליך עצמאי שמשלב רפלקציה, ארגון למידה וכלים לכל שלבי הסיעוד — בקצב שלכם.',
  },
  image: { src: '/pics/noabook.jpeg', alt: 'כריכת המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד' },
  secondaryImage: {
    src: '/pics/noaclinic.jpeg',
    alt: 'המלווה הקליני — תצוגת החוברת',
  },
  features: [
    { title: 'טיפים ללמידה יעילה', text: 'כלים פרקטיים ללמידה, זכירה וארגון חומר.' },
    { title: 'הכנה למבחנים', text: 'דפי עבודה ותהליכים מובנים להכנה בלי להישבר.' },
    { title: 'רפלקציה אישית', text: 'מרחב לעיבוד חוויות מהקליניקה ומהלימודים.' },
    { title: 'מעקב והתקדמות', text: 'כלים למטרות, הצלחות קטנות, ומסלול ברור.' },
    { title: 'השראה שבועית', text: 'תוכן שמחזק מוטיבציה וחיבור למקצוע.' },
    { title: 'חשיבה קלינית', text: 'שאלות ותובנות ממפגשים בשטח.' },
  ],
  audience:
    'לסטודנטים בכל שלבי התואר שרוצים דרך מסודרת לעצור, לעשות סדר, ולגדול גם בזהות המקצועית — לא רק בידע.',
  note: 'החוברת עובדת מצוין לבד, ואפשר גם לשלב עם ליווי או שיעורים פרטיים.',
  seo: {
    title: 'המלווה הקליני — חוברת תהליכים',
    description: 'חוברת תהליכים אישית לסטודנטים לסיעוד — רפלקציה, ארגון למידה וכלים לכל שלבי התואר.',
  },
}

export const practiceKitProduct = {
  slug: 'practice-kit',
  path: '/products/practice-kit',
  contactService: 'practice-kit' as const,
  hero: {
    eyebrow: 'מוצר לימוד',
    title: 'ערכת תרגול לחישוב רוקחי',
    subtitle: 'תרגול מסודר שמשלים את הקורס ועוזר לבנות ביטחון לפני מבחנים.',
  },
  features: [
    { title: 'תרגול מובנה', text: 'תרגילים ודוגמאות לפי נושאים מרכזיים.' },
    { title: 'העמקה עצמאית', text: 'מתאים לתרגול בקצב שלכם, מחוץ לשיעור.' },
    { title: 'משלים את הקורס', text: 'עובד יחד עם קורס החישוב הרוקחי.' },
  ],
  audience:
    'לסטודנטים שרוצים לחזק את החישובים בין שיעורים, לפני מבחנים, או לצד הקורס הדיגיטלי.',
  relatedCoursePath: '/courses/pharmaceutical-calculations',
  seo: {
    title: 'ערכת תרגול',
    description: 'ערכת תרגול משלימה לקורס חישוב רוקחי — פנו לפרטים.',
  },
}
