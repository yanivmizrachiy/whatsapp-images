const D=window.CONE_DATA;
const book=document.querySelector('#book');

const DISTRICT_LOGO='https://raw.githubusercontent.com/yanivmizrachiy/jerusalem/5dd97f6acfc3e3f95550ef1cb714d416261f174c/public/logo.png';
const PAGE1_ASSET_MAIN='https://raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/main/worksheets/assets/ayelet-original-cone.png';
const PAGE1_ASSET_PINNED='https://raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/7121dfeaa9d8dc9f4101eea155c23a24374a0a2a/worksheets/assets/ayelet-original-cone.png';
const footer=()=>`<footer class="gz-footer"><div class="footer-inner"><img class="district-logo" src="${DISTRICT_LOGO}" alt="סמל מחוז ירושלים"><div class="footer-copy"><div class="f1">${D.footer[0]}</div><div class="f2">${D.footer[1]}</div></div></div></footer>`;
// SSOT §18.3: page 1 carries the Ayelet credit line only (same blue rule + district logo).
const page1Footer=()=>`<footer class="gz-footer page1-credit"><div class="footer-inner"><img class="district-logo" src="${DISTRICT_LOGO}" alt="סמל מחוז ירושלים"><div class="footer-copy"><div class="f1">${D.page1Credit}</div></div></div></footer>`;
const header=(title,n)=>`<header class="page-header"><h1>${title}</h1><b>${n}</b></header>`;
const tex=(s)=>`\\(${s}\\)`;
const grid=(size='medium')=>`<div class="work-grid ${size}"></div>`;
const answerLine=(unit='')=>`<div class="final-answer">תשובה: <span></span>${unit?` <em>${unit}</em>`:''}</div>`;
const tableCell=(value,isVPi=false)=>value==null?'':(isVPi?tex(`${value}\\pi`):String(value));
const volumeTableRows=()=>D.volumeTableRows.map(row=>`<tr><td>${tableCell(row.r)}</td><td>${tableCell(row.d)}</td><td>${tableCell(row.h)}</td><td>${tableCell(row.vPi,true)}</td></tr>`).join('');
const q=id=>D.questions.find(item=>item.id===id)||null;
const prompt=id=>q(id)?.prompt||'';
// SSOT §26: colorful teaching comic and the imported 3D cone artwork.
const comic=()=>D.comicStrip||'';
const coneAsset=(name,alt,cls='')=>`<img class="cone-3d ${cls}" src="assets/${name}.svg" alt="${alt}">`;

// A multi-part question is rendered as independent student work units. The
// source wording is not changed: each part keeps its original Hebrew marker.
const splitHebrewSubsections=(text,letters=['א','ב','ג','ד'])=>{
  const hits=letters
    .map(letter=>({letter,index:text.indexOf(`${letter}. `)}))
    .filter(hit=>hit.index>=0)
    .sort((a,b)=>a.index-b.index);
  if(!hits.length)return {intro:text.trim(),parts:[]};
  return {
    intro:text.slice(0,hits[0].index).trim(),
    parts:hits.map((hit,i)=>({
      letter:hit.letter,
      text:text.slice(hit.index,i+1<hits.length?hits[i+1].index:text.length).trim()
    }))
  };
};
const renderSubpart=(part,{size='subpart-medium',unit='',extra=''}={})=>part?`<section class="subpart" data-subpart="${part.letter}"><div class="task subpart-task">${part.text}</div>${extra}${grid(size)}${answerLine(unit)}</section>`:'';
const findPart=(set,letter)=>set.parts.find(part=>part.letter===letter)||null;

