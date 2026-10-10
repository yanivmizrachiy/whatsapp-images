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
// Net options (CONE-NET-01): 1 = sector+base circle (closes), 2 = sector only, 3 = rectangle+circle (rolls to a cylinder).
const coneNetOptionsSvg=()=>`<svg class="net-options-svg" viewBox="0 0 680 250" role="img" aria-label="שלוש פריסות מסומנות 1, 2 ו־3 לבדיקה איזו נסגרת לחרוט"><line x1="24" y1="212" x2="656" y2="212" stroke="#e2e8f0" stroke-width="2"/><text x="110" y="30" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="20" font-weight="800" fill="#1e293b">1</text><path d="M110 64 L154.7 127.9 A78 78 0 0 1 65.3 127.9 Z" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.6"/><circle cx="110" cy="180" r="22" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2.6"/><text x="340" y="30" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="20" font-weight="800" fill="#1e293b">2</text><path d="M340 64 L384.7 127.9 A78 78 0 0 1 295.3 127.9 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2.6"/><text x="570" y="30" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="20" font-weight="800" fill="#1e293b">3</text><rect x="520" y="70" width="100" height="70" fill="#dcfce7" stroke="#15803d" stroke-width="2.6"/><circle cx="570" cy="182" r="22" fill="#f0fdf4" stroke="#15803d" stroke-width="2.6"/></svg>`;
// Net with label boxes (CONE-NET-02): student names the sector (מעטפת) and circle (בסיס).
const coneNetFigureSvg=()=>`<svg class="net-label-svg" viewBox="0 0 460 300" role="img" aria-label="פריסת חרוט לסימון שמות החלקים: גזרת עיגול ועיגול"><path d="M120 70 L170.3 150.6 A95 95 0 0 1 69.7 150.6 Z" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/><circle cx="330" cy="140" r="46" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><line x1="120" y1="118" x2="120" y2="208" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5 4"/><rect x="60" y="210" width="120" height="36" rx="5" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/><line x1="330" y1="186" x2="330" y2="208" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5 4"/><rect x="270" y="210" width="120" height="36" rx="5" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/></svg>`;
// Two sectors, same radius, longer arc on ב (CONE-NET-04): bigger arc → bigger base circumference.
const coneSectorCompareSvg=()=>`<svg class="sector-compare-svg" viewBox="0 0 460 250" role="img" aria-label="שתי גזרות עיגול באותו רדיוס; לגזרה ב׳ קשת ארוכה יותר"><path d="M120 55 L150.8 139.6 A90 90 0 0 1 89.2 139.6 Z" fill="#fde68a" stroke="#d97706" stroke-width="2.8"/><text x="120" y="182" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="20" font-weight="800" fill="#b45309">א</text><path d="M330 55 L387.9 123.9 A90 90 0 0 1 272.1 123.9 Z" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.8"/><text x="330" y="182" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="20" font-weight="800" fill="#1d4ed8">ב</text></svg>`;
// Sector with the sector-angle α marked (CONE-NET-05): smaller angle → narrower base.
const coneSectorAngleSvg=()=>`<svg class="sector-angle-svg" viewBox="0 0 420 260" role="img" aria-label="גזרת עיגול עם סימון זווית הגזרה אלפא"><path d="M210 60 L244 164.6 A110 110 0 0 1 176 164.6 Z" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.8"/><path d="M220.5 92.3 A34 34 0 0 1 199.5 92.3" fill="none" stroke="#4338ca" stroke-width="2.4"/><text x="210" y="116" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#4338ca">α</text></svg>`;
// Large single sector for the unrolled mantle (CONE-SEC): radius = slant s, arc = base circumference, angle α.
const sectorSvg=()=>`<svg class="sector-svg" viewBox="0 0 460 360" role="img" aria-label="מעטפת פרוסה — גזרת עיגול עם רדיוס שווה לקו היוצר וקשת שווה להיקף הבסיס"><path d="M230 70 L320 225.9 A180 180 0 0 1 140 225.9 Z" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3.2"/><path d="M253 109.8 A46 46 0 0 1 207 109.8" fill="none" stroke="#1d4ed8" stroke-width="2.4"/><text x="230" y="132" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#1d4ed8">α</text><text x="296" y="150" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#1d4ed8">s</text><text x="230" y="300" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="15" font-weight="700" fill="#475569">הקשת = היקף הבסיס</text></svg>`;
// Cone with three parallel cuts א/ב/ג (CONE-CUT-03): closer to the base → larger circle.
const coneCutsSvg=()=>`<svg class="cone-cuts-svg" viewBox="0 0 420 360" role="img" aria-label="חרוט ישר עם שלושה חתכים מקבילים לבסיס, מסומנים א, ב, ג"><ellipse cx="210" cy="300" rx="140" ry="34" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3.5"/><path d="M210 30 L70 300 M210 30 L350 300" fill="none" stroke="#1d4ed8" stroke-width="3.5"/><path d="M70 300 A140 34 0 0 0 350 300" fill="none" stroke="#1d4ed8" stroke-width="3.5"/><path d="M70 300 A140 34 0 0 1 350 300" fill="none" stroke="#64748b" stroke-width="2.2" stroke-dasharray="8 6"/><line x1="210" y1="30" x2="210" y2="300" stroke="#475569" stroke-width="2.4" stroke-dasharray="7 6"/><ellipse cx="210" cy="110" rx="41.5" ry="10" fill="none" stroke="#dc2626" stroke-width="2.6"/><text x="267" y="115" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#dc2626">א</text><ellipse cx="210" cy="190" rx="83" ry="18" fill="none" stroke="#dc2626" stroke-width="2.6"/><text x="309" y="196" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#dc2626">ב</text><ellipse cx="210" cy="255" rx="116.7" ry="26" fill="none" stroke="#dc2626" stroke-width="2.6"/><text x="344" y="261" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#dc2626">ג</text><circle cx="210" cy="30" r="4.5" fill="#111827"/></svg>`;
// Render helpers for the expansion pages.
const inlineBlanks=(id)=>prompt(id).replace(/_{3,}/g,'<span class="answer-line inline"></span>');
const sortTable=(id)=>`<table class="practice-table sort-table"><thead><tr><th>חפץ</th><th>חרוט / גליל / גוף אחר</th><th>נימוק קצר</th></tr></thead><tbody>${(q(id)?.sortRows||[]).map(n=>`<tr><td>${n}</td><td></td><td></td></tr>`).join('')}</tbody></table>`;
const secTable=(id)=>`<table class="practice-table sec-table"><thead><tr><th>רדיוס הבסיס r (ס״מ)</th><th>היקף הבסיס = אורך הקשת (ס״מ)</th></tr></thead><tbody>${(q(id)?.secRows||[]).map(n=>`<tr><td>${n}</td><td></td></tr>`).join('')}</tbody></table>`;
// Cylinder vs cone with identical base (r) and height (h) — the 1/3-volume comparison (CONE-RATIO).
const cylinderConeRatioSvg=()=>`<svg class="ratio-svg" viewBox="0 0 560 360" role="img" aria-label="גליל וחרוט בעלי אותו בסיס ואותו גובה, להשוואת נפחים"><g><path d="M60 290 A90 24 0 0 0 240 290" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><path d="M60 290 A90 24 0 0 1 240 290" fill="none" stroke="#1d4ed8" stroke-width="4"/><line x1="60" y1="70" x2="60" y2="290" stroke="#1d4ed8" stroke-width="4"/><line x1="240" y1="70" x2="240" y2="290" stroke="#1d4ed8" stroke-width="4"/><ellipse cx="150" cy="70" rx="90" ry="24" fill="#eff6ff" stroke="#1d4ed8" stroke-width="4"/><line x1="150" y1="70" x2="150" y2="290" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="150" y1="70" x2="240" y2="70" stroke="#111827" stroke-width="3"/><circle cx="150" cy="70" r="4" fill="#111827"/><text x="105" y="186" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#475569">h</text><text x="196" y="62" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#111827">r</text><text x="150" y="336" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="800" fill="#1d4ed8">גליל</text></g><g><path d="M320 290 A90 24 0 0 0 500 290" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><path d="M320 290 A90 24 0 0 1 500 290" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M410 70 L320 290 M410 70 L500 290" fill="none" stroke="#1d4ed8" stroke-width="4"/><line x1="410" y1="70" x2="410" y2="290" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="410" y1="290" x2="500" y2="290" stroke="#111827" stroke-width="3"/><circle cx="410" cy="70" r="5" fill="#111827"/><circle cx="410" cy="290" r="4" fill="#111827"/><text x="455" y="186" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#475569">h</text><text x="455" y="284" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#111827">r</text><text x="410" y="336" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="800" fill="#1d4ed8">חרוט</text></g></svg>`;
// Cone labelled by its full base DIAMETER (not radius) — the diameter-vs-radius error (CONE-ERR-05).
const diameterConeSvg=()=>`<svg class="diameter-cone-svg" viewBox="0 0 520 440" role="img" aria-label="חרוט ישר שקוטר בסיסו 12 סנטימטר וגובהו 10 סנטימטר"><ellipse cx="260" cy="350" rx="178" ry="46" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><path d="M260 54 L82 350 M260 54 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 46 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 46 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="54" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="82" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3.5"/><circle cx="260" cy="54" r="5" fill="#111827"/><text x="288" y="210" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#475569">10 ס״מ</text><text x="260" y="424" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#111827">קוטר 12 ס״מ</text></svg>`;
const ratioTable=(id)=>`<table class="practice-table ratio-table"><thead><tr><th>${tex('r')}</th><th>${tex('h')}</th><th>נפח הגליל</th><th>נפח החרוט</th></tr></thead><tbody>${(q(id)?.ratioTableRows||[]).map(row=>`<tr><td>${row.r} ס״מ</td><td>${row.h} ס״מ</td><td></td><td></td></tr>`).join('')}</tbody></table>`;
// ===== Phase 5 expansion diagrams (applications, architecture, grade-7 bridge) — inline-styled labels, gated by containment + clip =====
// Funnel: a cone standing on its apex (CONE-APP-01).
const funnelSvg=()=>`<svg class="funnel-svg" viewBox="0 0 520 430" role="img" aria-label="משפך בצורת חרוט ישר, הקודקוד למטה"><ellipse cx="260" cy="96" rx="172" ry="46" fill="#eff6ff" stroke="#1d4ed8" stroke-width="4"/><path d="M88 96 L260 372 L432 96" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M88 96 A172 46 0 0 0 432 96" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="96" x2="260" y2="372" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="96" x2="432" y2="96" stroke="#111827" stroke-width="3"/><circle cx="260" cy="372" r="4" fill="#111827"/><circle cx="260" cy="96" r="4" fill="#111827"/><text x="348" y="80" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#111827">6 ס״מ</text><text x="294" y="246" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#475569">8 ס״מ</text></svg>`;
// Light beam: a cone with its apex at the lamp (CONE-APP-03), base diameter labelled on the floor.
const lightBeamSvg=()=>`<svg class="beam-svg" viewBox="0 0 520 440" role="img" aria-label="אלומת אור בצורת חרוט ישר מזרקור, קודקוד למעלה"><defs><linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fef9c3"/><stop offset="1" stop-color="#fef3c7" stop-opacity="0.35"/></linearGradient></defs><rect x="238" y="30" width="44" height="18" rx="4" fill="#64748b" stroke="#334155" stroke-width="2"/><path d="M260 48 L92 356 L428 356 Z" fill="url(#beamGrad)" stroke="#f59e0b" stroke-width="3"/><ellipse cx="260" cy="356" rx="168" ry="44" fill="#fffbeb" stroke="#1d4ed8" stroke-width="4"/><path d="M92 356 A168 44 0 0 0 428 356" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="60" y1="400" x2="460" y2="400" stroke="#94a3b8" stroke-width="3"/><line x1="260" y1="48" x2="260" y2="356" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="92" y1="356" x2="428" y2="356" stroke="#111827" stroke-width="3"/><circle cx="260" cy="48" r="4" fill="#111827"/><text x="294" y="214" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#475569">12 מ׳</text><text x="260" y="424" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#111827">קוטר 10 מ׳</text></svg>`;
// Three roofs: א׳ and ג׳ conical, ב׳ a square pyramid — identify by properties (CONE-ARCH-01).
const archRoofsSvg=()=>`<svg class="arch-roofs" viewBox="0 0 540 250" role="img" aria-label="שלושה מבנים עם גגות שונים לזיהוי חרוט: א׳ וג׳ חרוטיים, ב׳ פירמידה מרובעת"><line x1="24" y1="206" x2="516" y2="206" stroke="#94a3b8" stroke-width="3"/><g><rect x="58" y="118" width="64" height="88" fill="#e0f2fe" stroke="#1d4ed8" stroke-width="3"/><ellipse cx="90" cy="118" rx="42" ry="12" fill="#f8fafc" stroke="#1d4ed8" stroke-width="2.5"/><path d="M90 36 L48 118 A42 12 0 0 0 132 118 Z" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="3"/><text x="90" y="238" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="800" fill="#1e3a8a">א׳</text></g><g><rect x="238" y="118" width="64" height="88" fill="#fef3c7" stroke="#b45309" stroke-width="3"/><path d="M270 40 L236 118 L304 118 Z" fill="#fde68a" stroke="#b45309" stroke-width="3"/><path d="M270 40 L304 118 L326 104 L292 30 Z" fill="#fcd34d" stroke="#b45309" stroke-width="2.5"/><path d="M236 118 L258 104 L326 104" fill="none" stroke="#b45309" stroke-width="2.5"/><text x="276" y="238" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="800" fill="#b45309">ב׳</text></g><g><rect x="418" y="118" width="64" height="88" fill="#dcfce7" stroke="#15803d" stroke-width="3"/><ellipse cx="450" cy="118" rx="42" ry="12" fill="#f0fdf4" stroke="#15803d" stroke-width="2.5"/><path d="M450 36 L408 118 A42 12 0 0 0 492 118 Z" fill="#bbf7d0" stroke="#15803d" stroke-width="3"/><text x="450" y="238" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="800" fill="#15803d">ג׳</text></g></svg>`;
// Red cone inscribed in a blue bounding cylinder, same base & height (CONE-ARCH-02/03).
const archCylinderInConeSvg=()=>`<svg class="arch-cyl-cone" viewBox="0 0 300 360" role="img" aria-label="חרוט חסום בתוך גליל באותו רדיוס בסיס ואותו גובה"><path d="M46 56 L46 300 M254 56 L254 300" stroke="#1d4ed8" stroke-width="3" fill="none"/><path d="M46 300 A104 28 0 0 0 254 300" fill="none" stroke="#1d4ed8" stroke-width="3"/><path d="M46 300 A104 28 0 0 1 254 300" fill="none" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="8 6"/><ellipse cx="150" cy="56" rx="104" ry="28" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><path d="M150 56 L46 300 M150 56 L254 300" stroke="#dc2626" stroke-width="3" fill="none"/><path d="M46 300 A104 28 0 0 0 254 300" fill="none" stroke="#dc2626" stroke-width="3"/><line x1="150" y1="56" x2="150" y2="300" stroke="#475569" stroke-width="2.5" stroke-dasharray="7 6"/><circle cx="150" cy="56" r="4" fill="#111827"/><line x1="150" y1="300" x2="254" y2="300" stroke="#111827" stroke-width="2.5"/><text x="138" y="190" text-anchor="end" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#475569">h</text><text x="205" y="292" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="700" fill="#111827">r</text><text x="150" y="18" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="13" font-weight="700" fill="#1d4ed8">גליל חוסם</text><text x="104" y="250" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="13" font-weight="700" fill="#dc2626">חרוט</text></svg>`;
// Cone with parallel cross-sections; the mid-height section highlighted (CONE-ARCH-04).
const archSectionsSvg=()=>`<svg class="arch-sections" viewBox="0 0 300 340" role="img" aria-label="חרוט עם חתכים מקבילים לבסיס, החתך האמצעי מודגש"><ellipse cx="150" cy="290" rx="104" ry="26" fill="#eff6ff" stroke="#1d4ed8" stroke-width="3"/><path d="M150 44 L46 290 M150 44 L254 290" stroke="#1d4ed8" stroke-width="3" fill="none"/><path d="M46 290 A104 26 0 0 0 254 290" fill="none" stroke="#1d4ed8" stroke-width="3"/><ellipse cx="150" cy="105" rx="26" ry="7" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/><ellipse cx="150" cy="228" rx="78" ry="19" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/><ellipse cx="150" cy="167" rx="52" ry="13" fill="#fde68a" fill-opacity="0.5" stroke="#d97706" stroke-width="3"/><line x1="150" y1="44" x2="150" y2="290" stroke="#475569" stroke-width="2.5" stroke-dasharray="7 6"/><circle cx="150" cy="44" r="4" fill="#111827"/><line x1="150" y1="290" x2="254" y2="290" stroke="#111827" stroke-width="2.5"/><line x1="202" y1="167" x2="216" y2="167" stroke="#d97706" stroke-width="2"/><text x="74" y="112" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="16" font-weight="700" fill="#475569">12 ס״מ</text><text x="200" y="283" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="16" font-weight="700" fill="#111827">6 ס״מ</text><text x="224" y="172" text-anchor="start" font-family="'Rubik',sans-serif" font-size="13" font-weight="700" fill="#b45309">החתך</text></svg>`;
// Circle with centre O for the grade-7 recap (CONE-BRIDGE-01).
const circleSvg=()=>`<svg class="circle-svg" viewBox="0 0 240 240" role="img" aria-label="מעגל שמרכזו O"><circle cx="120" cy="120" r="96" fill="#eff6ff" stroke="#1d4ed8" stroke-width="4"/><circle cx="120" cy="120" r="4.5" fill="#111827"/><text x="108" y="114" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="18" font-weight="800" fill="#1d4ed8">O</text></svg>`;
// Right triangle with legs 6 and 8 for the Pythagoras recap (CONE-BRIDGE-05).
const rightTriangleSvg=()=>`<svg class="right-triangle-svg" viewBox="0 0 300 250" role="img" aria-label="משולש ישר־זווית, ניצבים 6 ו־8 ס״מ"><path d="M80 210 L80 60 L240 210 Z" fill="#eff6ff" stroke="#1d4ed8" stroke-width="4"/><path d="M80 188 L102 188 L102 210" fill="none" stroke="#1d4ed8" stroke-width="2.5"/><text x="70" y="140" text-anchor="end" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#111827">6 ס״מ</text><text x="160" y="236" text-anchor="middle" font-family="'Rubik',sans-serif" font-size="17" font-weight="700" fill="#111827">8 ס״מ</text></svg>`;
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

