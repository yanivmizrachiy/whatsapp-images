import fs from 'node:fs';

const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const index=read('./index.html');
const jump=read('./reader-jump.js');
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};

ok(index.includes('id="page-selector"'),'public reader must expose one compact page selector');
ok(index.includes('class="reader-action download-pdf"'),'public reader must expose the PDF download action');
ok(index.includes('.reader .reader-internal{display:none!important}'),'legacy navigation controls must remain hidden');
ok((index.match(/class="reader-action[^"]*"/g)||[]).length===1,'PDF download must be the only visible action button/link');
ok(index.includes('reader-jump.js'),'direct page-jump controller must be loaded');
ok(index.includes('#book{transition:opacity 180ms ease}')&&index.includes('#book.reader-fading{opacity:0}'),'reader must use a short fade transition for direct jumps');
ok(jump.includes("scrollIntoView({ block: 'start', behavior: 'auto' })"),'page selection must jump directly, not smooth-scroll through intervening pages');
ok(jump.includes("root.style.scrollBehavior = 'auto'")&&jump.includes("body.style.scrollBehavior = 'auto'"),'direct jump must temporarily disable smooth scrolling');
ok(jump.includes("window.addEventListener('scroll', syncFromScroll"),'page selector must follow manual scrolling');
ok(jump.includes("location.hash.match(/page=(\\d+)/)"),'deep-link #page=N support must remain available');
ok(jump.includes('FADE_MS = 180'),'fade duration must stay short and deterministic');

if(failures.length){
  console.error(`READER JUMP QA FAILED (${failures.length})`);
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('READER JUMP QA PASS: continuous scroll + direct page selector + short fade + download-only action contract.');
