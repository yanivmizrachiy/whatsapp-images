# מצב עבודה מקביל מקסימלי — ChatGPT + Google AI Studio

> מסמך ביצוע/תיאום בלבד. `SOURCE_OF_TRUTH.md` נשאר מקור הסמכות היחיד. אין במסמך זה היתר לשנות דרישה מהותית. עמודי מורה אסורים עד הוראה מפורשת חדשה של יניב.

## פקודת־על

המטרה היא לסיים את **כל דרישות דפי התלמיד** במהירות המרבית האפשרית, תוך עבודה מקבילית של Google AI Studio ו-ChatGPT, אבל ללא דריסה, merge שקט, כפילות או אובדן עבודה. מהירות אינה גוברת על נכונות: כל שינוי חייב להיות ניתן לאימות, וכל 100% חייב להיות מוכח.

## שלב 0 — חובה מיידית לפני כל עבודה חדשה של AI Studio

ל-Google AI Studio כבר קיימת סביבת עבודה מקומית המדווחת על 100% ועל PASS של QA. לפני pull, refresh, re-import או שינוי חדש:

1. **לא לאבד את העבודה המקומית הקיימת.**
2. לשמור/commit/push את כל השינויים המקומיים הקיימים לריפו `yanivmizrachiy/whatsapp-images`.
3. אם המערכת מאפשרת בחירת branch בצורה אמינה — עדיפות ל-branch ייעודי `ai-studio/student-fastlane` ואז merge רק לאחר QA. אם סביבת AI Studio מחוברת ישירות ל-`main` ואינה תומכת branch בצורה אמינה, מותר push ל-`main` רק לאחר pull/merge בטוח וללא דריסת שינויים חדשים.
4. לאחר push, לאמת מול ה-remote שה-commit אכן קיים ולהחזיר את SHA המדויק.
5. רק לאחר שה-checkpoint המרוחק קיים — להמשיך למסלול המקביל שלמטה.

**אסור לבצע reset/re-import שיכול למחוק את העבודה המקומית לפני checkpoint מרוחק.**

---

# חלוקת עבודה מקבילית

## מסלול A — Google AI Studio: מימוש מהיר ותיקוני מוצר

AI Studio הוא בעלים ראשי של עבודת המימוש שכבר ביצע מקומית ושל סגירת פערי מוצר/קוד שנובעים ממנה. לאחר checkpoint מרוחק עליו:

### A1 — לאמת את ה-100% שהוא טוען לו
- לעבור שוב על `AI_STUDIO_STUDENT_EXECUTION.md` סעיף-סעיף P01–P14.
- לא להסתפק בכך שהבדיקות עוברות; לוודא שכל acceptance criterion באמת ממומש.
- אם סעיף לא מוכח — להוריד אותו מ-100% ולא להשאיר `done` שקרי.

### A2 — תוכן/פדגוגיה ומתמטיקה
- להשלים כל פער בטבלת `r/d/h/V`, כולל conversion ו-approximate π בתוך טבלה כאשר נדרש.
- לוודא גשר ברור exact `kπ` → approximation → estimation.
- להשלים חקירת שינוי ממדים לפי דפוס יניב: מספרים → שינוי משתנה יחיד → חישוב מחדש → פי כמה → הכללה של התלמיד.
- לשמור את השאלה הרשמית/הנעולה 1:1.
- לא להוסיף תוכן רק כדי למלא מקום.

### A3 — גרפיקה/עימוד
- לשפר רק פגמים אמיתיים: label safety, פרמטריזציה שימושית, ניצול A4, מרחבי כתיבה, עקביות.
- לא לבצע redesign כולל אם אין צורך.
- כל שינוי SVG/diagram נבדק בכל האוריינטציות, במובייל, בהדפסה וב-PDF.

### A4 — QA
חובה להריץ ולהשאיר ירוק:
- `npm run qa`
- `npm run qa:browser`
- `npm run qa:visual` אם הסקריפט קיים בגרסה שביצע AI Studio.
- build/compile של סביבת AI Studio כאשר רלוונטי.
- אין 100% אם אחד מהשערים הרלוונטיים נכשל.

### A5 — עדכון מעקב
לאחר כל batch משמעותי:
- `STUDENT_PROGRESS.json`
- `STUDENT_REQUIREMENT_TRACEABILITY.md`
- commit SHA
- testsPassed
- evidence
- remaining אמיתי

### A6 — commits
- commits קטנים, סמנטיים וברורים.
- אין commit ענק שמערבב תוכן, עיצוב, QA ותיעוד ללא צורך.
- אין force-push.

---

## מסלול B — ChatGPT: ביקורת עצמאית, אימות ו-QA נגדי

ChatGPT עובד במקביל כ-reviewer/validator עצמאי ואינו סומך על דיווחי AI Studio ללא ראיות. תחומי הבעלות:

### B1 — אימות remote
- לבדוק commits חדשים ב-GitHub.
- להשוות baseline מול head.
- לזהות אילו קבצים באמת השתנו.
- לוודא ש-`STUDENT_PROGRESS.json` תואם לשינוי בפועל.