// ===== Expansion phase 3 (SSOT §26): nets, sector angle and cross-sections, graded after the views =====
// NET — which net closes into a cone; label the parts; arc length = base circumference.
const netParts1=splitHebrewSubsections(prompt('CONE-NET-01'),['א','ב']);
addPage(`${nextHeader('פריסות של חרוט — איזו נסגרת?')}
<div class="concept-note">פְּרִיסָה היא ה״שיטוח״ של גוף: פורשׂים את פני החרוט על המישור. חרוט נסגר מגזרת עיגול (המעטפת) יחד עם עיגול (הבסיס).</div>
<div class="question-intro">${netParts1.intro}</div>
<div class="net-figure">${coneNetOptionsSvg()}</div>
${renderSubpart(findPart(netParts1,'א'),{size:'subpart-small'})}
${renderSubpart(findPart(netParts1,'ב'),{size:'subpart-medium'})}`);

addPage(`${nextHeader('פריסת חרוט — חלקים וסגירה')}
<div class="task first">${prompt('CONE-NET-02')}</div>
<div class="net-figure">${coneNetFigureSvg()}</div>
<div class="task">${prompt('CONE-NET-03')}</div>${grid('medium')}${answerLine()}`);

const netParts6=splitHebrewSubsections(prompt('CONE-NET-06'),['א','ב']);
addPage(`${nextHeader('זווית הגזרה והקשר לבסיס')}
<div class="two-column"><div class="diagram-box">${coneSectorCompareSvg()}</div><div><div class="task first">${prompt('CONE-NET-04')}</div>${grid('medium')}${answerLine()}</div></div>
<div class="two-column"><div class="diagram-box">${coneSectorAngleSvg()}</div><div><div class="task first">${prompt('CONE-NET-05')}</div>${grid('small')}${answerLine()}</div></div>
<div class="task first">${findPart(netParts6,'א').text.replace(/_{3,}/g,'<span class="answer-line inline"></span>')}</div>
${renderSubpart(findPart(netParts6,'ב'),{size:'subpart-medium'})}`);

