# Student Requirement Traceability — חרוט חדש

> מסמך ראיות ומיפוי בלבד. `SOURCE_OF_TRUTH.md` הוא הסמכות היחידה. מסמך זה אינו יוצר דרישות ואינו רשאי לשנות דרישה.

## מטרת המסמך

שרשרת ההוכחה היא:

**דרישה ב־SSOT → בעלים/מימוש → עמוד/ID פעיל → QA → commit/ראיה → מצב**

| ID | תחום שנבדק | מקור סמכות | בעלים/מימוש | QA/ראיה | מצב | מה עוד נדרש |
|---|---|---|---|---|---|---|
| R01 | חוברת דפי תלמיד בלבד; מספר עמודים נגזר מהדרישות ולא יעד קבוע | SSOT — מצב הפרויקט | `app.js`, `styles.css` | `browser-qa.mjs`; CI #103 | ✅ בוצע | אין להתחיל עמודי מורה |
| R02 | עמוד 1 — תוכן מקור נעול 1:1; שורת „בס״ד” מחוץ לנעילה (§13.5, הוראת יניב 2026-10-09) | SSOT — עמוד 1 | `content.js`, `tests/page1-source-lock.txt` | comparator + גייט בס״ד ב־`qa.mjs`; browser QA | ✅ בוצע | לשמר lock |
| R03 | נכס ההמחשה המאומת בעמוד 1 | SSOT — עמוד 1 | pinned asset ב־`app.js` | image/assets QA | ✅ בוצע | לשמר pin |
| R04 | הגדרת חרוט ומונחים: בסיס, קודקוד, מעטפת, גובה | SSOT — כיסוי פדגוגי | `content.js`, עמוד 2 | `coverage-qa.mjs` | ✅ בוצע | אין |
| R05 | חתך צירי — הגדרה, חישוב ושרטוט תלמיד | SSOT — כיסוי + פיתגורס | עמוד 4; `CONE-AX-01`, `CONE-AX-SKETCH-01` | coverage + math + browser QA | ✅ בוצע | בדיקת שרטוטים חזותית מתמשכת |
| R06 | נפח חרוט | SSOT — כיסוי פדגוגי | עמוד 3; `CONE-VOL-01` | `math-qa.mjs` | ✅ בוצע | אין |
| R07 | טבלת r/d/h/V עם חסרים משתנים | SSOT — טבלאות השלמה | `volumeTableRows` + שורות השלמה `CONE-TAB-CONV-01`/`CONE-TAB-APPROX-01` | table solver + supplement-row QA ב־`math-qa.mjs`; PR #1 CI 37845048203 | ✅ בוצע | אין |
| R08 | קשר r↔d בתוך התרגול | SSOT — טבלאות השלמה | `volumeTableRows` | math QA | ✅ בוצע | אין |
| R09 | חישוב הפוך מנפח | SSOT — כיסוי פדגוגי | `CONE-REV-01` + reverse rows | math/coverage QA | ✅ בוצע | אין |
| R10 | המרת מידות | SSOT — כיסוי פדגוגי | `CONE-CONV-01` + שורת טבלה `CONE-TAB-CONV-01` | math QA (conversion-row gate); PR #1 CI 37845048203 | ✅ בוצע | אין |
| R11 | תשובה מדויקת עם π | SSOT — עבודה עם π | `CONE-VOL-01` ועוד | math QA | ✅ בוצע | אין |
| R12 | π≈3.14 | SSOT — עבודה עם π | `CONE-CONV-01` | math QA | ✅ בוצע | אין |
| R13 | אומדן/סדר גודל + גשר kπ→קירוב | SSOT — עבודה עם π | `CONE-CONV-01` + שורת טבלה `CONE-TAB-APPROX-01` | math QA (kπ→approximation gate: 50π→157); PR #1 CI 37845048203 | ✅ בוצע | אין |
| R14 | קירוב משתמש ב־≈ ולא ב־= | SSOT — עבודה עם π | authored math content | deterministic gate ב־`math-qa.mjs`; commit `8167313` | ✅ בוצע | שאלה רשמית נעולה נשמרת 1:1 |
| R15 | סימן כפל · / `\cdot` בלבד | SSOT — סימנים וכתיבה | `app.js`, MathJax | forbidden-glyph QA | ✅ בוצע | אין |
| R16 | משפט פיתגורס בתוך שאלת חרוט | SSOT — פיתגורס וחתך צירי | `CONE-PYT-01`, official Q6 | math + coverage QA | ✅ בוצע | אין |
| R17 | שינוי ממדים בחקירה מודרכת | SSOT — חקירה מספרית | `CONE-CHANGE-01`, עמודים 6–7 | 24π→48π→96π deterministic QA | 🟡 חלקי | להשלים מספיק ראיות מספריות לפני הכללה בלי חזרתיות |
| R18 | הקשר מציאותי | SSOT — כיסוי פדגוגי | official ice-cream Q6 | lock + coverage QA | ✅ בוצע | אין |
| R19 | שאלה 6 הרשמית א–ד נשמרת 1:1 | SSOT — שאלות רשמיות | `CURR-CONE-06`, עמודים 9–10 | official lock comparator | ✅ בוצע | אין |
| R20 | כל שאלות החרוט המחייבות אותרו | SSOT — סמכות פדגוגית | `curriculum-cone-inventory.json` | completeness gate ב־`coverage-qa.mjs`; commits `12fa9a4`, `c332784` | ✅ בוצע | לעדכן inventory אם מקור התוכנית משתנה |
| R21 | כותרת „שאלות מתוך תוכנית הלימודים” | SSOT — שאלות רשמיות | עמודים 9–10 | `qa.mjs` | ✅ בוצע | אין |
| R22 | אוריינטציות חרוט מגוונות | SSOT — שרטוטים | עמוד 8; `orientedConeSvg` | coverage + browser screenshots | ✅ בוצע | safe-label regression עדיין R25 |
| R23 | שרטוט עצמאי של תלמיד | SSOT — שרטוטים | עמוד 8 | QA presence + browser | ✅ בוצע | אין |
| R24 | SVG/HTML וקטורי | SSOT — שרטוטים | diagram helpers ב־`app.js` | browser/PDF QA | ✅ בוצע | המשך parameterization רק עם ROI |
| R25 | אזורי תווית בטוחים ללא חפיפות | SSOT — שרטוטים | diagram helpers | screenshots | 🟡 חלקי | להפחית magic coordinates ולהוסיף collision/regression gate |
| R26 | A4 ‏210×297 ללא internal overflow | SSOT — A4 | `styles.css` | browser QA בכל 5 viewports; CI #103 | ✅ בוצע | אין |
| R27 | scale חיצוני במובייל | SSOT — מובייל | `fitPage`, CSS transform | browser QA | ✅ בוצע | אין |
| R28 | RTL מלא | SSOT — עיצוב | `index.html`, CSS | browser QA | ✅ בוצע | אין |
| R29 | MathJax/TeX עקבי | SSOT — עיצוב/מתמטיקה | `index.html`, `app.js` | contract + browser assets | ✅ בוצע | אין |
| R30 | משקל טקסט תלמיד 400–500, ללא bold כבד | SSOT — עיצוב | `styles.css` | contract QA + 10-page browser QA | ✅ בוצע | אין |
| R31 | רשת 5×5 מ״מ | SSOT — מרחב עבודה | `styles.css` | contract QA | ✅ בוצע | אין |
| R32 | כל סעיף בנפרד: תרגיל → מרחב עבודה → תשובה | SSOT — כלל סעיפים | `splitHebrewSubsections`, `renderSubpart`, עמודים 5–7 ו־9–10 | static QA + browser DOM gate; 11 יחידות סעיף לפחות; CI #103 | ✅ בוצע | לשמור על הכלל בכל סעיף חדש |
| R33 | ניצול A4 ללא צפיפות/overflow | SSOT — A4 ועיצוב | layouts/workspaces | 10-page browser overflow QA + screenshots | 🟡 כמעט | ביקורת חזותית ידנית סופית של סט הדפים |
| R34 | footer מחוזי אחיד בכל דף; בעמוד 1 בלבד שורת איילת קריספין (§18.3, הוראת יניב 2026-10-09) | SSOT — כותרת תחתית | shared `footer()` + `page1Footer()` + `page1Credit` ב־`content.js` | footer audit ב־`qa.mjs` + `browser-qa.mjs` | ✅ בוצע | אין |
| R35 | סמל מחוז מאומת | SSOT — כותרת תחתית | pinned logo | image-load QA | ✅ בוצע | אין |
| R36 | קורא: הקודם/הבא/מונה | SSOT — מובייל/ניווט | `index.html`, `app.js` | dynamic navigation QA | ✅ בוצע | אין |
| R37 | touch targets ≥44px | SSOT — מובייל | CSS | browser QA | ✅ בוצע | אין |
| R38 | Desktop + Android + iPhone portrait/landscape | SSOT — QA | `browser-qa.mjs` | 5 viewport checks; CI #103 | ✅ בוצע | אין |
| R39 | Print/PDF במספר עמודים דינמי | SSOT — הדפסה/PDF | print CSS + Playwright | dynamic PDF/A4 QA; export commit `fcf2b06` | ✅ בוצע | אין |
| R40 | הורדה ישירה/PDF UX | SSOT — הדפסה/PDF | `index.html` `download-pdf` anchor → validated `exports/student-pages/cone-student.pdf` (CI regenerates on main) | direct-download contract gate ב־`qa.mjs`; commit `56bdc99` | ✅ בוצע | שמירת ה־PDF מעודכן מתבצעת ע״י persist של CI ב־main |
| R41 | URL ציבורי קבוע + smoke check | SSOT — תוצר אתר | טרם הופעל | prior 404 evidence | ❌ פתוח | להפעיל רק אם נדרש והרשאות מאפשרות |
| R42 | הפרדת content/design/behavior | SSOT — ארכיטקטורה | `content.js` / `styles.css` / `app.js` | code audit | ✅ בוצע | אין |
| R43 | stable IDs; אין array-index lookup | SSOT — ארכיטקטורה | `content.js`, `q(id)` | `qa.mjs` | ✅ בוצע | אין |
| R44 | design tokens מרכזיים | SSOT — ארכיטקטורה | `:root` חלקי | code audit | 🟡 חלקי | לרכז רק ערכים חוזרים עם ROI ברור |
| R45 | רכיבים משותפים | SSOT — ארכיטקטורה | footer/grid/answer/subpart/diagram helpers | code audit | ✅ בוצע | הרחבה רק אם יש דפוס חוזר אמיתי |
| R46 | visual regression | SSOT — QA | screenshots נשמרים | screenshots-only | 🟡 חלקי | baseline comparison אוטומטי |
| R47 | חישוב מתמטי דטרמיניסטי | SSOT — QA | `math-qa.mjs` | CI #103; שורות הטבלה החדשות מכוסות ב‑PR #1 CI 37845048203 | ✅ בוצע | אין |
| R48 | assets/fonts/console errors | SSOT — QA | `browser-qa.mjs` | CI #103 | ✅ בוצע | אין |
| R49 | Requirement Traceability | SSOT — Traceability | מסמך זה | updated against verified commits/CI | 🟡 מתקדם | להשלים ראיית commit לכל פער שנותר לפני final 100% |
| R50 | SOURCE_OF_TRUTH ללא מקור מתחרה/drift | SSOT — סמכות יחידה | `SOURCE_OF_TRUTH.md`, `ssot-qa.mjs` | SSOT QA PASS; commits `34bc363`, `b5738e8` | ✅ בוצע | כל דרישה חדשה ממוזגת רק שם |
| R51 | Evidence before claim | SSOT — QA/ביצוע | GitHub commits + Actions | contract + browser + export evidence ב־CI #103 | ✅ פעיל ומוכח | להמשיך כך בכל שלב |
| R52 | 100% רק כשכל השערים סגורים | SSOT — תנאי סיום | `STUDENT_PROGRESS.json` + CI | progress guard | 🟡 פעיל | אסור לטעון 100% כל עוד קיימים R17/R25/R33/R41/R44/R46/R49 |

## כללי עדכון ראיות

- `✅` רק אחרי מימוש + בדיקה + ראיה אמיתית.
- `🟡` נשאר עם פער קונקרטי; אין למחוק פער כדי להעלות אחוז.
- `❌` הוא פער פתוח/חסום ואוסר טענת 100% כאשר הוא חלק מתנאי הסיום.
- שינוי במפת הבעלות או במצב חייב להסתנכרן גם עם `STUDENT_PROGRESS.json`.
- אין לשנות דרישה דרך מסמך זה; שינוי דרישה נעשה רק ב־`SOURCE_OF_TRUTH.md`.