const coneSvg=({r='r',h='h',slant='',large=false}={})=>`<svg class="cone-svg ${large?'cone-large':''}" viewBox="0 0 520 430" role="img" aria-label="חרוט ישר"><ellipse cx="260" cy="350" rx="178" ry="48" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><path d="M260 42 L82 350 M260 42 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="42" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3"/><circle cx="260" cy="42" r="5" fill="#111827"/><circle cx="260" cy="350" r="4" fill="#111827"/><text class="label" x="277" y="200">${h}</text><text class="label" x="344" y="338">${r}</text>${slant?`<text class="label" x="365" y="190">${slant}</text>`:''}</svg>`;
const waffleConeSvg=()=>`<svg class="cone-svg waffle-cone" viewBox="0 0 520 430" role="img" aria-label="גביע וופל בצורת חרוט ישר"><defs><pattern id="wafflePattern" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 0L24 24M24 0L0 24" fill="none" stroke="#d6b889" stroke-width="1.6"/></pattern></defs><path d="M260 42 L82 350 L438 350 Z" fill="#fff7ed"/><path d="M260 42 L82 350 L438 350 Z" fill="url(#wafflePattern)" opacity=".72"/><ellipse cx="260" cy="350" rx="178" ry="48" fill="#fffaf2" stroke="#1d4ed8" stroke-width="4"/><path d="M260 42 L82 350 M260 42 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="42" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3"/><circle cx="260" cy="42" r="5" fill="#111827"/><circle cx="260" cy="350" r="4" fill="#111827"/><text class="label" x="277" y="200">h</text><text class="label" x="344" y="338">6 ס״מ</text><text class="label" x="402" y="150">10 ס״מ</text></svg>`;
const axialSvg=()=>`<svg class="axial-svg" viewBox="0 0 520 310" role="img" aria-label="חתך צירי של חרוט"><path d="M260 35 L75 270 L445 270 Z" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><line x1="260" y1="35" x2="260" y2="270" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="270" x2="445" y2="270" stroke="#111827" stroke-width="3"/><text class="label" x="276" y="160">h</text><text class="label" x="350" y="258">r</text><text class="label" x="372" y="143">ℓ</text></svg>`;
const orientedConeSvg=(angle=0)=>`<svg class="orientation-cone" viewBox="0 0 260 240" role="img" aria-label="חרוט ישר במנח שונה"><g transform="rotate(${angle} 130 120)"><ellipse cx="130" cy="185" rx="72" ry="22" fill="#f8fafc" stroke="#1d4ed8" stroke-width="3"/><path d="M130 34 L58 185 M130 34 L202 185" fill="none" stroke="#1d4ed8" stroke-width="3"/><path d="M58 185 A72 22 0 0 1 202 185" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 5"/><line x1="130" y1="34" x2="130" y2="185" stroke="#475569" stroke-width="2.5" stroke-dasharray="6 5"/><circle cx="130" cy="34" r="4" fill="#111827"/><circle cx="130" cy="185" r="3" fill="#111827"/></g></svg>`;