// SEC — from sector angle to base radius.
addPage(`${nextHeader('מגזרה לחרוט — זווית הגזרה')}
<div class="concept-note">כשפורסׂים את מעטפת החרוט ומשטחים אותה, מתקבלת גזרה של עיגול: רדיוס הגזרה שווה לקו היוצר ${tex('s')}, ואורך קשת הגזרה שווה להיקף בסיס החרוט.</div>
<div class="two-column"><div class="diagram-box">${coneAsset('cone-3d-upright','חרוט ישר עומד על בסיסו')}</div><div class="diagram-box">${sectorSvg()}</div></div>
<div class="work-caption">מודל החרוט (מימין) והמעטפת הפרוסה — גזרה (משמאל).</div>
<section class="definition intro-definition">${inlineBlanks('CONE-SEC-01')}</section>
<div class="task">${prompt('CONE-SEC-02')}</div>${grid('medium')}${answerLine()}`);

addPage(`${nextHeader('זווית הגזרה — חישובים')}
<div class="task first">${prompt('CONE-SEC-03')}</div>${grid('medium')}${answerLine()}
<div class="task">${prompt('CONE-SEC-04')}</div>
${secTable('CONE-SEC-04')}
<div class="work-caption">מרחב חישוב לטבלה</div>${grid('table-work')}`);

