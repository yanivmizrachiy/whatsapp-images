window.CONE_DATA = {
  footer: [
    'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים',
    'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין'
  ],
  page1Credit: 'איילת קריספין - מתכללת את תחום המתמטיקה במחוז ירושלים והעיר ירושלים - מנח"י',
  // Colorful teaching comic (integrated from the harut companion workbook, byte-faithful
  // to razpages). Anis the proud cone learns base → height/radius/slant. SSOT §26.
  comicStrip: `<div class="comic-strip" role="group" aria-label="קומיקס: אניס החרוט לומד על חלקי החרוט">
    <div class="comic-panel"><div class="panel-num">1</div><div class="panel-bubble">„אניס, המורה למתמטיקה התקשרה... היא אמרה שחסר לך <b>בסיס</b>!”</div>
      <svg class="comic-scene" viewBox="0 0 320 220" role="img" aria-label="אבא חרוט ואמא חרוט מודאגים"><rect x="0" y="0" width="320" height="220" fill="#f8fafc"></rect><line x1="20" y1="185" x2="300" y2="185" stroke="#cbd5e1" stroke-width="3"></line><g transform="translate(65, 38)"><path d="M50 15 L10 135 Q50 155 90 135 Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2.5"></path><ellipse cx="50" cy="135" rx="40" ry="12" fill="#2563eb" stroke="#1e3a8a" stroke-width="2"></ellipse><circle cx="39" cy="65" r="9" fill="none" stroke="#1e293b" stroke-width="2.2"></circle><circle cx="61" cy="65" r="9" fill="none" stroke="#1e293b" stroke-width="2.2"></circle><line x1="48" y1="65" x2="52" y2="65" stroke="#1e293b" stroke-width="2.2"></line><circle cx="39" cy="65" r="3" fill="#1e293b"></circle><circle cx="61" cy="65" r="3" fill="#1e293b"></circle><path d="M42 90 Q50 82 58 90" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"></path><text x="50" y="162" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="12" font-weight="700" fill="#1e3a8a">אבא חרוט</text></g><g transform="translate(175, 38)"><path d="M50 15 L10 135 Q50 155 90 135 Z" fill="#ec4899" stroke="#9d174d" stroke-width="2.5"></path><ellipse cx="50" cy="135" rx="40" ry="12" fill="#db2777" stroke="#9d174d" stroke-width="2"></ellipse><path d="M43 15 L50 20 L57 15 L50 25 Z" fill="#fbbf24"></path><circle cx="40" cy="65" r="3.5" fill="#1e293b"></circle><circle cx="60" cy="65" r="3.5" fill="#1e293b"></circle><path d="M44 86 Q50 82 56 86" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"></path><text x="50" y="162" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="12" font-weight="700" fill="#9d174d">אמא חרוט</text></g></svg></div>
    <div class="comic-panel"><div class="panel-num">2</div><div class="panel-bubble">„מה פתאום חסר בסיס?! תסתכלו עלי — יש לי <b>בסיס מעגלי מושלם</b>, יציב ושטוח!”</div>
      <svg class="comic-scene" viewBox="0 0 320 220" role="img" aria-label="אניס מציג את בסיס החרוט שלו"><rect x="0" y="0" width="320" height="220" fill="#eff6ff"></rect><line x1="20" y1="185" x2="300" y2="185" stroke="#93c5fd" stroke-width="3"></line><g transform="translate(115, 25)"><ellipse cx="45" cy="140" rx="48" ry="16" fill="#fde68a" stroke="#d97706" stroke-width="2.5" stroke-dasharray="4 2"></ellipse><path d="M45 10 L8 140 Q45 162 82 140 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"></path><ellipse cx="45" cy="140" rx="37" ry="11" fill="#d97706" stroke="#b45309" stroke-width="1.8"></ellipse><circle cx="34" cy="62" r="6" fill="#fff"></circle><circle cx="56" cy="62" r="6" fill="#fff"></circle><circle cx="35" cy="62" r="3" fill="#1e293b"></circle><circle cx="55" cy="62" r="3" fill="#1e293b"></circle><path d="M35 84 Q45 98 55 84" fill="#fee2e2" stroke="#b45309" stroke-width="2.2" stroke-linecap="round"></path><path d="M102 125 L75 138" stroke="#dc2626" stroke-width="2.5"></path><text x="105" y="122" font-family="'Rubik', sans-serif" font-size="12" font-weight="800" fill="#dc2626">הבסיס שלי!</text><text x="45" y="172" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="13" font-weight="800" fill="#b45309">אניס הגאה</text></g></svg></div>
    <div class="comic-panel"><div class="panel-num">3</div><div class="panel-bubble">„נכון מאוד, אניס! ועכשיו בוא נלמד על <b>הגובה</b>, <b>הרדיוס</b> ו<b>הקו היוצר</b>!”</div>
      <svg class="comic-scene" viewBox="0 0 320 220" role="img" aria-label="אמא חרוט מסבירה על חלקי החרוט"><rect x="0" y="0" width="320" height="220" fill="#f0fdf4"></rect><line x1="20" y1="185" x2="300" y2="185" stroke="#86efac" stroke-width="3"></line><g transform="translate(130, 20)"><path d="M70 20 L25 140 Q70 162 115 140 Z" fill="#dcfce7" stroke="#15803d" stroke-width="2"></path><ellipse cx="70" cy="140" rx="45" ry="12" fill="none" stroke="#15803d" stroke-width="1.8"></ellipse><line x1="70" y1="20" x2="70" y2="140" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"></line><line x1="70" y1="140" x2="115" y2="140" stroke="#2563eb" stroke-width="2"></line><text x="63" y="85" text-anchor="end" font-family="'Rubik', sans-serif" font-size="11" font-weight="700" fill="#dc2626">גובה</text><text x="92" y="156" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="11" font-weight="700" fill="#2563eb">רדיוס</text><text x="100" y="75" text-anchor="start" font-family="'Rubik', sans-serif" font-size="11" font-weight="700" fill="#15803d">יוצר</text></g><g transform="translate(25, 55)"><path d="M30 15 L8 95 Q30 110 52 95 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"></path><circle cx="24" cy="50" r="2.5" fill="#1e293b"></circle><circle cx="36" cy="50" r="2.5" fill="#1e293b"></circle><path d="M25 65 Q30 72 35 65" fill="none" stroke="#b45309" stroke-width="1.8"></path><text x="30" y="115" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="11" font-weight="700" fill="#b45309">מקשיב ולומד</text></g></svg></div>
    <div class="comic-panel"><div class="panel-num">4</div><div class="panel-bubble">„יש! קיבלתי <b>100</b> במבחן! מעכשיו יש לי <b>בסיס חזק</b> בכל החרוטים!”</div>
      <svg class="comic-scene" viewBox="0 0 320 220" role="img" aria-label="אניס מקבל 100 במבחן"><rect x="0" y="0" width="320" height="220" fill="#fefce8"></rect><line x1="20" y1="185" x2="300" y2="185" stroke="#fde047" stroke-width="3"></line><g transform="translate(60, 25)"><path d="M45 10 L8 140 Q45 162 82 140 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"></path><ellipse cx="45" cy="140" rx="37" ry="11" fill="#d97706" stroke="#b45309" stroke-width="1.8"></ellipse><text x="33" y="66" font-size="14" text-anchor="middle">★</text><text x="57" y="66" font-size="14" text-anchor="middle">★</text><path d="M30 84 Q45 106 60 84 Z" fill="#ef4444" stroke="#b45309" stroke-width="2"></path><path d="M12 70 Q-10 40 5 30" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"></path><path d="M78 70 Q100 40 85 30" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"></path></g><g transform="translate(175, 45)"><rect x="0" y="0" width="85" height="110" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="2"></rect><line x1="12" y1="20" x2="50" y2="20" stroke="#cbd5e1" stroke-width="2"></line><line x1="12" y1="32" x2="70" y2="32" stroke="#cbd5e1" stroke-width="2"></line><line x1="12" y1="44" x2="65" y2="44" stroke="#cbd5e1" stroke-width="2"></line><circle cx="58" cy="78" r="20" fill="none" stroke="#dc2626" stroke-width="2.5"></circle><text x="58" y="85" text-anchor="middle" font-family="'Rubik', sans-serif" font-size="18" font-weight="900" fill="#dc2626">100</text><text x="25" y="98" font-family="'Rubik', sans-serif" font-size="10" font-weight="700" fill="#15803d">מצוין!</text></g></svg></div>
  </div>`,
  page1: `<h1 class="ayelet-source-title">דף מלווה המחשה</h1>

      <p class="ayelet-equipment"><strong>ציוד:</strong> פלסטלינה, קשיות השוות באורכן, מספרים, שמרדף, דף שבו מצוירים מעגלים.</p>
      <div class="ayelet-source-steps">
        <p>• צרו  מהפלסטלינה  נחש ,והניחו אותו על היקף המעגל.</p>
        <p>• הניחו מספר קשיות כך שקצה אחד של הקשית יונח על שפת המעגל</p>
        <p>• חברו את כל הקצוות האחרות  לנקודה אחת, ולאחר מכן חברו אותן עם כדור קטן של פלסטלינה</p>
      </div>

      <section class="ayelet-question-block">
        <p>1.</p>
        <p>1. מה קיבלתם?</p>
        <p class="ayelet-answer-line">________________________</p>
        <p>רשמו בלוח המחיק מה מאפיין את הצורה שקיבלתם?</p>
        <p class="ayelet-answer-line wide">_______________________________________________</p>
        <p>2. אילו חפצים  אתם מכירים  שנראים בצורה זו?</p>
        <p class="ayelet-answer-line wide">__________________________________________</p>
      </section>

      <section class="ayelet-middle-source">
        <div class="ayelet-middle-text">
          <p class="ayelet-source-emphasis">הצורה שקיבלתם נקראת חרוט.</p>
          <p>2 א.   תארו במילים שלכם אך יצרתם את החרוט?</p>
          <p class="ayelet-answer-line wide">_____________________________________________</p>
          <p>ב.    התבוננו  בחרוטים שבנו חברי הקבוצה</p>
          <p>כתבו  אילו  צורות  הנדסיות  בונות את החרוט?</p>
          <p class="ayelet-answer-line wide">__________________________________________</p>
        </div>
        <img class="ayelet-original-cone" data-source-visual="ayelet-original-cone" src="https://raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/main/worksheets/assets/ayelet-original-cone.png" width="148" height="215" alt="איור החרוט האדום המקורי מתוך דף המקור של איילת קריספין">
      </section>

      <section class="ayelet-math-source">
        <h2>נכתוב בכתיב מתמטי</h2>
        <p>בסיס החרוט הוא  - מעגל</p>
        <p>הנקודה שבה נפגשים כל הקטעים (הקשיות) נקראת -קודקוד החרוט</p>
        <p>קטע המחבר נקודה על המעגל אל קודקוד החרוט נקרא- הקו היוצר</p>
      </section>

      <section class="ayelet-definition-source">
        <h2>השלימו את הגדרת החרוט</h2>
        <p>חרוט הוא גוף תלת מימדי  שיש לו בסיס בצורת _________. לחרוט  קודקוד יחיד הנמצא ___________הבסיס.</p>
        <p>כאשר כל הקטעים המחברים את שפת הבסיס לקודקוד  נקראים ___________.</p>
        <p>האנך המורד מקודקוד החרוט אל מישור הבסיס נקרא גובה החרוט .</p>
      </section>`,
  volumeTableRows: [
    { id: 'A', r: 3, d: null, h: 8, vPi: null },
    { id: 'B', r: null, d: 8, h: 12, vPi: null },
    { id: 'C', r: 5, d: null, h: 12, vPi: null },
    { id: 'D', r: 3, d: null, h: null, vPi: 18 },
    { id: 'E', r: null, d: 10, h: null, vPi: 50 }
  ],
  questions: [
    {
      id: 'CONE-DEF-01',
      prompt: 'השלימו: בחרוט ישר הקטע שמחבר את הקודקוד עם מרכז העיגול הוא ________ של החרוט.',
      answer: 'גובה'
    },
    {
      id: 'CONE-ID-01',
      prompt: 'סמנו בשרטוט את בסיס החרוט, קודקוד החרוט, מעטפת החרוט וגובה החרוט.',
      answer: 'הבסיס הוא העיגול; הקודקוד הוא הנקודה שמחוץ למישור הבסיס; המעטפת נוצרת מכל הקטעים המחברים את הקודקוד עם נקודות על היקף הבסיס; בחרוט ישר הגובה מחבר את הקודקוד עם מרכז העיגול.'
    },
    {
      id: 'CONE-VOL-01',
      prompt: 'רדיוס בסיס החרוט הוא 3 ס״מ וגובהו 8 ס״מ. חשבו את נפח החרוט והשאירו את π בתשובה.',
      answer: 'V = (1/3)·π·3²·8 = 24π סמ״ק'
    },
    {
      id: 'CONE-TAB-01',
      prompt: 'השלימו את הטבלה. בכל שורה השתמשו בנתונים הקיימים כדי למצוא את הגדלים החסרים.',
      answer: 'שורה א: d=6, V=24π סמ״ק; שורה ב: r=4, V=64π סמ״ק; שורה ג: d=10, V=100π סמ״ק; שורה ד: d=6, h=6; שורה ה: r=5, h=6.'
    },
    {
      id: 'CONE-PYT-01',
      prompt: 'בחתך צירי של חרוט ישר רדיוס הבסיס 6 ס״מ ואורך הקו היוצר 10 ס״מ. חשבו את גובה החרוט. היעזרו במשפט פיתגורס.',
      answer: 'h²+6²=10² ולכן h²=64, h=8 ס״מ.'
    },
    {
      id: 'CONE-AX-01',
      prompt: 'רדיוס בסיס חרוט ישר הוא 6 ס״מ וגובהו 8 ס״מ. חשבו את שטח החתך הצירי.',
      answer: 'בסיס המשולש הוא קוטר 12 ס״מ וגובהו 8 ס״מ, לכן השטח 48 סמ״ר.'
    },
    {
      id: 'CONE-AX-SKETCH-01',
      prompt: 'סרטטו חתך צירי של חרוט ישר. סמנו בשרטוט את הגובה h, את רדיוס הבסיס r ואת הקו היוצר ℓ.',
      answer: 'החתך הצירי הוא משולש שווה־שוקיים. בסיסו הוא קוטר 2r, הגובה h יורד מקודקוד החרוט לאמצע הבסיס, והקו היוצר ℓ הוא אחת משוקי המשולש.'
    },
    {
      id: 'CONE-CONV-01',
      prompt: 'רדיוס בסיס החרוט הוא 0.5 מטר וגובהו 120 ס״מ. א. המירו את המידות לסנטימטרים. ב. לפני החישוב המדויק, שערו האם נפח החרוט קרוב יותר ל־300,000 סמ״ק או ל־600,000 סמ״ק. ג. חשבו את נפח החרוט בעזרת π ≈ 3.14 ובדקו את האומדן.',
      answer: '0.5 מטר = 50 ס״מ. מקדם π בנפח הוא (1/3)·50²·120 = 100000, ולכן מאחר ש־π≈3 הנפח קרוב ל־300000 סמ״ק. בחישוב עם π≈3.14 מתקבל V≈314000 סמ״ק, ולכן האומדן 300000 סמ״ק מתאים.'
    },
    {
      id: 'CONE-REV-01',
      prompt: 'נפח חרוט הוא 48π סמ״ק וגובהו 9 ס״מ. חשבו את רדיוס הבסיס.',
      answer: '48π=(1/3)·π·r²·9, לכן 48=3r², r²=16 ולכן r=4 ס״מ.'
    },
    {
      id: 'CONE-CHANGE-01',
      prompt: 'בחרוט ישר רדיוס הבסיס 3 ס״מ וגובהו 8 ס״מ. א. חשבו את הנפח והשאירו את π בתשובה. ב. השאירו את הרדיוס 3 ס״מ והגדילו את הגובה ל־16 ס״מ. חשבו את הנפח החדש וקבעו פי כמה השתנה. ג. החזירו את הגובה ל־8 ס״מ והגדילו את הרדיוס ל־6 ס״מ. חשבו את הנפח החדש וקבעו פי כמה השתנה. ד. כתבו מסקנה: כיצד הכפלת הגובה פי 2 וכיצד הכפלת הרדיוס פי 2 משפיעות על נפח החרוט?',
      answer: 'א. V=24π סמ״ק. ב. V=48π סמ״ק, ולכן הנפח גדל פי 2. ג. V=96π סמ״ק, ולכן הנפח גדל פי 4. ד. כאשר הרדיוס קבוע, הכפלת הגובה פי 2 מכפילה את הנפח פי 2; כאשר הגובה קבוע, הכפלת הרדיוס פי 2 מכפילה את r² פי 4 ולכן את הנפח פי 4.'
    },
    {
      id: 'CONE-TAB-CONV-01',
      prompt: 'השלימו את השורה. תחילה המירו את הרדיוס לסנטימטרים, ואז חשבו את נפח החרוט והשאירו את π בתשובה.',
      table: { rGiven: '0.2 מ׳', rCm: 20, h: 30, vPiCoeff: 4000 },
      answer: 'הרדיוס 0.2 מ׳ = 20 ס״מ. הנפח: V = (1/3)·π·20²·30 = 4000π סמ״ק.'
    },
    {
      id: 'CONE-TAB-APPROX-01',
      prompt: 'בשורה זו נפח החרוט כבר נתון בצורה מדויקת עם π. כתבו שוב את התוצאה המדויקת, ואז חשבו ערך מקורב בעזרת π ≈ 3.14. שימו לב: תשובה מדויקת נכתבת עם הסימן = וערך מקורב נכתב עם הסימן ≈.',
      table: { vPiCoeff: 50, piApprox: 3.14, approx: 157 },
      answer: 'הנפח המדויק הוא 50π סמ״ק. בקירוב: 50π ≈ 50·3.14 = 157, ולכן V ≈ 157 סמ״ק.'
    },
    {
      id: 'CONE-ORIENT-01',
      prompt: 'בכל אחד מהשרטוטים סמנו את בסיס החרוט, קודקוד החרוט, מעטפת החרוט וגובה החרוט. שימו לב: כיוון החרוט במרחב אינו משנה את שמות חלקיו.',
      answer: 'בכל שרטוט הבסיס הוא העיגול, הקודקוד הוא הנקודה שמחוץ למישור הבסיס, המעטפת היא המשטח הנוצר מן הקטעים המחברים את הקודקוד עם נקודות על היקף הבסיס, והגובה בחרוט ישר הוא הקטע המחבר את הקודקוד עם מרכז הבסיס.'
    },
    {
      id: 'CONE-ORIENT-DRAW-01',
      prompt: 'סרטטו חרוט ישר במנח שונה משלושת השרטוטים. סמנו בו את בסיס החרוט, קודקוד החרוט, מעטפת החרוט וגובה החרוט.',
      answer: 'כל שרטוט של חרוט ישר במנח שונה מתקבל, בתנאי שהבסיס מסומן כעיגול/אליפסה בפרספקטיבה, הקודקוד מחוץ למישור הבסיס, המעטפת מחברת את הקודקוד להיקף הבסיס, והגובה מחבר את הקודקוד עם מרכז הבסיס.'
    },
    {
      id: 'CONE-PARTS-01',
      prompt: 'התבוננו בשרטוט החרוט. כתבו בכל תיבה את שם החלק המתאים: בסיס החרוט, קודקוד החרוט או מעטפת החרוט.',
      answer: 'התיבה אל העיגול התחתון — בסיס החרוט; התיבה אל הנקודה שמחוץ למישור הבסיס — קודקוד החרוט; התיבה אל המשטח המשופע — מעטפת החרוט.'
    },
    {
      id: 'CONE-INVAR-01',
      prompt: 'איזו תכונה עוזרת לזהות חרוט ואינה תלויה בכיוון שבו מניחים אותו? סמנו את כל המידע הגאומטרי הנכון: בסיס בצורת עיגול · קיום קודקוד יחיד · מעטפת מעוגלת · צבע הגוף · מיקום הקודקוד למעלה בציור.',
      answer: 'מזהים חרוט לפי בסיס בצורת עיגול, קודקוד יחיד מחוץ למישור הבסיס ומעטפת מעוגלת. צבע הגוף ומיקום הקודקוד בציור תלויים בתנוחה או בעיצוב ואינם מידע גאומטרי מזהה.'
    },
    {
      id: 'CONE-CLAIM-01',
      prompt: 'בדיקת טענה ותיקונה. נתונה הטענה: „לחרוט יש שני בסיסים עגולים כמו לגליל, אך אחד מהם קטן מאוד.” האם הטענה נכונה? הסבירו, וציינו איזה חלק של החרוט זוהה כאן בטעות כבסיס.',
      answer: 'הטענה אינה נכונה. לחרוט בסיס עגול אחד בלבד וקודקוד יחיד מולו. ה„בסיס הקטן” שתואר בטעות הוא הקודקוד — נקודה ולא עיגול.'
    },
    {
      id: 'CURR-CONE-06',
      source: 'תוכנית הלימודים לכיתה ח׳, עמ׳ 17–18, שאלה 6',
      locked: true,
      prompt: '6. לכבוד פתיחת הקיץ, גלידרייה "הצורה המתוקה" השיקה גביע וופל חדש בצורת חרוט. המוכר טוען שהגביע החדש מכיל הרבה יותר גלידה מהגביע הסטנדרטי, אבל תלמידים שהגיעו למקום החליטו לבדוק את זה בעזרת המתמטיקה שלמדו. כדי שהגלידה לא תנזול, חשוב שהכדור הראשון ייכנס לפחות בחציו לתוך חלל החרוט. לכן, המידות המדויקות של הגביע הן קריטיות. לפניכם נתונים של גביע ה"מיני-מקס" החדש (ראו איור): - רדיוס פתח הגביע 6 ס"מ. - אורך הוואפל מהשפה העליונה עד קודקוד הרוט (הקצה התחתון של הגביע) הוא 10 ס"מ. א. הגלידרייה צריכה לדעת מה גובה הגביע (h) כדי להתאים לו מתקני עמידה. התבוננו בחתך הצירי של הגביע. חשבו את גובה הגביע (h היעזרו במשפט פיתגורס.). ב. חשבו כמה סמ"ק גלידה יכולה להיכנס בתוך חלל הגביע (לא כולל הכדורים שבולטים מעל). ג. בעל הגלידרייה רוצה להציע גביע "משפחתי" ענק. הוא מתלבט בין שתי אפשרויות: אפשרות א\': להגדיל את גובה הגביע פי 2 ולהשאיר את הרדיוס ללא שינוי. אפשרות ב\': להגדיל את רדיוס הגביע פי 2 ולהשאיר את הגובה שחישבתם בסעיף א\' ללא שינוי. בעל הגלידרייה אומר: "בשתי האפשרויות הגדלתי מידה אחת פי 2, אז בשתיהן הנפח יגדל באותה מידה". האם הוא צודק? הסבירו. ד. חשבו את הנפח עבור אפשרות ב\'. פי כמה הוא גדול מהנפח המקורי שמצאתם בסעיף ב\'? (מומלץ לקיים דיון מדוע השינוי ברדיוס משפיע בצורה משמעותית יותר.)',
      answer: 'א. בחתך הצירי מתקבל משולש ישר-זווית שחצי בסיסו 6 ס"מ, היתר 10 ס"מ והגובה h. לכן h²+6²=10², h²=64 ולכן h=8 ס"מ. ב. V=(1/3)·π·6²·8=96π סמ"ק ≈ 301.44 סמ"ק. ג. לא. הכפלת h פי 2 מכפילה את הנפח פי 2; הכפלת r פי 2 מגדילה את r² פי 4 ולכן את הנפח פי 4. ד. r=12, h=8: V=(1/3)·π·12²·8=384π סמ"ק ≈ 1205.76 סמ"ק, פי 4 מהנפח המקורי.'
    }
  ]
};