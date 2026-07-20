export const coursesCatalog = [
  {
    slug: 'pharmaceutical-calculations',
    path: '/courses/pharmaceutical-calculations',
    title: 'חישוב רוקחי',
    shortDescription: 'קורס דיגיטלי מקיף לחישוב רוקחי — בקרוב.',
    status: 'coming-soon' as const,
    contactService: 'pharmaceutical-calculations' as const,
    seo: {
      title: 'קורס חישוב רוקחי',
      description: 'קורס דיגיטלי לחישוב רוקחי לסטודנטים לסיעוד — בקרוב.',
    },
  },
]

export const pharmaceuticalCalculationsCourse = {
  slug: 'pharmaceutical-calculations',
  path: '/courses/pharmaceutical-calculations',
  status: 'coming-soon' as const,
  contactService: 'pharmaceutical-calculations' as const,
  hero: {
    eyebrow: 'קורס דיגיטלי · בקרוב',
    title: 'חישוב רוקחי לסטודנטים לסיעוד',
    subtitle: 'קורס מובנה שיעזור לכם לבנות ביטחון בחישובים — בקצב שלכם, עם תרגול מעשי.',
  },
  shortDescription:
    'קורס דיגיטלי שמלמד חישוב רוקחי בצורה מסודרת, ברורה ומותאמת לסטודנטים לסיעוד.',
  audience: [
    'סטודנטים שמתקשים בחישוב רוקחי',
    'מי שרוצה לבנות בסיס יציב לפני מבחנים',
    'מי שמחפש תרגול מובנה ולא רק הסבר חד-פעמי',
  ],
  deliverables: [
    'שיעורים מסודרים לפי נושאים',
    'דוגמאות ותרגול מודרך',
    'גישה לחומרים לפי התקדמות הקורס',
    'קשר לערכת תרגול משלימה',
  ],
  syllabus: [
    'יחידות מידה והמרות',
    'חישובי מינון בסיסיים',
    'זרימות (drip rate) וחישובי IV',
    'תרגול מבחנים וטעויות נפוצות',
  ],
  syllabusVideoUrl: null as string | null,
  relatedProductPath: '/products/practice-kit',
  faq: [
    {
      question: 'מתי הקורס יהיה זמין?',
      answer: 'הקורס מסומן כ"בקרוב". אפשר להשאיר פרטים ונעדכן כשההשקה תקרב.',
    },
    {
      question: 'האם יש מחיר?',
      answer: 'כרגע לא מוצג מחיר. ניתן לפנות אלינו לקבלת עדכון.',
    },
    {
      question: 'האם הקורס מתאים גם לתחילת התואר?',
      answer: 'כן. הקורס מתאים לכל שלב שבו נדרש חישוב רוקחי.',
    },
  ],
  seo: {
    title: 'קורס חישוב רוקחי',
    description: 'קורס דיגיטלי לחישוב רוקחי לסטודנטים לסיעוד — בקרוב.',
  },
}