// SSOT §26 expansion diagrams (deterministic, labels in safe zones, no multiply glyph).
// Identification strip (CONE-OBJ-01): five everyday objects for the student to circle.
const objectStripSvg=()=>`<svg class="object-strip-svg" viewBox="0 0 760 210" role="img" aria-label="חמישה חפצים לזיהוי: גביע וופל, קונוס תנועה, משפך, פחית שתייה וקובייה"><line x1="24" y1="156" x2="736" y2="156" stroke="#e2e8f0" stroke-width="2"/><g><circle cx="76" cy="40" r="18" fill="#fbcfe8" stroke="#db2777" stroke-width="2"/><ellipse cx="76" cy="58" rx="30" ry="9" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M46 58 L106 58 L76 150 Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><text x="76" y="190" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="14" font-weight="700" fill="#1e293b">גביע וופל</text></g><g><rect x="196" y="146" width="64" height="10" rx="3" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/><path d="M228 54 L206 146 L250 146 Z" fill="#fb923c" stroke="#c2410c" stroke-width="2"/><line x1="213" y1="116" x2="243" y2="116" stroke="#ffffff" stroke-width="8"/><text x="228" y="190" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="14" font-weight="700" fill="#1e293b">קונוס תנועה</text></g><g><ellipse cx="380" cy="58" rx="30" ry="9" fill="#e2e8f0" stroke="#475569" stroke-width="2"/><path d="M350 58 L410 58 L390 112 L370 112 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/><rect x="373" y="112" width="14" height="38" fill="#cbd5e1" stroke="#475569" stroke-width="2"/><text x="380" y="190" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="14" font-weight="700" fill="#1e293b">משפך</text></g><g><rect x="508" y="62" width="48" height="86" fill="#e2e8f0" stroke="#475569" stroke-width="2"/><rect x="508" y="92" width="48" height="26" fill="#ef4444" opacity="0.85"/><ellipse cx="532" cy="148" rx="24" ry="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/><ellipse cx="532" cy="62" rx="24" ry="8" fill="#f1f5f9" stroke="#475569" stroke-width="2"/><text x="532" y="190" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="14" font-weight="700" fill="#1e293b">פחית שתייה</text></g><g><path d="M666 90 L706 90 L706 150 L666 150 Z" fill="#bfdbfe" stroke="#1e40af" stroke-width="2"/><path d="M666 90 L686 74 L726 74 L706 90 Z" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><path d="M706 90 L726 74 L726 134 L706 150 Z" fill="#93c5fd" stroke="#1e40af" stroke-width="2"/><text x="696" y="190" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="14" font-weight="700" fill="#1e293b">קובייה</text></g></svg>`;
// Cone vs pyramid comparison (CONE-OBJ-04 and CONE-WHO-06): round base + curved mantle vs polygon base + flat faces.
const coneVsPyramidSvg=()=>`<svg class="compare-svg" viewBox="0 0 440 240" role="img" aria-label="השוואה בין חרוט לפירמידה"><g><ellipse cx="120" cy="168" rx="62" ry="18" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><path d="M120 40 L58 168 M120 40 L182 168" fill="none" stroke="#1d4ed8" stroke-width="3"/><path d="M58 168 A62 18 0 0 0 182 168" fill="none" stroke="#1d4ed8" stroke-width="3"/><path d="M58 168 A62 18 0 0 1 182 168" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="7 6"/><circle cx="120" cy="40" r="4" fill="#1e293b"/><text x="120" y="206" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="16" font-weight="800" fill="#1d4ed8">חרוט</text><text x="120" y="227" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="12" fill="#475569">בסיס עיגול · מעטפת עקומה</text></g><g><path d="M262 172 L320 154 L378 172 L320 190 Z" fill="#f0fdf4" stroke="#15803d" stroke-width="2"/><path d="M320 48 L262 172 M320 48 L378 172 M320 48 L320 190" fill="none" stroke="#15803d" stroke-width="3"/><path d="M320 48 L320 154" fill="none" stroke="#86efac" stroke-width="2" stroke-dasharray="7 6"/><circle cx="320" cy="48" r="4" fill="#1e293b"/><text x="320" y="206" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="16" font-weight="800" fill="#15803d">פירמידה</text><text x="320" y="227" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="12" fill="#475569">בסיס מצולע · פאות משולשות</text></g></svg>`;
// Cone net (CONE-WHO-02/04/05): sliced mantle (sector) + base circle, arc length = base circumference.
const coneNetSvg=()=>`<svg class="net-svg" viewBox="0 0 520 300" role="img" aria-label="פריסת חרוט: גזרת עיגול ובסיס עיגול"><path d="M120 150 L188.83 51.70 A120 120 0 0 1 188.83 248.30 Z" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><line x1="120" y1="150" x2="188.83" y2="51.70" stroke="#1d4ed8" stroke-width="2"/><circle cx="120" cy="150" r="3.5" fill="#111827"/><text x="112" y="154" text-anchor="end" font-family="Rubik,Arial,sans-serif" font-size="12" fill="#475569">קודקוד</text><text x="150" y="20" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="14" fill="#111827">מעטפת פרוסה — גזרה</text><text x="150" y="98" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="15" fill="#1d4ed8">ℓ</text><line x1="242" y1="150" x2="366" y2="175" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 5"/><text x="300" y="120" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="12" fill="#64748b">מתאימים זה לזה</text><circle cx="420" cy="175" r="52" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><line x1="420" y1="175" x2="472" y2="175" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/><circle cx="420" cy="175" r="3.5" fill="#111827"/><text x="446" y="168" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="13" fill="#475569">r</text><text x="420" y="108" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="14" fill="#111827">בסיס החרוט (עיגול)</text><text x="260" y="288" text-anchor="middle" font-family="Rubik,Arial,sans-serif" font-size="13" fill="#111827">אורך הקשת = היקף הבסיס = 2·π·r</text></svg>`;
// Cone views (CONE-VIEW): top view = circle, side view = isosceles triangle, bare triangle = ambiguous.
const topViewSvg=()=>`<svg class="top-view-svg" viewBox="0 0 260 250" role="img" aria-label="מבט מלמעלה על חרוט ישר — עיגול"><circle cx="130" cy="115" r="85" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><line x1="130" y1="115" x2="215" y2="115" stroke="#2563eb" stroke-width="2.6" stroke-dasharray="7 5"/><circle cx="130" cy="115" r="4.5" fill="#111827"/><text class="label" x="165" y="104">r</text><text class="label" x="130" y="238" text-anchor="middle">היקף הבסיס</text></svg>`;
const sideViewSvg=()=>`<svg class="side-view-svg" viewBox="0 0 280 245" role="img" aria-label="מבט מהצד על חרוט ישר — משולש שווה־שוקיים"><path d="M140 28 L55 200 L225 200 Z" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><line x1="92" y1="110" x2="104" y2="118" stroke="#1d4ed8" stroke-width="2.4"/><line x1="188" y1="110" x2="176" y2="118" stroke="#1d4ed8" stroke-width="2.4"/><text class="label" x="140" y="232" text-anchor="middle">בסיס = קוטר הבסיס</text></svg>`;
const bareTriangleSvg=()=>`<svg class="bare-triangle-svg" viewBox="0 0 240 210" role="img" aria-label="משולש שווה־שוקיים בלבד, ללא בסיס עגול"><path d="M120 24 L40 180 L200 180 Z" fill="#ffffff" stroke="#64748b" stroke-width="3.2"/></svg>`;
// Render helpers for the expansion pages.
const inlineBlanks=(id)=>prompt(id).replace(/_{3,}/g,'<span class="answer-line inline"></span>');
const sortTable=(id)=>`<table class="practice-table sort-table"><thead><tr><th>חפץ</th><th>חרוט / גליל / גוף אחר</th><th>נימוק קצר</th></tr></thead><tbody>${(q(id)?.sortRows||[]).map(n=>`<tr><td>${n}</td><td></td><td></td></tr>`).join('')}</tbody></table>`;
const claimCheckList=(id)=>{const full=prompt(id);const cut=full.indexOf('(1)');const intro=full.slice(0,cut).trim();const items=full.slice(cut).split(/\(\d+\)\s*/).map(s=>s.trim()).filter(Boolean);return `<div class="task first">${intro}</div><ul class="claim-list">${items.map(t=>`<li><span class="claim-box"></span><span class="claim-text">${t}</span></li>`).join('')}</ul>`;};
const addPage=(html,foot=footer)=>{const p=document.createElement('section');p.className='page';p.dataset.kind='student';p.innerHTML=html+foot();book.append(p);return p};
let pageNumber=1;
const nextHeader=title=>header(title,++pageNumber);

