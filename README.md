# חרוט חדש

## מקור הסמכות היחיד

כל הדרישות המחייבות של הפרויקט נמצאות **רק** בקובץ [`SOURCE_OF_TRUTH.md`](SOURCE_OF_TRUTH.md).

הקובץ הזה (`README.md`) הוא דף ניווט בלבד. הוא אינו מגדיר דרישות, אינו מפרש דרישות ואינו רשאי להחליף או להשלים את מקור האמת.

כל קובץ אחר בריפו — קוד, תוכן, QA, מעקב, Traceability, תוכניות ביצוע או מסמכי עזר — חייב להיגזר מ־`SOURCE_OF_TRUTH.md` ואינו מקור סמכות עצמאי.

## ניווט

- [`SOURCE_OF_TRUTH.md`](SOURCE_OF_TRUTH.md) — מקור הדרישות היחיד.
- [`CLAUDE.md`](CLAUDE.md) — הוראות תפעול ל־Claude Code בלבד.
- [`STUDENT_PROGRESS.json`](STUDENT_PROGRESS.json) — מצב ביצוע נגזר בלבד.
- [`STUDENT_REQUIREMENT_TRACEABILITY.md`](STUDENT_REQUIREMENT_TRACEABILITY.md) — מפת ראיות בלבד.
- [`curriculum-cone-inventory.json`](curriculum-cone-inventory.json) — מלאי מקור רשמי נגזר בלבד.

## כניסה לעבודה

לפני כל שינוי:

1. לקרוא את `SOURCE_OF_TRUTH.md` במלואו.
2. לבצע את השינוי רק בהתאם אליו.
3. להריץ QA.
4. אם יש סתירה — לעדכן קודם את מקור האמת רק בעקבות הוראה מפורשת של יניב.

## QA

```bash
npm run qa
npm run qa:browser
```

`npm run qa` כולל גם בדיקת `ssot-qa.mjs`, שמטרתה למנוע יצירת מקור אמת מתחרה.
