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
ok(index.includes('.scroll-view .page:not(:last-child){box-shadow:0 3px 0 #1d4ed8}'),'reader must use a full-width blue line as the only between-page separator');
ok(!index.includes('sheet-label'),'reader must not show page-count labels between pages');
ok(index.includes('#book{transition:opacity 180ms ease}')&&index.includes('#book.reader-fading{opacity:0}'),'reader must use a short fade transition for direct jumps');
ok(jump.includes("scrollIntoView({ block: 'start', behavior: 'auto' })"),'page selection must jump directly, not smooth-scroll through intervening pages');
ok(jump.includes("root.style.scrollBehavior = 'auto'")&&jump.includes("body.style.scrollBehavior = 'auto'"),'direct jump must temporarily disable smooth scrolling');
ok(jump.includes("window.addEventListener('scroll', syncFromScroll"),'page selector must follow manual scrolling');
ok(jump.includes("location.hash.match(/page=(\\d+)/)"),'deep-link #page=N support must remain available');
ok(jump.includes('FADE_MS = 180'),'fade duration must stay short and deterministic');

// SSOT §28.2: explicit cover state. While the cover is displayed the selector shows a disabled
// cover entry (never "עמוד 1"), so choosing page 1 from the cover is a real change and navigates.
ok(jump.includes("const COVER = 'cover'")&&jump.includes('option value="${COVER}" disabled'),'reader must model the cover as its own, non-selectable selector state (§28.2)');
ok(jump.includes('return best === 0 ? COVER : best'),'scroll position must derive the cover state from the displayed sheet (§28.2)');
ok(jump.includes("window.addEventListener('hashchange', openDeepLink)"),'in-page #page=N deep links must navigate and resync the selector');
// The behavioural regression gate must stay wired into the browser suite that CI runs.
const pkg=JSON.parse(read('./package.json'));
ok(/node reader-cover-regression-qa\.mjs/.test(pkg.scripts?.['qa:browser']||''),'reader-cover-regression-qa.mjs must run in npm run qa:browser (CI)');
const workflow=read('./.github/workflows/qa.yml');
ok(workflow.includes('npm run qa:browser'),'CI workflow must run npm run qa:browser');

if(failures.length){
  console.error(`READER JUMP QA FAILED (${failures.length})`);
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('READER JUMP QA PASS: continuous scroll + direct page selector + short fade + download-only action contract.');