const page1Html=D.page1.replace(PAGE1_ASSET_MAIN,PAGE1_ASSET_PINNED);
addPage(`<div class="source-sheet">${page1Html}</div>`,page1Footer);

addPage(`${nextHeader('היכרות עם החרוט')}
<section class="definition intro-definition">חרוט הוא גוף המורכב מעיגול ונקודה שמחוץ למישור העיגול וכל הקטעים המחברים את הנקודה עם נקודות הנמצאות על היקף העיגול (מעגל). <strong>השלימו את שמות חלקי החרוט לפי השרטוט:</strong> הנקודה נקראת <span class="answer-line inline"></span> החרוט, העיגול נקרא <span class="answer-line inline"></span> החרוט. כל הקטעים הנ״ל יוצרים <span class="answer-line inline"></span> החרוט.</section>
${comic()}
<div class="intro-cone">${coneSvg({large:true})}</div>
<div class="task compact">${prompt('CONE-DEF-01')} <span class="answer-line short"></span></div>
<div class="task compact">${prompt('CONE-ID-01')}</div>`);

addPage(`${nextHeader('מסמנים את חלקי החרוט')}
<div class="task first">${prompt('CONE-PARTS-01')}</div>
<div class="parts-figure">${coneAsset('cone-3d-upright','חרוט ישר תלת־ממדי לסימון חלקיו')}<span class="callout c-apex"><span class="answer-line inline"></span></span><span class="callout c-mantle"><span class="answer-line inline"></span></span><span class="callout c-base"><span class="answer-line inline"></span></span></div>
<div class="task">${prompt('CONE-INVAR-01')}</div>${grid('medium')}${answerLine()}
<div class="task">${prompt('CONE-CLAIM-01')}</div>${grid('claim')}${answerLine()}`);

