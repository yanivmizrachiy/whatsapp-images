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
