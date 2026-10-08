const D=window.CONE_DATA;
const book=document.querySelector('#book');

const DISTRICT_LOGO='https://raw.githubusercontent.com/yanivmizrachiy/jerusalem/5dd97f6acfc3e3f95550ef1cb714d416261f174c/public/logo.png';
const footer=()=>`<footer class="gz-footer"><div class="footer-inner"><img class="district-logo" src="${DISTRICT_LOGO}" alt="סמל מחוז ירושלים"><div class="footer-copy"><div class="f1">${D.footer[0]}</div><div class="f2">${D.footer[1]}</div></div></div></footer>`;
const header=(title,n)=>`<header class="page-header"><h1>${title}</h1><b>${n}</b></header>`;
const grid=(size='medium')=>`<div class="work-grid ${size}"></div>`;
const answerLine=(unit='')=>`<div class="final-answer">תשובה: <span></span>${unit?` <em>${unit}</em>`:''}</div>`;
const coneSvg=({r='r',h='h',slant='',large=false}={})=>`<svg class="cone-svg ${large?'cone-large':''}" viewBox="0 0 520 430" role="img" aria-label="חרוט ישר"><ellipse cx="260" cy="350" rx="178" ry="48" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><path d="M260 42 L82 350 M260 42 L438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 0 438 350" fill="none" stroke="#1d4ed8" stroke-width="4"/><path d="M82 350 A178 48 0 0 1 438 350" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="9 7"/><line x1="260" y1="42" x2="260" y2="350" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="350" x2="438" y2="350" stroke="#111827" stroke-width="3"/><circle cx="260" cy="42" r="5" fill="#111827"/><circle cx="260" cy="350" r="4" fill="#111827"/><text class="label" x="277" y="200">${h}</text><text class="label" x="344" y="338">${r}</text>${slant?`<text class="label" x="365" y="190">${slant}</text>`:''}</svg>`;
const axialSvg=()=>`<svg class="axial-svg" viewBox="0 0 520 310" role="img" aria-label="חתך צירי של חרוט"><path d="M260 35 L75 270 L445 270 Z" fill="#f8fafc" stroke="#1d4ed8" stroke-width="4"/><line x1="260" y1="35" x2="260" y2="270" stroke="#475569" stroke-width="3" stroke-dasharray="8 7"/><line x1="260" y1="270" x2="445" y2="270" stroke="#111827" stroke-width="3"/><text class="label" x="276" y="160">h</text><text class="label" x="350" y="258">r</text><text class="label" x="365" y="150">ℓ</text></svg>`;
const addPage=(html)=>{const p=document.createElement('section');p.className='page';p.dataset.kind='student';p.innerHTML=html+footer();book.append(p);return p};

addPage(`<div class="source-sheet">${D.page1}</div>`);

addPage(`${header('היכרות עם החרוט',2)}
<section class="definition intro-definition">חרוט הוא גוף המורכב מעיגול ונקודה שמחוץ למישור העיגול וכל הקטעים המחברים את הנקודה עם נקודות הנמצאות על היקף העיגול (מעגל). הנקודה נקראת קודקוד החרוט, העיגול נקרא בסיס החרוט. כל הקטעים הנ״ל יוצרים מעטפת החרוט.</section>
<div class="intro-cone">${coneSvg({large:true})}</div>
<div class="task compact">${D.questions[0].prompt} <span class="answer-line short"></span></div>
<div class="task compact">${D.questions[1].prompt}</div>`);

addPage(`${header('נפח חרוט — השלימו: V = ________',3)}
<div class="task">${D.questions[2].prompt}</div>${grid('medium')}${answerLine('סמ״ק')}
<div class="task">${D.questions[3].prompt}</div>
<table class="practice-table"><thead><tr><th>r</th><th>d</th><th>h</th><th>V</th></tr></thead><tbody><tr><td>3</td><td></td><td>8</td><td></td></tr><tr><td></td><td>8</td><td>12</td><td></td></tr><tr><td>5</td><td></td><td>12</td><td></td></tr></tbody></table>`);

addPage(`${header('חתך צירי ומשפט פיתגורס',4)}
<div class="concept-note">חתך צירי של חרוט הוא משולש שווה שוקיים שקודקוד הראש שלו הוא קודקוד החרוט והבסיס שלו הוא קוטר העיגול.</div>
<div class="two-column"><div>${axialSvg()}</div><div><div class="task first">${D.questions[4].prompt}</div>${grid('medium')}${answerLine('ס״מ')}</div></div>
<div class="task">${D.questions[5].prompt}</div>${grid('medium')}${answerLine('סמ״ר')}`);

addPage(`${header('נפח חרוט — השלימו את דרך החישוב',5)}
<div class="task first">${D.questions[6].prompt}</div>${grid('small')}${answerLine('סמ״ק')}
<div class="task">${D.questions[7].prompt}</div>${grid('small')}${answerLine('ס״מ')}
<div class="task">${D.questions[8].prompt}</div>${grid('small')}${answerLine()}`);

const official=D.questions[9].prompt;
const splitMarker=' ג. בעל הגלידרייה';
const cut=official.indexOf(splitMarker);
const officialAB=cut>0?official.slice(0,cut):official;
const officialCD=cut>0?official.slice(cut+1):'';

addPage(`${header('שאלות מתוך תוכנית הלימודים',6)}
<div class="official-layout"><div class="official-question">${officialAB}</div><div class="official-diagram">${coneSvg({r:'6 ס״מ',h:'h',slant:'10 ס״מ'})}</div></div>
${grid('large')}`);

if(officialCD){addPage(`${header('שאלות מתוך תוכנית הלימודים',7)}
<div class="official-question official-continuation">${officialCD}</div>
${grid('large')}${answerLine()}`)}

let idx=0;
const students=[...document.querySelectorAll('[data-kind="student"]')];
function show(){students.forEach((p,i)=>p.hidden=i!==idx);document.querySelector('#counter').textContent=`${idx+1} / ${students.length}`;document.querySelector('#prev').disabled=idx===0;document.querySelector('#next').disabled=idx===students.length-1;fitPage()}
function fitPage(){if(innerWidth>850){book.style.removeProperty('--page-scale');return}book.style.setProperty('--page-scale',Math.min(1,(innerWidth-16)/794))}
document.querySelector('#prev').onclick=()=>{idx=Math.max(0,idx-1);show()};
document.querySelector('#next').onclick=()=>{idx=Math.min(students.length-1,idx+1);show()};
addEventListener('resize',fitPage);
show();