addPage(`${nextHeader('מהגזרה אל רדיוס הבסיס')}
<div class="concept-note">זכרו: הקו היוצר תמיד ארוך מרדיוס הבסיס, כי ${tex('s=\\sqrt{r^2+h^2}>r')}. לכן רדיוס הגזרה (${tex('s')}) גדול מרדיוס בסיס החרוט (${tex('r')}).</div>
<div class="task first">${prompt('CONE-SEC-05')}</div>${grid('reverse')}${answerLine()}
<div class="task">${prompt('CONE-SEC-06')}</div>${grid('claim')}${answerLine()}`);

// CUT — parallel-to-base and axial cross-sections.
addPage(`${nextHeader('חתכים בחרוט — מקביל וצירי')}
<div class="concept-note">חותכים חרוט ישר במישור ומתבוננים בצורת החתך. נבדוק שני סוגי חתכים: מקביל לבסיס, ועובר דרך הקודקוד (חתך צירי).</div>
<div class="two-column"><div class="diagram-box">${coneCutsSvg()}</div><div><div class="task first">${prompt('CONE-CUT-01')}</div>${grid('small')}${answerLine()}</div></div>
<div class="two-column"><div class="view-figure">${axialSvg()}</div><div><div class="task first">${prompt('CONE-CUT-02')}</div>${grid('small')}${answerLine()}</div></div>`);

