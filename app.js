const D=window.CONE_DATA;
const book=document.querySelector('#book');

const DISTRICT_LOGO='https://raw.githubusercontent.com/yanivmizrachiy/jerusalem/5dd97f6acfc3e3f95550ef1cb714d416261f174c/public/logo.png';
const PAGE1_ASSET_MAIN='https://raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/main/worksheets/assets/ayelet-original-cone.png';
const PAGE1_ASSET_PINNED='https://raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/7121dfeaa9d8dc9f4101eea155c23a24374a0a2a/worksheets/assets/ayelet-original-cone.png';
const footer=()=>`<footer class="gz-footer"><div class="footer-inner"><img class="district-logo" src="${DISTRICT_LOGO}" alt="סמל מחוז ירושלים"><div class="footer-copy"><div class="f1">${D.footer[0]}</div><div class="f2">${D.footer[1]}</div></div></div></footer>`;
const header=(title,n)=>`<header class="page-header"><h1>${title}</h1><b>${n}</b></header>`;
const tex=(s)=>`\\(${s}\\)`;
const grid=(size='medium')=>`<div class="work-grid ${size}"></div>`;
const answerLine=(unit='')=>`<div class="final-answer">תשובה: <span></span>${unit?` <em>${unit}</em>`:''}</div>`;
const tableCell=(value,isVPi=false)=>value==null?'':(isVPi?tex(`${value}\\pi`):String(value));
const volumeTableRows=()=>D.volumeTableRows.map(row=>`<tr><td>${tableCell(row.r)}</td><td>${tableCell(row.d)}</td><td>${tableCell(row.h)}</td><td>${tableCell(row.vPi,true)}</td></tr>`).join('');
const q=id=>D.questions.find(item=>item.id===id)||null;
const prompt=id=>q(id)?.prompt||'';
const coneSvg=({r='r',h='h',slant='',large=false}={})=>`<svg class="cone-svg ${large?'cone-large':''}" viewBox="0 0 520 430" role="img" aria-label="חרוט ישר"><ellipse cx="260" cy="350" rx="178" ry="48" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><path d="M260 42 L82 350 M260 42 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="42" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3"/><circle cx="260" cy="42" r="5" fill="#111827"/><circle cx="260" cy="350" r="4" fill="#111827"/><text class="label" x="277" y="200">${h}</text><text class="label" x="344" y="338">${r}</text>${slant?`<text class="label" x="365" y="190">${slant}</text>`:''}</svg>`;
const waffleConeSvg=()=>`<svg class="cone-svg waffle-cone" viewBox="0 0 520 430" role="img" aria-label="גביע וופל בצורת חרוט ישר"><defs><pattern id="wafflePattern" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 0L24 24M24 0L0 24" fill="none" stroke="#d6b889" stroke-width="1.6"/></pattern></defs><path d="M260 42 L82 350 L438 350 Z" fill="#fff7ed"/><path d="M260 42 L82 350 L438 350 Z" fill="url(#wafflePattern)" opacity=".72"/><ellipse cx="260" cy="350" rx="178" ry="48" fill="#fffaf2" stroke="#1d4ed8" stroke-width="4"/><path d="M260 42 L82 350 M260 42 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="42" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3"/><circle cx="260" cy="42" r="5" fill="#111827"/><circle cx="260" cy="350" r="4" fill="#111827"/><text class="label" x="277" y="200">h</text><text class="label" x="344" y="338">6 ס״מ</text><text class="label" x="365" y="190">10 ס״מ</text></svg>`;
const axialSvg=()=>`<svg class="axial-svg" viewBox="0 0 520 310" role="img" aria-label="חתך צירי של חרוט"><path d="M260 35 L75 270 L445 270 Z" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><line x1="260" y1="35" x2="260" y2="270" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="270" x2="445" y2="270" stroke="#111827" stroke-width="3"/><text class="label" x="276" y="160">h</text><text class="label" x="350" y="258">r</text><text class="label" x="365" y="150">ℓ</text></svg>`;
const orientedConeSvg=(angle=0)=>`<svg class="orientation-cone" viewBox="0 0 260 240" role="img" aria-label="חרוט ישר במנח שונה"><g transform="rotate(${angle} 130 120)"><ellipse cx="130" cy="185" rx="72" ry="22" fill="#f8fafc" stroke="#1d4ed8" stroke-width="3"/><path d="M130 34 L58 185 M130 34 L202 185" fill="none" stroke="#1d4ed8" stroke-width="3"/><path d="M58 185 A72 22 0 0 1 202 185" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 5"/><line x1="130" y1="34" x2="130" y2="185" stroke="#475569" stroke-width="2.5" stroke-dasharray="6 5"/><circle cx="130" cy="34" r="4" fill="#111827"/><circle cx="130" cy="185" r="3" fill="#111827"/></g></svg>`;
const addPage=(html)=>{const p=document.createElement('section');p.className='page';p.dataset.kind='student';p.innerHTML=html+footer();book.append(p);return p};

const page1Html=D.page1.replace(PAGE1_ASSET_MAIN,PAGE1_ASSET_PINNED);
addPage(`<div class="source-sheet">${page1Html}</div>`);