### B2 — בדיקת מקור האמת
- להשוות את המימוש מול `SOURCE_OF_TRUTH.md` ולא מול הסיכום של AI Studio.
- לזהות דרישות שנשמטו, כפילויות, סתירות או סימון `done` שגוי.
- לאשר 100% רק כאשר כל הדרישות החומריות ממופות ומוכחות.

### B3 — audit מתמטי ופדגוגי עצמאי
- לחשב מחדש תוצאות קריטיות.
- לבדוק רדיוס/קוטר, יחידות, π, פיתגורס, חתך צירי, שינוי ממדים ושאלת המקור.
- לבדוק שהרצף מתאים לכיתה ח׳ ולסגנון יניב.

### B4 — audit חזותי
- לבדוק את 8 הדפים כסט אחד, לא רק כל דף בנפרד.
- לחפש dead space, צפיפות, חפיפות, label collisions, overflow, טקסט כבד, שרטוטים מטעים וחוסר מקום עבודה.
- להשוות screenshots/PDF מאומתים.

### B5 — audit ארכיטקטורה
- מקור אמת יחיד.
- אין תוכן משוכפל.
- IDs יציבים.
- שינויים עתידיים קלים.
- אין abstraction/refactor ללא ROI.

### B6 — תיקוני ChatGPT
ChatGPT רשאי לבצע תיקון ישיר בריפו רק כאשר:
- הקובץ אינו נמצא כרגע בבעלות batch פעיל של AI Studio; או
- התיקון נעשה לאחר שה-batch של AI Studio נדחף וה-head נבדק מחדש.

ברירת המחדל בזמן ש-AI Studio עובד על קבצי המוצר היא ש-ChatGPT **לא דורך על אותם קבצים**, אלא מכין audit מדויק ואז מתקן מיד לאחר checkpoint.

---

# מנגנון מניעת התנגשויות

## כלל 1 — pull/check head לפני כל batch
לפני עריכה, כל צד חייב לדעת מהו head הנוכחי של ה-remote.

## כלל 2 — אין עריכה מקבילית של אותו קובץ
אם AI Studio עובד כרגע על `content.js`, `app.js`, `styles.css`, `qa*.mjs`, `SOURCE_OF_TRUTH.md`, `STUDENT_PROGRESS.json` או `STUDENT_REQUIREMENT_TRACEABILITY.md`, ChatGPT לא יכתוב לאותו קובץ עד checkpoint/push. ולהפך.

## כלל 3 — checkpoint תכוף
לא מחזיקים עשרות שינויים לא-שמורים. אחרי batch קוהרנטי: QA → commit → push → verify.

## כלל 4 — אין overwrite עיוור
אם remote השתנה מאז תחילת batch, יש לבצע merge/reconcile מודע. אין להחליף קובץ שלם בגרסה ישנה.

## כלל 5 — אין force push
אסור `--force` או כל פעולה שיכולה למחוק היסטוריה תקינה.

## כלל 6 — ראיה לפני אחוז
אחוז מתקדם רק לאחר commit + QA/evidence. `STUDENT_PROGRESS.json` אינו מקור להוכחה לעצמו.

---

# מה נחשב 100% אמיתי

100% מותר רק כאשר כל התנאים הבאים מתקיימים יחד:

1. כל P01–P14 ב-`AI_STUDIO_STUDENT_EXECUTION.md` סגורים באמת.
2. כל 14 קבוצות ב-`STUDENT_PROGRESS.json` הן `done` עם `completionPercent=100` ו-`remaining=[]`.
3. `progress-qa.mjs` עובר.
4. contract/content/math/coverage QA עוברים.
5. browser/mobile/A4/print/PDF QA עוברים.
6. visual regression / visual audit הרלוונטי עובר.
7. 8 דפי התלמיד נבדקו כסט שלם.
8. אין דפי מורה.
9. השאלה הרשמית והעמוד הנעול נשארו 1:1.
10. אין regressions, broken assets או console errors רלוונטיים.
11. traceability מלאה לכל דרישה חומרית.
12. ה-remote GitHub מכיל את הקוד והראיות; לא רק סביבת AI Studio המקומית.

---

# סדר עדיפויות לביצוע במהירות גבוהה

1. **Checkpoint remote של עבודת AI Studio שכבר קיימת.**
2. QA על checkpoint והוכחת מה באמת נסגר.
3. סגירת פערים פונקציונליים/פדגוגיים ומתמטיים.
4. סגירת גרפיקה/label safety/A4 אמיתיים בלבד.
5. traceability + SSOT hygiene בלי לשנות משמעות.
6. full regression.
7. final independent review של ChatGPT.
8. רק אז 100%.

---

# הודעה קצרה שיניב יכול לשלוח ל-Google AI Studio

לאחר שהקובץ הזה קיים ב-remote, מספיק לכתוב ל-AI Studio:

**`קרא את PARALLEL_MAX_POWER_EXECUTION.md בריפו ופעל לפיו עכשיו עד 100% אמיתי.`**

אין צורך להדביק את כל ההוראות בצ׳אט של AI Studio. כל הפירוט נמצא בריפו.