addPage(`${nextHeader('חתכים מקבילים — גודל העיגול ובדיקת טענה')}
<div class="two-column"><div class="diagram-box">${coneCutsSvg()}</div><div><div class="task first">${prompt('CONE-CUT-03')}</div>${grid('medium')}${answerLine()}</div></div>
<div class="task">${prompt('CONE-CUT-04')}</div>${grid('medium')}${answerLine('סמ״ר')}
<div class="task">${prompt('CONE-CUT-05')}</div>${grid('claim')}${answerLine()}`);

addPage(`${nextHeader(`נפח חרוט — השלימו: ${tex('V=\\underline{\\hspace{28mm}}')}`)}
<div class="task">${prompt('CONE-VOL-01')}</div>${grid('medium')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-TAB-01')}</div>
<table class="practice-table"><thead><tr><th>${tex('r')}</th><th>${tex('d')}</th><th>${tex('h')}</th><th>${tex('V')}</th></tr></thead><tbody>${volumeTableRows()}</tbody></table>
<div class="work-caption">מרחב חישוב לטבלה</div>${grid('table-work')}`);

// ===== Expansion phase 4 (SSOT §26): cone/cylinder 1/3 ratio + volume-error analysis, after the volume formula =====
// RATIO — cone volume is a third of the same-base-same-height cylinder (student discovers the 1/3).
addPage(`${nextHeader('חרוט וגליל — יחס השליש')}
<div class="concept-note">לגליל ולחרוט שלפניכם אותו בסיס ואותו גובה. נזכיר שנפח גליל מחושב לפי ${tex('V=\\pi\\cdot r^{2}\\cdot h')}.</div>
<div class="ratio-figure">${cylinderConeRatioSvg()}</div>
<div class="task first">${prompt('CONE-RATIO-01')}</div>${grid('small')}${answerLine('פעמים')}
<div class="task">${prompt('CONE-RATIO-02')}</div>${grid('small')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-RATIO-03')}</div>${grid('small')}${answerLine('סמ״ק')}`);

