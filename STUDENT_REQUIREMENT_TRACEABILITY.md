# Student Requirement Traceability — חרוט חדש

> מסמך ראיות ומיפוי בלבד. `SOURCE_OF_TRUTH.md` הוא הסמכות היחידה. מסמך זה אינו יוצר דרישות ואינו רשאי לשנות דרישה.

## מטרת המסמך

**דרישה ב־SSOT → בעלים/מימוש → עמוד/ID → QA → ראיה → מצב**

| ID | תחום שנבדק | בעלים/מימוש | QA/ראיה | מצב | מה עוד נדרש |
|---|---|---|---|---|---|
| R01 | חוברת דפי תלמיד בלבד; מספר עמודים נגזר מהדרישות ולא יעד קבוע | `app.js`, `styles.css` | browser QA + CI | ✅ בוצע | אין להתחיל עמודי מורה |
| R02 | עמוד 1 — תוכן מקור נעול 1:1; ללא „בס״ד” לפי §13.5 | `content.js`, `tests/page1-source-lock.txt` | lock comparator + browser QA | ✅ בוצע | לשמר lock |
| R03 | נכס ההמחשה המאומת בעמוד 1 | pinned asset ב־`app.js` | image/assets QA | ✅ בוצע | אין |
| R04 | הגדרת חרוט ומונחים: בסיס, קודקוד, מעטפת, גובה | `content.js`, עמוד 2 | coverage QA | ✅ בוצע | אין |
| R05 | חתך צירי — הגדרה, חישוב ושרטוט תלמיד | עמוד 5; `CONE-AX-01`, `CONE-AX-SKETCH-01` | coverage + math + reviewed visual artifact | ✅ בוצע | אין |
| R06 | נפח חרוט | `CONE-VOL-01` | math QA | ✅ בוצע | אין |
| R07 | טבלת r/d/h/V עם חסרים משתנים | `volumeTableRows` + supplement rows | table solver + math QA | ✅ בוצע | אין |
| R08 | קשר r↔d בתוך התרגול | `volumeTableRows` | math QA | ✅ בוצע | אין |
| R09 | חישוב הפוך מנפח | `CONE-REV-01` | math/coverage QA | ✅ בוצע | אין |
| R10 | המרת מידות | `CONE-CONV-01`, `CONE-TAB-CONV-01` | math QA | ✅ בוצע | אין |
| R11 | תשובה מדויקת עם π | תוכן חישובי | math QA | ✅ בוצע | אין |
| R12 | π≈3.14 | `CONE-CONV-01` | math QA | ✅ בוצע | אין |
| R13 | אומדן/סדר גודל + kπ→קירוב | `CONE-TAB-APPROX-01` | deterministic math QA | ✅ בוצע | אין |
| R14 | קירוב משתמש ב־≈ ולא ב־= | authored math content | math QA | ✅ בוצע | אין |
| R15 | סימן כפל · / `\cdot` בלבד | MathJax/content | forbidden-glyph QA | ✅ בוצע | אין |
| R16 | פיתגורס בתוך שאלת חרוט | `CONE-PYT-01`, official Q6 | math + coverage QA | ✅ בוצע | אין |
| R17 | שינוי ממדים בחקירה מודרכת | `CONE-CHANGE-01`, עמודים 7–8 | 24π→48π→96π + x2/x4 deterministic QA; review מול SSOT §8 | ✅ בוצע | מקרה בסיס + שני שינויי משתנה + השוואה + הכללה מספקים את §8 ללא חזרתיות |
| R18 | הקשר מציאותי | official ice-cream Q6 | lock + coverage QA | ✅ בוצע | אין |
| R19 | שאלה 6 הרשמית א–ד נשמרת 1:1 | `CURR-CONE-06` | official lock comparator | ✅ בוצע | אין |
| R20 | כל שאלות החרוט המחייבות אותרו | `curriculum-cone-inventory.json` | completeness gate | ✅ בוצע | אין |
| R21 | כותרת „שאלות מתוך תוכנית הלימודים” | עמודים 10–11 | QA | ✅ בוצע | אין |
| R22 | אוריינטציות חרוט מגוונות | עמוד 9; `orientedConeSvg` | coverage + reviewed screenshots | ✅ בוצע | אין |
| R23 | שרטוט עצמאי של תלמיד | עמוד 9 | browser QA | ✅ בוצע | אין |
| R24 | SVG/HTML וקטורי | diagram helpers | browser/PDF QA | ✅ בוצע | אין |
| R25 | אזורי תווית בטוחים ללא חפיפות | `coneSvg`, `axialSvg`, `waffleConeSvg` | שער גאומטרי דטרמיניסטי ב־`browser-qa.mjs` — כל תווית שרטוט מרוחקת ≥2 יחידות מכל קו מבנה ואינה נחתכת מחוץ ל־viewBox; תוקנה חפיפת „10 ס״מ” בוופל ומרווח „ℓ” בחתך הצירי | ✅ בוצע | אין חפיפת תוויות |
| R26 | A4 ‏210×297 ללא internal overflow | `styles.css` | 5 viewports + CI | ✅ בוצע | אין |
| R27 | scale חיצוני במובייל | `fitPage`, CSS transform | browser QA | ✅ בוצע | אין |
| R28 | RTL מלא | HTML/CSS | browser QA | ✅ בוצע | אין |
| R29 | MathJax/TeX עקבי | `index.html`, `app.js` | browser assets QA | ✅ בוצע | אין |
| R30 | טקסט תלמיד 400–500, ללא bold כבד | `styles.css` | contract + visual review | ✅ בוצע | אין |
| R31 | רשת 5×5 מ״מ | `styles.css` | contract QA | ✅ בוצע | אין |
| R32 | כל סעיף בנפרד: תרגיל → מרחב עבודה → תשובה | subpart helpers | DOM gate + CI | ✅ בוצע | אין |
| R33 | ניצול A4 ללא צפיפות/overflow | 11-page layouts/workspaces | CI artifact 37853329815 reviewed page-by-page/contact sheet; no overflow gates | ✅ בוצע | אין |
| R34 | footer מחוזי; עמוד 1 שורת איילת בלבד | shared footer + page1Footer | footer audit + browser QA | ✅ בוצע | אין |
| R35 | סמל מחוז מאומת | pinned logo | image-load QA | ✅ בוצע | אין |
| R36 | קורא: הקודם/הבא/מונה + גלילה רציפה | reader controls | browser QA | ✅ בוצע | אין |
| R37 | touch targets ≥44px | CSS | browser QA | ✅ בוצע | אין |
| R38 | Desktop + Android + iPhone portrait/landscape | `browser-qa.mjs` | CI run 37856393919 | ✅ בוצע | אין |
| R39 | Print/PDF במספר עמודים דינמי | print CSS + Playwright | CI run 37856393919 | ✅ בוצע | אין |
| R40 | הורדה ישירה/PDF UX | `download-pdf` → canonical PDF | contract + PDF QA | ✅ בוצע | אין |
| R41 | URL ציבורי קבוע | — | governance audit מול SSOT | ➖ לא דרישה קנונית | הדרישה הופיעה במסמך ביצוע נגזר בלבד; SSOT §1.5 אוסר על מסמך נגזר להוסיף דרישה. אינה חוסמת השלמה |
| R42 | הפרדת content/design/behavior | `content.js` / `app.js` / `styles.css` | code audit | ✅ בוצע | אין |
| R43 | stable IDs; אין array-index lookup | `q(id)` + unique IDs | QA | ✅ בוצע | אין |
| R44 | רכיבים/ערכים חוזרים ברמת ROI | shared helpers + existing tokens | audit מול SSOT §19.4–19.5 | ✅ בוצע | אין refactor נוסף ללא ROI מוכח |
| R45 | רכיבים משותפים | footer/grid/answer/subpart/diagram helpers | code audit | ✅ בוצע | אין |
| R46 | visual regression | `visual-baseline.json` + `visual-regression-qa.mjs` | CI run 37856393919: 11 screenshots match reviewed baseline | ✅ בוצע | baseline hash gate פעיל |
| R47 | חישוב מתמטי דטרמיניסטי | `math-qa.mjs` | CI | ✅ בוצע | אין |
| R48 | assets/fonts/console errors | `browser-qa.mjs` | CI | ✅ בוצע | אין |
| R49 | Requirement Traceability | מסמך זה | כל R01–R52 נסרקו מחדש; noncanonical R41 מסומן במפורש | ✅ בוצע | אין |
| R50 | SOURCE_OF_TRUTH ללא מקור מתחרה/drift | `SOURCE_OF_TRUTH.md`, `ssot-qa.mjs` | SSOT QA | ✅ בוצע | אין |
| R51 | Evidence before claim | GitHub commits + Actions | CI run 37856393919 + reviewed artifact | ✅ בוצע | אין |
| R52 | 100% רק כשכל השערים סגורים | `STUDENT_PROGRESS.json` + CI | כל השערים הקנוניים סגורים; יניב הורה בשיחה לסיים את חרוט חדש למאה אחוז | ✅ בוצע | אין |
| R53 | הגדרת חרוט כהשלמה פעילה (§10.4) | `app.js` עמוד היכרות, `qa.mjs`, `coverage-qa.mjs` | שער: ≥3 בלנקים, אין מסירה פסיבית של בסיס/קודקוד/מעטפת | ✅ בוצע | אין |
| R54 | קומיקס צבעוני משולב (§26.5.1) | `content.js:comicStrip`, `app.js`, `styles.css` | שער comic + preview עמוד 2 | ✅ בוצע | אין |
| R55 | עמוד „מסמנים את חלקי החרוט” (§26) | `CONE-PARTS-01/INVAR-01/CLAIM-01`, `app.js` | coverage QA + preview עמוד 3 (ללא overflow) | ✅ בוצע | אין |
| R56 | איורי חרוט תלת־ממדי מיובאים (§26.5.2) | `assets/cone-3d-upright\|down\|side.svg` | preview עמוד 3; וקטורי בהדפסה | ✅ בוצע | אין |
| R57 | סבב הרחבה מתועד ב־SSOT (§2.7/§26) | `SOURCE_OF_TRUTH.md`, `STUDENT_PROGRESS.json` G15 | progress coupling + ssot-qa | 🔄 בתהליך | שלבים 2–5 בהמשך |
| R58 | שרטוט נשאר בקופסתו ואינו גולש/חופף תוכן (§16.7) | `styles.css` (`.intro-cone` חוסם SVG לגובה), `browser-qa.mjs` שער containment | containment gate: אפס גלישה של svg/img דיאגרמה מעבר לקופסת ההורה; תוקנה חפיפת חרוט עמוד 2 | ✅ בוצע | אין |
| R59 | הרחבה שלב 2 — זיהוי/מושגים (§26.3.2/§26.7.2) | `content.js` (CONE-OBJ/WHO/VIEW), `app.js` (8 עמודים + 6 דיאגרמות) | QA 36 IDs/20 דפים + browser-QA (ללא overflow/spill/חיתוך) + ביקורת עמוד־עמוד | ✅ בוצע | שלבים 3–5 בהמשך |
| R60 | תוויות דיאגרמות ההרחבה בתוך ה־viewBox (§15.3) | `browser-qa.mjs` שער label-clipping | clip gate: אפס `<text>` חתוך מחוץ ל־viewBox; תוקנו שתי תוויות VIEW | ✅ בוצע | אין |
| R61 | הרחבה שלב 3 — פריסה/זווית הגזרה/חתכים (§26.3.2/§26.7.3) | `content.js` (CONE-NET/SEC/CUT), `app.js` (8 עמודים + 6 דיאגרמות), `styles.css` (`.diagram-box`, `.sec-table`) | QA 53 IDs/28 דפים + browser-QA (ללא overflow/spill/חיתוך, PDF 28 דפים) + ביקורת עמוד־עמוד (12–19) | ✅ בוצע | שלבים 4–5 בהמשך |
| R62 | דיאגרמות שלב 3 בתוך הקופסה והתוויות בתוך ה־viewBox (§16.7/§15.3) | `browser-qa.mjs` (6 מחלקות SVG חדשות בבוררי containment + clip) | containment+clip gates ירוקים על כל 6 הדיאגרמות החדשות | ✅ בוצע | אין |
| R63 | הרחבה שלב 4 — יחס השליש וניתוח שגיאות (§26.3.2/§26.7.4) | `content.js` (CONE-RATIO/ERR), `app.js` (6 עמודים + 2 דיאגרמות + ratioTable), `styles.css` (`.ratio-figure`/`.ratio-svg`/`.diameter-cone-svg`) | QA 66 IDs/34 דפים + math-QA (יחסים/שגיאות נכונים) + browser-QA (ללא overflow/spill/חיתוך, PDF 34 דפים) + ביקורת עמוד־עמוד (21–26) | ✅ בוצע | שלב 5 בהמשך |
| R64 | ריענון baseline ויזואלי ל־28 דפים מ־CI (§26.7.3a) | `visual-baseline.json` מ־artifact ריצה 37919501489 (fb8e823) | visual-regression-qa עבר מקומית, 28 דפים; תחזוקת CI בלבד | ✅ בוצע | מתרענן שוב אחרי כל שלב הרחבה |

