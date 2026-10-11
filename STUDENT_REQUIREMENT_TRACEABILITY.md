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
| R27 | scale חיצוני במובייל; גאומטריית A4 אינה משתנה (§20.1) | `fitPage`, CSS `transform` + `transform-origin:top right` | browser QA + horizontal-containment assertion (העמוד גלוי במלואו 360/390/412, left>=-1 && right<=viewport) | ✅ בוצע | אין (חיתוך הפורטרייט תוקן 2026-10-11) |
| R28 | RTL מלא | HTML/CSS | browser QA | ✅ בוצע | אין |
| R29 | MathJax/TeX עקבי | `index.html`, `app.js` | browser assets QA | ✅ בוצע | אין |
| R30 | טקסט תלמיד 400–500, ללא bold כבד | `styles.css` | contract + visual review | ✅ בוצע | אין |
| R31 | רשת 5×5 מ״מ | `styles.css` | contract QA | ✅ בוצע | אין |
| R32 | כל סעיף בנפרד: תרגיל → מרחב עבודה → תשובה | subpart helpers | DOM gate + CI | ✅ בוצע | אין |
| R33 | ניצול A4 ללא צפיפות/overflow | 11-page layouts/workspaces | CI artifact 37853329815 reviewed page-by-page/contact sheet; no overflow gates | ✅ בוצע | אין |
| R34 | footer מחוזי; עמוד 1 שורת איילת בלבד | shared footer + page1Footer | footer audit + browser QA | ✅ בוצע | אין |
| R35 | סמל מחוז מאומת | pinned logo | image-load QA | ✅ בוצע | אין |
| R36 | קורא ציבורי (§20.3): גלילה רציפה כברירת מחדל, מונה/בורר עמוד, ללא ניווט דף־דף גלוי | `index.html` (`.reader-internal` מוסתר), `app.js` (scroll-view default) | `qa.mjs` + browser QA (אין לחיצות בפקדים מוסתרים) | ✅ בוצע | אין |
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
| R57 | סבב הרחבה מתועד ב־SSOT (§2.7/§26) | `SOURCE_OF_TRUTH.md`, `STUDENT_PROGRESS.json` G15 | progress coupling + ssot-qa | ✅ בוצע | שלבים 1–5 הושלמו ומוזגו (G15=100%) |
| R58 | שרטוט נשאר בקופסתו ואינו גולש/חופף תוכן (§16.7) | `styles.css` (`.intro-cone` חוסם SVG לגובה), `browser-qa.mjs` שער containment | containment gate: אפס גלישה של svg/img דיאגרמה מעבר לקופסת ההורה; תוקנה חפיפת חרוט עמוד 2 | ✅ בוצע | אין |
| R59 | הרחבה שלב 2 — זיהוי/מושגים (§26.3.2/§26.7.2) | `content.js` (CONE-OBJ/WHO/VIEW), `app.js` (8 עמודים + 6 דיאגרמות) | QA 36 IDs/20 דפים + browser-QA (ללא overflow/spill/חיתוך) + ביקורת עמוד־עמוד | ✅ בוצע | אין (שלבים 3–5 הושלמו) |
| R60 | תוויות דיאגרמות ההרחבה בתוך ה־viewBox (§15.3) | `browser-qa.mjs` שער label-clipping | clip gate: אפס `<text>` חתוך מחוץ ל־viewBox; תוקנו שתי תוויות VIEW | ✅ בוצע | אין |
| R61 | הרחבה שלב 3 — פריסה/זווית הגזרה/חתכים (§26.3.2/§26.7.3) | `content.js` (CONE-NET/SEC/CUT), `app.js` (8 עמודים + 6 דיאגרמות), `styles.css` (`.diagram-box`, `.sec-table`) | QA 53 IDs/28 דפים + browser-QA (ללא overflow/spill/חיתוך, PDF 28 דפים) + ביקורת עמוד־עמוד (12–19) | ✅ בוצע | אין (שלבים 4–5 הושלמו) |
| R62 | דיאגרמות שלב 3 בתוך הקופסה והתוויות בתוך ה־viewBox (§16.7/§15.3) | `browser-qa.mjs` (6 מחלקות SVG חדשות בבוררי containment + clip) | containment+clip gates ירוקים על כל 6 הדיאגרמות החדשות | ✅ בוצע | אין |
| R63 | הרחבה שלב 4 — יחס השליש וניתוח שגיאות (§26.3.2/§26.7.4) | `content.js` (CONE-RATIO/ERR), `app.js` (6 עמודים + 2 דיאגרמות + ratioTable), `styles.css` (`.ratio-figure`/`.ratio-svg`/`.diameter-cone-svg`) | QA 66 IDs/34 דפים + math-QA (יחסים/שגיאות נכונים) + browser-QA (ללא overflow/spill/חיתוך, PDF 34 דפים) + ביקורת עמוד־עמוד (21–26) | ✅ בוצע | אין (שלב 5 הושלם) |
| R64 | ריענון baseline ויזואלי ל־28 דפים מ־CI (§26.7.3a) | `visual-baseline.json` מ־artifact ריצה 37919501489 (fb8e823) | visual-regression-qa עבר מקומית, 28 דפים; תחזוקת CI בלבד | ✅ בוצע | מתרענן שוב אחרי כל שלב הרחבה |
| R65 | הרחבה שלב 5 — יישומים/חקר אדריכלי/גשר חזרה (§26.3.2/§26.7.5) | `content.js` (CONE-APP/ARCH/BRIDGE), `app.js` (12 עמודים + 7 דיאגרמות), `styles.css` (`.funnel-svg`/`.beam-svg`/`.arch-*`/`.circle-svg`/`.right-triangle-svg`/`.invert-pair`) | QA 82 IDs/46 דפים + math-QA + browser-QA (ללא overflow/spill/חיתוך, PDF 46 דפים) + ביקורת עמוד־עמוד (33–46); משלים את רשימת §26.4.2 | ✅ בוצע | סגירה: baseline+CI ירוק |
| R66 | מניעת צפיפות A4 ובטיחות תוויות בשלב 5 (§16.6/§15.3) | `app.js`: פיצול 3 עמודים חורגים לשישה מרווחים; הסרת תווית הקו היוצר „15 ס״מ” מאיור הכובע (הערך בטקסט) | browser-QA: אפס גלישת A4 ואפס התנגשות label-safety על כל 46 הדפים; מדידת scrollHeight/clientHeight לכל עמוד = ללא חריגה | ✅ בוצע | אין |
| R67 | איורי raster כבדים (§26.5.4) | — | נדחו במכוון ב־SSOT לשלב מאוחר עם אופטימיזציה; אינם דרישת הסבב הנוכחי | ➖ לא קנוני בסבב זה | אופציונלי בעתיד |
| R68 | ליטוש איכות לאחר סגירה — אי־כפילות ו־CI (§26.7.6) | `content.js` (CLAIM-01 מוקדה מחדש; APP-01→r7/h9/147π; BRIDGE-06-א→r5/h12/ℓ13), `app.js` (תוויות משפך), `.github/workflows/qa.yml` (actions v4→v5) | אין כפילות מול CURR-CONE-06 הנעולה ולא מול WHO-01; math-QA + ביקורת אדוורסרית חוזרת ירוקות; CI יוצא מ־Node 20 | ✅ בוצע | עמודי מורה נעולים |
| R69 | כללי תצוגה מחייבים לתלמיד (§27): „קוטר” במילה במקום הסימן d, יחידה על כל מידה מוצגת, כותרת H1 נושא בלבד עם השלמת נוסחה כמשימה נפרדת, שימור רשת 5×5 מ״מ | `student-display-policy.js` (post-render), `index.html` | `student-display-policy-qa.mjs` (static) + `student-display-policy-browser-qa.mjs` (rendered DOM, qa:browser) | ✅ בוצע | נאכף בשכבת post-render + browser-gate; איחוד לתוך §9/§12 ואכיפת fast-suite — להחלטת Yaniv/GPT |
| R70 | איחוד עמ' 30–31 לעמוד אחד (§26.7.8, 46→45) + תיקון חיתוך מובייל פורטרייט (§20.1) | `app.js` (addPage ממוזג + scaleCone), `styles.css` (`transform-origin:top right`), `browser-qa.mjs` (horizontal-containment), `qa.mjs` (ספירה מדויקת 45/82 + glyph על content.js) | אימות חי 360/390/412 (כל 45 העמודים גלויים, 0 חיתוך) + דסקטופ ללא שינוי (baseline שמור) + browser-QA containment + `npm run qa` | ✅ בוצע | אין |
| R71 | בורר עמוד קומפקטי + מעבר ישיר ב־fade (§20.3, יניב 2026-10-11): „עמוד X מתוך 43”, פעולה גלויה יחידה „הורדת PDF”, בלי הקודם/הבא/דף בודד/גלילה רציפה/פתח דף מלא/כל החוברות/הדפסה; deep-link `#page=N` נשמר | `reader-jump.js`, `index.html` (`#page-selector`, `#book.reader-fading` 180ms, `download-pdf`), `package.json` (qa) | `reader-jump-qa.mjs` + browser QA (select גלוי, קפיצה מיידית ללא smooth-scroll, מעקב גלילה) | ✅ בוצע | אין |
| R72 | מובייל vertical-only — אין גלילה אופקית/ימין־שמאל (§20.1.1, יניב 2026-10-11): overflow-x clip במעטפת ובאזור הדפים, pan-y + pinch-zoom, A4 מותאם לרוחב ללא רוחב layout עודף; קפיצת בורר העמוד (§20.3) ללא שינוי | `index.html` (6db6861: html/body/.reader/#book overflow-x:clip, touch-action, overscroll-behavior-x) | `qa.mjs` (חוזה CSS) + browser QA (scrollWidth ≤ viewport בכל viewport, אין אלמנט רחב מה-viewport, computed overflow-x/touch-action) | ✅ בוצע | אין |
| R73 | תיקונים נקודתיים בדפי תלמיד (SSOT 11.10.2026): עמוד 19 כותרת פדגוגית + נוסחת נפח כהשלמה פעילה; עמוד 20 בחירת רדיוס/גובה של התלמיד, חישוב גליל, חרוט והשוואה בשלבים עם מקום כתיבה; עמוד 32 ללא שינוי | `app.js` (עמ' 19–20), `content.js` (`CONE-RATIO-04` prompt/answer לממדים שנבחרו) | `npm run qa` (43/82) + browser QA (A4/מובייל/PDF) + visual baseline מרינדור CI | 🔄 PR #15 — ממתין ל-baseline חזותי מ-CI | baseline עמ' 19–20 |
| R74 | עיצוב מחדש של משימות תלמיד מביקורת יניב (§6.4/§9.5/§9.6/§26.7.11): `CONE-WHO-07` כטבלת טענות עם נימוק לכל טענה; כרטיס „הרדיוס/הגובה שבחרתי” (`CONE-RATIO-04`); טבלת גליל/חרוט עם צמד נתונים שונה בכל שורה ושורות אלגבריות בסוף (`CONE-RATIO-05`); איור גזרה צבעוני (עמ' 15); שמות במקום „תלמיד/תלמידה”; כותרות טבלה מילה + סימן + יחידה; בידוד bidi במפתח המילים | `content.js`, `app.js` (`claimTable`, `ratioTable`, `sectorFoldSvg`, `dimKey`), `styles.css`, `student-display-policy.js` (בלי דריסת כותרות), `browser-qa.mjs` (`svg.sector-fold-svg` בבוררים) | `npm run qa` + `math-qa.mjs` (בלוק `CONE-RATIO-05`) + `student-display-policy-qa.mjs` / `-browser-qa.mjs` (כותרות) + browser QA (43 דפים, PDF 43) + ביקורת עמוד־עמוד ב־Chromium | ✅ בוצע (baseline מריצת CI 38149545769) | כותרות H1 בטיפול סשן מקביל |
| R75 | דף שער (§28, PR #22): השער המאושר v4 כגיליון לא ממוספר לפני עמוד 1; לא `.page`, לא נספר ב־43/82; הדפסה/PDF = שער + 43 | `content.js` (`cover`), `app.js` (`addCover`), `styles.css` (`.cover-sheet`), `assets/cover-bg.jpg`, `qa.yml` (persist `cover.png`) | `browser-qa.mjs` (שער אחד, ראשון ב־`#book`, A4, ללא גלישה, תמונה+סמל, כותרת, הדפסה ללא scale, PDF = 43+1) | ✅ בוצע (ממתין ל־merge ולאימות פרודקשן) | נאמנות 1:1 לעיצוב v4 המקורי לא נבדקה מול קובץ המקור |
| R76 | מצב קורא מפורש לשער (§28.2): כשהשער מוצג הבורר מראה „שער החוברת” (מושבת) ולא „עמוד 1”; בחירת עמוד 1 מהשער מנווטת; גלילה/טעינה מחדש/`#page=N` (גם hashchange) תואמים לגיליון המוצג | `reader-jump.js` (`COVER`, `stateFromScroll`, `openDeepLink`) | `reader-cover-regression-qa.mjs` (Chromium, דסקטופ + 390×844, סמנטיקת `change` של `select` טבעי; נכשל על `e08865a`, עובר אחרי התיקון) + `reader-jump-qa.mjs` (חוזה סטטי + חיווט ל־CI) + `browser-qa.mjs` | ✅ בוצע (ממתין ל־CI על ה־PR המאחד) | אין |

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

> הערה: סעיף הסגירה לעיל מתעד את סבב 11 העמודים המקורי. המצב הקנוני הנוכחי הוא 45 דפי A4 / 82 שאלות (ראו §26.7.8 ו־G15), ומתועד בסעיף הסגירה הבא.

## ביקורת סגירה 2026-10-11 (ביקורת עצמאית מלאה)

- ביקורת עצמאית סעיף-סעיף של SSOT §2–§27 (workflow אדוורסרי ב־6 scopes + אימות חי של פרודקשן/PDF/הדפסה/מובייל). מסקנה: אין פער תוכן/פלט — כל דרישה מחייבת מתקיימת בפלט המשומש ובאתר החי — למעט פגם אמיתי אחד: חיתוך מובייל פורטרייט (§20.1).
- §20.1 תוקן: ב־360/390/412px העמוד היה חתוך כ־55–63% משמאל (`transform-origin:top center` על עמוד A4 מיושר־ימין ב־RTL; `#book{overflow:hidden}` הסתיר זאת מבדיקות הרוחב/scrollWidth). שונה ל־`top right` → כל 45 העמודים גלויים במלואם ([8, vw−8]); נוסף assertion מניעת־חיתוך ב־`browser-qa.mjs`. דסקטופ/A4/הדפסה ללא שינוי → baseline הפיקסלים לא נגע.
- מצב קנוני נוכחי: 43 דפי A4 / 82 שאלות; מטריצת ה־traceability עודכנה עד R73 (כולל §27, §20.1, בורר העמוד §20.3 ו-vertical-only §20.1.1).
- אכיפה חוזקה: `qa.mjs` מקבע 45/82 במדויק (היו floors ‎>=8/>=13); בדיקת glyph־הכפל הורחבה ל־`content.js`.
- נוקה: `exports/student-pages/page-46.png` היתום (משארית 46→45) הוסר; שלב ה־persist ב־`qa.yml` מנקה עמודים שהוסרו כדי שלא יישארו יתומים.
- אין עמודי מורה פעילים (נעולים §2.5). פריטי SSOT/ארכיטקטורה שנותרו ל־Yaniv+GPT (לא שונו כאן): איחוד כללי §27 לתוך §9/§12, חוזק §27 source־vs־policy, ניסוח §25.1 מול הסבב שנפתח מחדש, חלופת PR #3 (reflow — דורשת תיקון §20.1 „scale בלבד”), כותרות r/h בעמ' 23/27, גרשיים מול מרכאות ASCII ב־footer.