const ratioParts=splitHebrewSubsections(prompt('CONE-RATIO-04'),['א','ב','ג']);
addPage(`${nextHeader('חרוט וגליל — חישוב נפחים')}
<div class="concept-note">בחרו רדיוס וגובה נתונים, חשבו את נפח הגליל ואת נפח החרוט בעלי אותו בסיס ואותו גובה, והשוו ביניהם.</div>
<div class="question-intro">${ratioParts.intro}</div>
${renderSubpart(findPart(ratioParts,'א'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(ratioParts,'ב'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(ratioParts,'ג'),{size:'subpart-small'})}`);

addPage(`${nextHeader('חרוט וגליל — טבלת נפחים')}
<div class="task first">${prompt('CONE-RATIO-05')}</div>
${ratioTable('CONE-RATIO-05')}
<div class="work-caption">מרחב חישוב לטבלה</div>${grid('table-work')}`);

addPage(`${nextHeader('יחס השליש — הכללה ובדיקת טענה')}
<div class="task first">${prompt('CONE-RATIO-06')}</div>${grid('subpart-explain')}${answerLine()}
<div class="task">${prompt('CONE-RATIO-07')}</div>${grid('claim')}${answerLine()}`);

// ERR — diagnose & fix common volume-calculation mistakes (missing 1/3, un-squared r, times-3, diameter, units).
addPage(`${nextHeader('ניתוח שגיאות נפוצות בחישוב הנפח')}
<div class="concept-note">לפניכם פתרונות של תלמידים לאותה שאלה. בכל סעיף מצאו היכן נפלה הטעות ותקנו אותה עד לתשובה הנכונה.</div>
<div class="two-column"><div class="diagram-box">${coneSvg()}</div><div><div class="task first">${prompt('CONE-ERR-01')}</div>${grid('medium')}${answerLine('סמ״ק')}</div></div>
<div class="task">${prompt('CONE-ERR-02')}</div>${grid('small')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-ERR-03')}</div>${grid('small')}${answerLine('סמ״ק')}`);

