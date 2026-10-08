# Student Requirement Traceability — חרוט חדש

> מסמך ראיות ומיפוי בלבד. `SOURCE_OF_TRUTH.md` הוא הסמכות היחידה. אין להוסיף כאן דרישה חדשה שאינה קיימת ב-SSOT או בהוראה מפורשת ועדכנית של יניב.

## מטרת המסמך

לאפשר בדיקה מהירה ומדויקת של השרשרת:

**דרישה → מקור סמכות → קובץ/רכיב בעלים → עמוד/ID פעיל → QA → ראיית commit/status**

Google AI Studio חייב לעדכן מסמך זה כאשר הוא סוגר פער מהותי או משנה בעלות/QA.

| ID | דרישה | מקור סמכות | בעלים/מימוש | QA/ראיה קיימת | מצב | מה עוד נדרש |
|---|---|---|---|---|---|---|
| R01 | 8 דפי תלמיד A4, ללא דפי מורה | SSOT מטרת המוצר + כלל ברזל מורה | `app.js`, `styles.css` | `browser-qa.mjs`, `qa.mjs` | ✅ בוצע | אין להתחיל מורה |
| R02 | עמוד 1 הוא דף ההמחשה המקורי 1:1 | SSOT §6 | `content.js`, `tests/page1-source-lock.txt` | comparator ב-`qa.mjs` | ✅ בוצע | לשמר lock |
| R03 | האיור המקורי בעמוד 1 | SSOT §6 | `app.js` pinned asset | asset/image QA | ✅ בוצע | לשמר commit קבוע |
| R04 | הגדרת חרוט ומונחים: בסיס, קודקוד, מעטפת, גובה | SSOT §4–5 | `content.js`, page 2 | `coverage-qa.mjs` | ✅ בוצע | final visual review |
| R05 | חתך צירי כהגדרה + תרגול | SSOT §5/6א | page 4, `CONE-AX-01`, `CONE-AX-SKETCH-01` | coverage + math QA | ✅ בוצע | final diagram review |
| R06 | נפח חרוט | SSOT §5/6א | page 3, `CONE-VOL-01` | math QA | ✅ בוצע | אין |
| R07 | טבלת r/d/h/V עם חסרים משתנים | SSOT §6א | `volumeTableRows` ב-`content.js` | table solver ב-`math-qa.mjs` | 🟡 חלקי | להוסיף שורת conversion ושורת approximate π מתאימות |
| R08 | קשר r↔d בתוך הטבלה | SSOT §6א | `volumeTableRows` | math QA | ✅ בוצע | אין |
| R09 | חישוב הפוך מנפח | SSOT §5/6א | `CONE-REV-01` + rows D/E | math/coverage QA | ✅ בוצע | אין |
| R10 | המרת מידות | SSOT §5/6א | `CONE-CONV-01` | math QA | ✅ כתוכן / 🟡 בטבלה | לשלב גם בשורת טבלה מתאימה |
| R11 | π מדויק | SSOT §11 | `CONE-VOL-01` ועוד | QA | ✅ בוצע | אין |
| R12 | π≈3.14 | SSOT §11 | page 5 / `CONE-CONV-01` | math QA | ✅ בוצע | אין |
| R13 | אומדן/סדר גודל | SSOT §11 | `CONE-CONV-01` | math QA | ✅ בוצע | לחבר לפחות פעם אחת ישירות מתוצאת kπ לערך מקורב |
| R14 | אין שימוש ב-= לקירוב | SSOT §11 | תוכן/MathJax | QA חלקי | 🟡 חלקי | להוסיף בדיקה דטרמיניסטית מפורשת |
| R15 | סימן כפל · / `\cdot` בלבד | SSOT §7 | `app.js`, MathJax | forbidden glyph QA | ✅ בוצע | להרחיב ל-content.js אם נדרש |
| R16 | פיתגורס בתוך חרוט | SSOT §5/6א | `CONE-PYT-01`, page 4, official q6 | math + coverage QA | ✅ בוצע | אין |
| R17 | שינוי ממדים בחקירה מודרכת | SSOT סגנון יניב | `CONE-CHANGE-01` | math QA 24π→48π→96π | 🟡 חלקי | להשלים evidence מספיק לפני הכללה |
| R18 | הקשרים מציאותיים | SSOT §5 | official ice-cream question | lock + coverage QA | ✅ בוצע | אין |
| R19 | שאלה 6 הרשמית א–ד 1:1 | SSOT §4/6א | `CURR-CONE-06`, pages 7–8 | official snapshot comparator | ✅ בוצע | inventory completeness gate |
| R20 | כל שאלות החרוט המחייבות אותרו | SSOT §4 | כרגע audit ידני מול `jerusalem2` | אין inventory קנוני מלא | 🟡 חלקי | P01: inventory + automated completeness gate |
| R21 | כותרת "שאלות מתוך תוכנית הלימודים" | SSOT §4 | pages 7–8 | `qa.mjs` | ✅ בוצע | אין |
| R22 | אוריינטציות חרוט מגוונות | SSOT §8 | page 6 / `orientedConeSvg` | coverage + screenshots | ✅ בוצע | safe-label regression |
| R23 | שרטוט עצמאי של תלמיד | SSOT §8/9 | page 6 | QA presence + visual | ✅ בוצע | final workspace review |
| R24 | SVG/HTML וקטורי | SSOT §7–8 | `app.js` diagram helpers | browser/PDF QA | ✅ בוצע | להקשיח parameterization |
| R25 | safe label zones, ללא חפיפות | SSOT §8 | coordinates in diagram helpers | screenshots בלבד | 🟡 חלקי | להחליף fragile magic positions + regression evidence |
| R26 | A4 210×297 ללא internal scroll | SSOT §7 | `styles.css` | `browser-qa.mjs` | ✅ בוצע | אין |
| R27 | scale חיצוני במובייל, ללא שינוי גאומטריית A4 | SSOT §7 | `fitPage`, CSS transform | browser QA | ✅ בוצע | אין |
| R28 | RTL מלא | SSOT §7 | `index.html`, CSS | browser QA | ✅ בוצע | אין |
| R29 | MathJax/TeX עקבי | SSOT §7 | `index.html`, `app.js` | `qa.mjs` + browser assets | ✅ בוצע | אין |
| R30 | טקסט תלמיד 400–500, לא bold כבד | SSOT §7 | `styles.css` | contract QA | ✅ כמעט | final 8-page audit |
| R31 | רשת 5×5 מ"מ בגוון המאושר | SSOT §9 | `styles.css` | `qa.mjs` | ✅ בוצע | אין |
| R32 | תרגיל→מרחב חישוב→תשובה | SSOT §9 | page builders + helpers | visual audit | 🟡 חלקי | final per-question answer-line audit, במיוחד official a–b |
| R33 | ניצול A4 מלא אך לא צפוף | SSOT §7 | layouts/workspaces | screenshots + overflow QA | ✅ כמעט | final set review |
| R34 | footer מחוזי אחיד | SSOT §12 | shared `footer()` + CSS | images/assets QA | ✅ בוצע | אין |
| R35 | סמל מחוז מאומת | SSOT §12 | pinned district logo | image load QA | ✅ בוצע | אין |
| R36 | קורא: הקודם/הבא/מונה | SSOT §13 | `index.html`, `app.js` | browser navigation QA | ✅ בוצע | אין |
| R37 | touch targets ≥44px | SSOT §7/13 | CSS | browser QA | ✅ בוצע | אין |
| R38 | Desktop + Android + iPhone portrait/landscape | SSOT §13/15 | `browser-qa.mjs` | 5 viewport checks | ✅ בוצע | אין |
| R39 | Print/PDF 8 A4 | SSOT §13/15 | print CSS + Playwright PDF | PDF QA | ✅ בוצע | direct download tracked separately |
| R40 | הורדה ישירה/PDF UX | SSOT §13 | print button + repo export | partial | 🟡 חלקי | direct stable download action/link |
| R41 | URL ציבורי קבוע + smoke check | SSOT פרסום | אין Pages פעיל | prior 404 evidence | ❌ פתוח | להפעיל אם הרשאות מאפשרות / לתעד blocker |
| R42 | content/design/behavior separation | SSOT §16 | `content.js` / `styles.css` / `app.js` | code audit | ✅ בוצע | אין |
| R43 | stable IDs, no array-index lookup | SSOT §16/19 | `content.js`, `q(id)` | `qa.mjs` | ✅ בוצע | אין |
| R44 | design tokens מרכזיים | SSOT §16 | `:root` חלקי | code audit | 🟡 חלקי | לרכז repeated values עם ROI ברור |
| R45 | shared components | SSOT §16 | footer/grid/answer/diagram helpers | code audit | ✅ כמעט | להשלים high-ROI בלבד |
| R46 | visual regression אחרי CSS/diagram changes | SSOT §16/19 | screenshots stored | screenshots only | 🟡 חלקי | baseline diff automated gate |
| R47 | deterministic math recomputation | SSOT §12/19 | `math-qa.mjs` | CI | ✅ בוצע | להרחיב לכל שורות חדשות |
| R48 | QA assets/fonts/console errors | SSOT §15 | `browser-qa.mjs` | CI | ✅ בוצע | אין |
| R49 | Requirement Traceability מלאה | SSOT §19 | מסמך זה | manual | 🟡 חלקי | להשלים evidence commit/test לכל row ולכל P task |
| R50 | SSOT ללא drift וכפילויות | SSOT §14/19 | `SOURCE_OF_TRUTH.md` | audit ידני | ❌ פתוח | stale phase, automation duplication, duplicate section numbering |
| R51 | evidence before claim | SSOT §19 | QA + progress tracker | `STUDENT_PROGRESS.json` | 🟡 הוקם | Google AI Studio חייב לעדכן בכל commit מהותי |
| R52 | 100% רק עם כל השערים ירוקים | SSOT Definition of Done | `STUDENT_PROGRESS.json` + CI | formula + status rules | 🟡 פעיל | אסור 100 כל עוד row פתוח/חסום/חלקי |

## כללי עדכון

- כאשר דרישה עוברת ל-✅, יש לציין commit/test אמיתי.
- כאשר דרישה נשארת 🟡, יש להשאיר ניסוח `מה עוד נדרש` קונקרטי.
- כאשר דרישה ❌, אין להעלות את קבוצת המשקל המתאימה ל-100.
- אין למחוק שורה כדי להעלות אחוז.
- כל שינוי במפת הבעלות חייב להתעדכן כאן וגם ב-`STUDENT_PROGRESS.json` אם הוא משנה התקדמות.
