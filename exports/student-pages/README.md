# Validated student-page exports

התיקייה הזאת מכילה snapshot מאומת של 8 דפי התלמיד כפי שנוצרו ב-GitHub Actions לאחר מעבר QA.

- `cone-student.pdf` — PDF בן 8 עמודי A4.
- `page-01.png` … `page-08.png` — צילום PNG של כל דף בנפרד.
- `GENERATED_FROM.txt` — ה-commit וריצת ה-workflow שמהם נוצר ה-snapshot.

הקבצים בתיקייה זו הם **תוצרי יצוא/ראיית QA**, לא מקור התוכן לעריכה. מקור העריכה הקנוני נשאר:

- `content.js`
- `app.js`
- `styles.css`
- `index.html`
- `SOURCE_OF_TRUTH.md`

ב-Google AI Studio יש להריץ `npm start` ולהציג את האפליקציה מן המקור. אין לבנות מחדש את הדפים מתוך PNG/PDF.

עמודי מורה אינם חלק מהשלב הנוכחי ואין ליצור אותם בלי הוראה מפורשת חדשה של יניב.