addPage(`${nextHeader('ניתוח שגיאות נפוצות בחישוב הנפח — המשך')}
<div class="task first">${prompt('CONE-ERR-04')}</div>${grid('small')}${answerLine('סמ״ק')}
<div class="two-column"><div class="diagram-box">${diameterConeSvg()}</div><div><div class="task first">${prompt('CONE-ERR-05')}</div>${grid('medium')}${answerLine('סמ״ק')}</div></div>
<div class="task">${prompt('CONE-ERR-06')}</div>${grid('small')}${answerLine()}`);

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

// ===== Expansion phase 5 (SSOT §26): applications & architectural investigation, before the locked curriculum question =====
// APP — real-world applications: funnel, party hat, light beam.
const appHatParts=splitHebrewSubsections(prompt('CONE-APP-02'),['א','ב']);
addPage(`${nextHeader('יישומים: משפך חרוטי')}
<div class="two-column"><div class="diagram-box">${funnelSvg()}</div><div><div class="task first">${prompt('CONE-APP-01')}</div>${grid('medium')}${answerLine('סמ״ק')}</div></div>`);
addPage(`${nextHeader('יישומים: כובע חרוטי')}
<div class="two-column"><div class="diagram-box">${coneSvg({r:'9 ס״מ'})}</div><div class="question-intro">${appHatParts.intro}</div></div>
${renderSubpart(findPart(appHatParts,'א'),{size:'pythagoras',unit:'ס״מ'})}
${renderSubpart(findPart(appHatParts,'ב'),{size:'subpart-medium',unit:'סמ״ק'})}`);

const appBeamParts=splitHebrewSubsections(prompt('CONE-APP-03'),['א','ב','ג']);
addPage(`${nextHeader('יישומים: אלומת אור')}
<div class="two-column"><div class="diagram-box">${lightBeamSvg()}</div><div class="question-intro">${appBeamParts.intro}</div></div>
${renderSubpart(findPart(appBeamParts,'א'),{size:'subpart-medium',unit:'מ״ק'})}
${renderSubpart(findPart(appBeamParts,'ב'),{size:'axial-work',unit:'מ״ר'})}
${renderSubpart(findPart(appBeamParts,'ג'),{size:'subpart-medium',unit:'מ״ק'})}`);

// ARCH — investigation arena: why the cone is exactly a third of the bounding cylinder.
const arch1Parts=splitHebrewSubsections(prompt('CONE-ARCH-01'),['א','ב']);
addPage(`${nextHeader('זירת החקר: הקשר בין חרוט לגליל החוסם')}
<div class="question-intro">ארכימדס גילה קשר פשוט בין חרוט לגליל החוסם אותו. בעמודים הבאים תחקרו את הקשר הזה ותגלו מניין מגיע המקדם בנוסחת נפח החרוט.</div>
<div class="arch-figure">${archRoofsSvg()}</div>
${renderSubpart(findPart(arch1Parts,'א'),{size:'subpart-small'})}
${renderSubpart(findPart(arch1Parts,'ב'),{size:'claim'})}`);

const arch2Parts=splitHebrewSubsections(prompt('CONE-ARCH-02'),['א','ב']);
addPage(`${nextHeader('מחרוט לגליל החוסם — מניין השליש')}
<div class="two-column"><div class="arch-figure">${archCylinderInConeSvg()}</div><div class="question-intro">${arch2Parts.intro}</div></div>
${renderSubpart(findPart(arch2Parts,'א'),{size:'subpart-small'})}
${renderSubpart(findPart(arch2Parts,'ב'),{size:'subpart-small'})}`);