// ===== Expansion phase 2 (SSOT §26): graded identity/concept strands, after the parts page =====
// OBJ — identify & sort real objects as cones.
addPage(`${nextHeader('זיהוי ומיון חפצים בצורת חרוט')}
<div class="task first">${prompt('CONE-OBJ-01')}</div>
<div class="object-strip">${objectStripSvg()}</div>
${grid('small')}${answerLine()}
<div class="task">${prompt('CONE-OBJ-02')}</div>
${sortTable('CONE-OBJ-02')}
<div class="task">${inlineBlanks('CONE-OBJ-03')}</div>`);

addPage(`${nextHeader('חרוט מול גופים אחרים')}
<div class="task first">${prompt('CONE-OBJ-04')}</div>
<div class="compare-figure">${coneVsPyramidSvg()}</div>
${grid('medium')}${answerLine()}
<div class="task">${prompt('CONE-OBJ-05')}</div>
${grid('medium')}${answerLine()}`);

const objParts=splitHebrewSubsections(prompt('CONE-OBJ-06'),['א','ב','ג']);
const objPartB=findPart(objParts,'ב');
addPage(`${nextHeader('מחפץ אמיתי למודל החרוט')}
<div class="question-intro">${objParts.intro}</div>
${renderSubpart(findPart(objParts,'א'),{size:'subpart-small'})}
<section class="sketch-subpart"><div class="task subpart-task">${objPartB.text}</div><div class="sketch-box"></div></section>
${renderSubpart(findPart(objParts,'ג'),{size:'subpart-small'})}`);

// WHO — claim checking & correction (misconceptions), across three balanced pages.
addPage(`${nextHeader('מי צודק? בדיקת טענות ותיקון')}
<div class="concept-note">לפניכם טענות על החרוט. קראו כל טענה בעיון, הקיפו אם היא נכונה או לא נכונה, ונמקו. אם טענה אינה נכונה — כתבו את התיקון. היעזרו בשרטוט הפריסה שלפניכם.</div>
<div class="net-figure">${coneNetSvg()}</div>
<div class="task first">${prompt('CONE-WHO-01')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}
<div class="task">${prompt('CONE-WHO-02')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}`);

addPage(`${nextHeader('מי צודק? — טענות נוספות')}
<div class="task first">${prompt('CONE-WHO-03')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}
<div class="task">${prompt('CONE-WHO-04')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}
<div class="task">${prompt('CONE-WHO-05')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}`);

addPage(`${nextHeader('מי צודק? — חרוט מול פירמידה וסיכום')}
<div class="two-column"><div class="compare-figure">${coneVsPyramidSvg()}</div><div><div class="task first">${prompt('CONE-WHO-06')} <b>נכונה / לא נכונה</b></div>${grid('small')}${answerLine()}</div></div>
<div class="two-column"><div class="view-figure">${axialSvg()}</div><div>${claimCheckList('CONE-WHO-07')}${grid('large')}${answerLine()}</div></div>`);

// VIEW — top/side views and position.
addPage(`${nextHeader('מבטים של חרוט — מלמעלה ומהצד')}
<div class="concept-note">חרוט ישר עומד על בסיסו על השולחן. לפניכם שני מבטים על אותו חרוט — אחד מלמעלה ואחד מהצד.</div>
<div class="two-column"><div class="view-figure">${topViewSvg()}</div><div><div class="task first">${prompt('CONE-VIEW-01')}</div>${grid('medium')}${answerLine()}</div></div>
<div class="two-column"><div class="view-figure">${sideViewSvg()}</div><div><div class="task first">${prompt('CONE-VIEW-02')}</div>${grid('medium')}${answerLine()}</div></div>`);

addPage(`${nextHeader('תנוחה: החרוט על צדו')}
<div class="two-column"><div class="view-figure">${coneAsset('cone-3d-side','חרוט ישר מונח על צדו, הקודקוד בצד')}</div><div><div class="task first">${prompt('CONE-VIEW-03')}</div>${grid('claim')}${answerLine()}</div></div>
<div class="task sketch-task">${prompt('CONE-VIEW-04')}</div><div class="sketch-box"></div>
<div class="two-column"><div class="view-figure">${bareTriangleSvg()}</div><div><div class="task first">${prompt('CONE-VIEW-05')}</div>${grid('medium')}${answerLine()}</div></div>`);

addPage(`${nextHeader(`נפח חרוט — השלימו: ${tex('V=\\underline{\\hspace{28mm}}')}`)}
<div class="task">${prompt('CONE-VOL-01')}</div>${grid('medium')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-TAB-01')}</div>
<table class="practice-table"><thead><tr><th>${tex('r')}</th><th>${tex('d')}</th><th>${tex('h')}</th><th>${tex('V')}</th></tr></thead><tbody>${volumeTableRows()}</tbody></table>
<div class="work-caption">מרחב חישוב לטבלה</div>${grid('table-work')}`);

