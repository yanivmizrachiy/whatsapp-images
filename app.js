const reader=document.querySelector('.reader');
const counter=document.querySelector('#counter');
const prevBtn=document.querySelector('#prev');
const nextBtn=document.querySelector('#next');
const toggleBtn=document.querySelector('#view-toggle');

// Reader view: 'paged' shows one A4 page at a time; 'scroll' stacks all pages.
// ?mobile=1 activates a dedicated readable phone view without changing print/A4 output.
const VIEW_KEY='cone-reader-view';
const readStoredView=()=>{try{return localStorage.getItem(VIEW_KEY)}catch{return null}};
const storeView=(view)=>{try{localStorage.setItem(VIEW_KEY,view)}catch{}};
const params=new URLSearchParams(location.search);
const mobileReader=params.get('mobile')==='1';
const urlView=params.get('view');
let scrollView=mobileReader||Boolean(urlView?urlView==='scroll':readStoredView()==='scroll');

function updateCounter(){counter.textContent=`${idx+1} / ${students.length}`;prevBtn.disabled=idx===0;nextBtn.disabled=idx===students.length-1}
function show(){
  if(mobileReader)scrollView=true;
  document.body.classList.toggle('scroll-view',scrollView);
  document.body.classList.toggle('mobile-reader',mobileReader);
  toggleBtn.setAttribute('aria-pressed',String(scrollView));
  toggleBtn.textContent=scrollView?'דף אחד':'כל הדפים';
  students.forEach((p,i)=>p.hidden=scrollView?false:i!==idx);
  updateCounter();fitPage();
}
function fitPage(){
  if(mobileReader||innerWidth>850){book.style.removeProperty('--page-scale');return}
  book.style.setProperty('--page-scale',Math.min(1,(innerWidth-16)/794));
}
function scrollToPage(i){const top=students[i].getBoundingClientRect().top+scrollY-reader.offsetHeight-8;scrollTo({top:Math.max(0,top)})}
function goTo(i){idx=Math.max(0,Math.min(students.length-1,i));show();if(scrollView)scrollToPage(idx)}

// In scroll view the counter follows the page that occupies most of the viewport.
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
  if(mobileReader)return;
  scrollView=!scrollView;
  storeView(scrollView?'scroll':'paged');
  const next=new URL(location.href);next.searchParams.set('view',scrollView?'scroll':'paged');history.replaceState(null,'',next);
  show();
  if(scrollView)scrollToPage(idx);else scrollTo({top:0});
};
addEventListener('resize',fitPage);
show();