## כללי עדכון ראיות

- `✅` רק אחרי מימוש + בדיקה + ראיה אמיתית.
- `➖` מסמן פריט שנמצא במסמך נגזר אך אינו דרישה קנונית ב־SSOT ולכן אינו חוסם השלמה.
- שינוי דרישה נעשה רק ב־`SOURCE_OF_TRUTH.md`.
- כל שינוי מהותי חייב להסתנכרן גם עם `STUDENT_PROGRESS.json`.

## ביקורת סגירה 2026-10-09

- נבדק artifact חזותי מלא של 11 דפי תלמיד מ־CI run `37853329815`, כולל עמודים 2, 5 ו־10 ברזולוציה מלאה לבדיקת תוויות/שרטוטים.
- נוסף baseline חזותי מאומת לכל 11 העמודים ושער hash regression אוטומטי.
- CI run `37856393919` עבר: contract QA, progress coupling, browser A4/mobile/print/PDF ו־visual regression.
- R41 הוסר כחסם מפני שאינו מופיע ב־`SOURCE_OF_TRUTH.md`; הוא נולד במסמך ביצוע נגזר, שאינו רשאי להוסיף דרישות לפי §1.5.
- אין עמודי מורה פעילים; סבב דפי התלמיד נסגר בהתאם להוראה המפורשת של יניב לסיים את חרוט חדש ל־100%.