addPage(`${header('היכרות עם החרוט',2)}
<section class="definition intro-definition">חרוט הוא גוף המורכב מעיגול ונקודה שמחוץ למישור העיגול וכל הקטעים המחברים את הנקודה עם נקודות הנמצאות על היקף העיגול (מעגל). הנקודה נקראת קודקוד החרוט, העיגול נקרא בסיס החרוט. כל הקטעים הנ״ל יוצרים מעטפת החרוט.</section>
<div class="intro-cone">${coneSvg({large:true})}</div>
<div class="task compact">${prompt('CONE-DEF-01')} <span class="answer-line short"></span></div>
<div class="task compact">${prompt('CONE-ID-01')}</div>`);

addPage(`${header(`נפח חרוט — השלימו: ${tex('V=\\underline{\\hspace{28mm}}')}`,3)}
<div class="task">${prompt('CONE-VOL-01')}</div>${grid('medium')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-TAB-01')}</div>
<table class="practice-table"><thead><tr><th>${tex('r')}</th><th>${tex('d')}</th><th>${tex('h')}</th><th>${tex('V')}</th></tr></thead><tbody>${volumeTableRows()}</tbody></table>
<div class="work-caption">מרחב חישוב לטבלה</div>${grid('table-work')}`);

addPage(`${header('חתך צירי ומשפט פיתגורס',4)}
<div class="concept-note">חתך צירי של חרוט הוא משולש שווה שוקיים שקודקוד הראש שלו הוא קודקוד החרוט והבסיס שלו הוא קוטר העיגול.</div>
<div class="two-column"><div>${axialSvg()}</div><div><div class="task first">${prompt('CONE-PYT-01')}</div>${grid('pythagoras')}${answerLine('ס״מ')}</div></div>
<div class="task">${prompt('CONE-AX-01')}</div>${grid('axial-work')}${answerLine('סמ״ר')}`);

const estimate=q('CONE-EST-01');
addPage(`${header(`נפח חרוט — השלימו: ${tex('\\pi\\approx\\underline{\\hspace{14mm}}')}`,5)}
<div class="task first">${prompt('CONE-CONV-01')}</div>${grid('conversion')}${answerLine('סמ״ק')}
<div class="task">${prompt('CONE-REV-01')}</div>${grid('reverse')}${answerLine('ס״מ')}
<div class="task">${prompt('CONE-CHANGE-01')}</div>${grid('change')}${answerLine()}
${estimate?`<div class="task compact">${estimate.prompt}</div>${grid('small')}${answerLine('סמ״ק')}`:''}`);

addPage(`${header('זיהוי חרוטים במנחים שונים',6)}
<div class="task first">${prompt('CONE-ORIENT-01')}</div>
<div class="orientation-grid"><div>${orientedConeSvg(0)}</div><div>${orientedConeSvg(90)}</div><div>${orientedConeSvg(180)}</div></div>
<div class="orientation-note">כתבו מתחת לכל שרטוט: בסיס, קודקוד וגובה.</div>${grid('orientation-work')}`);

const official=prompt('CURR-CONE-06');
const splitMarker=' ג. בעל הגלידרייה';
const cut=official.indexOf(splitMarker);
const officialAB=cut>0?official.slice(0,cut):official;
const officialCD=cut>0?official.slice(cut+1):'';

addPage(`${header('שאלות מתוך תוכנית הלימודים',7)}
<div class="official-layout"><div class="official-question">${officialAB}</div><div class="official-diagram">${waffleConeSvg()}</div></div>
<div class="work-caption">מרחב פתרון לסעיפים א׳–ב׳</div>${grid('official-ab')}`);

if(officialCD){addPage(`${header('שאלות מתוך תוכנית הלימודים',8)}
<div class="official-question official-continuation">${officialCD}</div>
<table class="comparison-table"><thead><tr><th></th><th>אפשרות א׳</th><th>אפשרות ב׳</th></tr></thead><tbody><tr><th>${tex('r')}</th><td></td><td></td></tr><tr><th>${tex('h')}</th><td></td><td></td></tr><tr><th>${tex('V')}</th><td></td><td></td></tr><tr><th>פי כמה מהנפח המקורי</th><td></td><td></td></tr></tbody></table>
<div class="work-caption">מרחב חישוב והסבר</div>${grid('official-cd')}${answerLine()}`)}

let idx=0;
const students=[...document.querySelectorAll('[data-kind="student"]')];
function show(){students.forEach((p,i)=>p.hidden=i!==idx);document.querySelector('#counter').textContent=`${idx+1} / ${students.length}`;document.querySelector('#prev').disabled=idx===0;document.querySelector('#next').disabled=idx===students.length-1;fitPage()}
function fitPage(){if(innerWidth>850){book.style.removeProperty('--page-scale');return}book.style.setProperty('--page-scale',Math.min(1,(innerWidth-16)/794))}
document.querySelector('#prev').onclick=()=>{idx=Math.max(0,idx-1);show()};
document.querySelector('#next').onclick=()=>{idx=Math.min(students.length-1,idx+1);show()};
addEventListener('resize',fitPage);
show();