const convRow=q('CONE-TAB-CONV-01');
const approxRow=q('CONE-TAB-APPROX-01');
addPage(`${nextHeader('המרת יחידות וקירוב מספרי')}
<div class="task">${convRow.prompt}</div>
<table class="practice-table"><thead><tr><th>רדיוס נתון</th><th>${tex('r')} בס״מ</th><th>${tex('h')}</th><th>${tex('V')} מדויק</th></tr></thead><tbody><tr><td>${convRow.table.rGiven}</td><td></td><td>${convRow.table.h} ס״מ</td><td></td></tr></tbody></table>
<div class="work-caption">מרחב חישוב להמרה ולנפח</div>${grid('table-work')}${answerLine('סמ״ק')}
<div class="task">${approxRow.prompt}</div>
<table class="practice-table"><thead><tr><th>${tex('V')} מדויק</th><th>${tex('\\pi')}</th><th>${tex('V')} מקורב</th></tr></thead><tbody><tr><td>${tableCell(approxRow.table.vPiCoeff,true)}</td><td>${tex('\\approx 3.14')}</td><td></td></tr></tbody></table>
<div class="work-caption">מרחב חישוב לקירוב</div>${grid('medium')}${answerLine('סמ״ק')}`);

addPage(`${nextHeader('חתך צירי ומשפט פיתגורס')}
<div class="concept-note">חתך צירי של חרוט הוא משולש שווה שוקיים שקודקוד הראש שלו הוא קודקוד החרוט והבסיס שלו הוא קוטר העיגול.</div>
<div class="two-column"><div>${axialSvg()}</div><div><div class="task first">${prompt('CONE-PYT-01')}</div>${grid('pythagoras')}${answerLine('ס״מ')}</div></div>
<div class="task">${prompt('CONE-AX-01')}</div>${grid('axial-work')}${answerLine('סמ״ר')}
<div class="task sketch-task">${prompt('CONE-AX-SKETCH-01')}</div><div class="sketch-box"></div>`);

const conversionParts=splitHebrewSubsections(prompt('CONE-CONV-01'),['א','ב','ג']);
addPage(`${nextHeader(`נפח חרוט — השלימו: ${tex('\\pi\\approx\\underline{\\hspace{14mm}}')}`)}
<div class="question-intro">${conversionParts.intro}</div>
${renderSubpart(findPart(conversionParts,'א'),{size:'subpart-small'})}
${renderSubpart(findPart(conversionParts,'ב'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(conversionParts,'ג'),{size:'subpart-medium',unit:'סמ״ק'})}`);

const changeParts=splitHebrewSubsections(prompt('CONE-CHANGE-01'),['א','ב','ג','ד']);
addPage(`${nextHeader('חישוב הפוך ושינוי ממדים')}
<div class="task first">${prompt('CONE-REV-01')}</div>${grid('reverse')}${answerLine('ס״מ')}
<div class="question-intro change-intro">${changeParts.intro}</div>
${renderSubpart(findPart(changeParts,'א'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(changeParts,'ב'),{size:'subpart-medium',unit:'סמ״ק'})}`);

addPage(`${nextHeader('שינוי ממדים — המשך')}
${renderSubpart(findPart(changeParts,'ג'),{size:'subpart-medium',unit:'סמ״ק'})}
${renderSubpart(findPart(changeParts,'ד'),{size:'subpart-explain'})}`);

addPage(`${nextHeader('זיהוי חרוטים במנחים שונים')}
<div class="task first">${prompt('CONE-ORIENT-01')}</div>
<div class="orientation-grid"><div>${orientedConeSvg(0)}</div><div>${orientedConeSvg(90)}</div><div>${orientedConeSvg(180)}</div></div>
<div class="orientation-note">סמנו ישירות על כל שרטוט: בסיס, קודקוד, מעטפת וגובה.</div>
<div class="task sketch-task">${prompt('CONE-ORIENT-DRAW-01')}</div><div class="sketch-box orientation-sketch"></div>`);