const arch3Parts=splitHebrewSubsections(prompt('CONE-ARCH-03'),['א','ב','ג']);
const arch5Parts=splitHebrewSubsections(prompt('CONE-ARCH-05'),['א','ב']);
addPage(`${nextHeader('יחס השליש — חישוב ואישור')}
<div class="question-intro">${arch3Parts.intro}</div>
${renderSubpart(findPart(arch3Parts,'א'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(arch3Parts,'ב'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(arch3Parts,'ג'),{size:'subpart-small'})}
<div class="question-intro">${arch5Parts.intro}</div>
${renderSubpart(findPart(arch5Parts,'א'),{size:'subpart-small',unit:'סמ״ק'})}
${renderSubpart(findPart(arch5Parts,'ב'),{size:'subpart-small',unit:'סמ״ק'})}`);

const arch4Parts=splitHebrewSubsections(prompt('CONE-ARCH-04'),['א','ב']);
addPage(`${nextHeader('הצטברות הנפח — חתכים בחרוט')}
<div class="two-column"><div class="arch-figure">${archSectionsSvg()}</div><div class="question-intro">${arch4Parts.intro}</div></div>
${renderSubpart(findPart(arch4Parts,'א'),{size:'subpart-small',unit:'ס״מ'})}
${renderSubpart(findPart(arch4Parts,'ב'),{size:'subpart-medium'})}`);

const arch7Parts=splitHebrewSubsections(prompt('CONE-ARCH-07'),['א','ב']);
addPage(`${nextHeader('היפוך החרוט — שימור הנפח')}
<div class="task first">${prompt('CONE-ARCH-06')}</div>
<div class="invert-pair"><div class="view-figure">${coneAsset('cone-3d-upright','חרוט עומד — קודקוד למעלה')}</div><div class="invert-label">היפוך ←</div><div class="view-figure">${coneAsset('cone-3d-down','אותו חרוט הפוך — קודקוד למטה')}</div></div>
${grid('claim')}${answerLine()}`);
addPage(`${nextHeader('יישום אדריכלי — נפח גג חרוטי')}
<div class="two-column"><div class="diagram-box">${coneSvg({r:'4 מ׳'})}</div><div class="question-intro">${arch7Parts.intro}</div></div>
${renderSubpart(findPart(arch7Parts,'א'),{size:'subpart-medium',unit:'מ״ק'})}
${renderSubpart(findPart(arch7Parts,'ב'),{size:'subpart-small'})}`);

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

// ===== Expansion phase 5 (cont.): grade-7 bridge — circle, circumference & Pythagoras back to the cone (final ladder item) =====
const b3Parts=splitHebrewSubsections(prompt('CONE-BRIDGE-03'),['א','ב','ג']);
addPage(`${nextHeader('גשר חזרה: מהמעגל אל בסיס החרוט')}
<div class="concept-note">בסיס החרוט הוא עיגול ושפת הבסיס היא מעגל. נרענן את מידות המעגל לפני שנחשב בחרוט.</div>
<div class="two-column"><div class="diagram-box">${circleSvg()}</div><div><div class="task first">${inlineBlanks('CONE-BRIDGE-01')}</div>${answerLine()}</div></div>
<div class="task">${inlineBlanks('CONE-BRIDGE-02')}</div>${answerLine()}
${renderSubpart(findPart(b3Parts,'א'),{size:'subpart-small',unit:'ס״מ'})}
${renderSubpart(findPart(b3Parts,'ב'),{size:'subpart-small',unit:'ס״מ'})}
${renderSubpart(findPart(b3Parts,'ג'),{size:'subpart-medium',unit:'ס״מ'})}`);

const b6Parts=splitHebrewSubsections(prompt('CONE-BRIDGE-06'),['א','ב']);
addPage(`${nextHeader('גשר חזרה: שטח העיגול ופיתגורס')}
<div class="task first">${prompt('CONE-BRIDGE-04')}</div>${grid('medium')}${answerLine('סמ״ר')}
<div class="two-column"><div class="diagram-box">${rightTriangleSvg()}</div><div><div class="task first">${prompt('CONE-BRIDGE-05')}</div>${grid('pythagoras')}${answerLine('ס״מ')}</div></div>`);
addPage(`${nextHeader('גשר חזרה: החתך הצירי אל נוסחת החרוט')}
<div class="two-column"><div class="diagram-box">${axialSvg()}</div><div class="question-intro">${b6Parts.intro}</div></div>
${renderSubpart(findPart(b6Parts,'א'),{size:'subpart-small',unit:'ס״מ'})}
${renderSubpart(findPart(b6Parts,'ב'),{size:'subpart-small',unit:'ס״מ'})}`);

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
