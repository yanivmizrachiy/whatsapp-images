# Validated student-page exports

> תוצרי יצוא/ראיית QA בלבד — לא מקור תוכן ולא מקור דרישות. הדרישות: `SOURCE_OF_TRUTH.md`.

התיקייה נכתבת אוטומטית ע״י `.github/workflows/qa.yml` לאחר QA ירוק על `main` (commit `[skip ci]`).

- `cone-student.pdf` — דף השער ואחריו כל דפי התלמיד, גיליון A4 אחד לכל דף (SSOT §20.5, §28.4; מספר הדפים לפי §2.4).
- `cover.png` — צילום דף השער.
- `page-01.png` ואילך — צילום PNG של כל דף תלמיד בנפרד.
- `GENERATED_FROM.txt` — ה-commit וריצת ה-workflow שמהם נוצר ה-snapshot.

הקבצים בתיקייה זו הם **תוצרי יצוא/ראיית QA**, לא מקור התוכן לעריכה. מקור העריכה הקנוני נשאר:

- `content.js`
- `app.js`
- `styles.css`
- `index.html`
- `SOURCE_OF_TRUTH.md`

לתצוגה מקומית מריצים `npm start` ומציגים את האפליקציה מן המקור. אין לבנות מחדש את הדפים מתוך PNG/PDF.

עמודי מורה אינם חלק מהשלב הנוכחי ואין ליצור אותם בלי הוראה מפורשת חדשה של יניב.