const official=prompt('CURR-CONE-06');
const officialParts=splitHebrewSubsections(official,['א','ב','ג','ד']);
const officialA=findPart(officialParts,'א');
const officialB=findPart(officialParts,'ב');
const officialC=findPart(officialParts,'ג');
const officialD=findPart(officialParts,'ד');

addPage(`${nextHeader('שאלות מתוך תוכנית הלימודים')}
<div class="official-layout"><div class="official-question official-intro">${officialParts.intro}</div><div class="official-diagram">${waffleConeSvg()}</div></div>
${renderSubpart(officialA,{size:'official-part-a',unit:'ס״מ'})}
${renderSubpart(officialB,{size:'official-part-b',unit:'סמ״ק'})}`);

const comparisonTable=`<table class="comparison-table"><thead><tr><th></th><th>אפשרות א׳</th><th>אפשרות ב׳</th></tr></thead><tbody><tr><th>${tex('r')}</th><td></td><td></td></tr><tr><th>${tex('h')}</th><td></td><td></td></tr><tr><th>${tex('V')}</th><td></td><td></td></tr><tr><th>פי כמה מהנפח המקורי</th><td></td><td></td></tr></tbody></table>`;
addPage(`${nextHeader('שאלות מתוך תוכנית הלימודים — המשך')}
${renderSubpart(officialC,{size:'official-part-c',extra:comparisonTable})}
${renderSubpart(officialD,{size:'official-part-d',unit:'סמ״ק'})}`);

let idx=0;
const students=[...document.querySelectorAll('[data-kind="student"]')];
const reader=document.querySelector('.reader');
const counter=document.querySelector('#counter');
const prevBtn=document.querySelector('#prev');
const nextBtn=document.querySelector('#next');
const toggleBtn=document.querySelector('#view-toggle');

// Reader view: 'paged' shows one A4 page at a time (default, locked by QA);
// 'scroll' stacks every student page in one continuous flow for review.
// URL ?view=scroll|paged wins; otherwise the viewer's last explicit choice.
const VIEW_KEY='cone-reader-view';
const readStoredView=()=>{try{return localStorage.getItem(VIEW_KEY)}catch{return null}};
const storeView=(view)=>{try{localStorage.setItem(VIEW_KEY,view)}catch{}};
const urlView=new URLSearchParams(location.search).get('view');
let scrollView=urlView?urlView==='scroll':readStoredView()==='scroll';

function updateCounter(){counter.textContent=`${idx+1} / ${students.length}`;prevBtn.disabled=idx===0;nextBtn.disabled=idx===students.length-1}
function show(){
  document.body.classList.toggle('scroll-view',scrollView);
  toggleBtn.setAttribute('aria-pressed',String(scrollView));
  toggleBtn.textContent=scrollView?'דף אחד':'כל הדפים';
  students.forEach((p,i)=>p.hidden=scrollView?false:i!==idx);
  updateCounter();fitPage();
}
function fitPage(){if(innerWidth>850){book.style.removeProperty('--page-scale');return}book.style.setProperty('--page-scale',Math.min(1,(innerWidth-16)/794))}
function scrollToPage(i){const top=students[i].getBoundingClientRect().top+scrollY-reader.offsetHeight-8;scrollTo({top:Math.max(0,top)})}
function goTo(i){idx=Math.max(0,Math.min(students.length-1,i));show();if(scrollView)scrollToPage(idx)}

// In scroll view the counter follows the page that occupies most of the viewport
// below the sticky reader bar (11 rect reads per scroll event: negligible).
const visibleHeight=p=>{const r=p.getBoundingClientRect();return Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,reader.offsetHeight))};
function syncCounterToScroll(){
  if(!scrollView)return;
  let best=idx,bestH=-1;
  students.forEach((p,i)=>{const h=visibleHeight(p);if(h>bestH){bestH=h;best=i}});
  if(best!==idx){idx=best;updateCounter()}
}
addEventListener('scroll',syncCounterToScroll,{passive:true});

prevBtn.onclick=()=>goTo(idx-1);
nextBtn.onclick=()=>goTo(idx+1);
toggleBtn.onclick=()=>{
  scrollView=!scrollView;
  storeView(scrollView?'scroll':'paged');
  const next=new URL(location.href);next.searchParams.set('view',scrollView?'scroll':'paged');history.replaceState(null,'',next);
  show();
  if(scrollView)scrollToPage(idx);else scrollTo({top:0});
};
addEventListener('resize',fitPage);
show();
