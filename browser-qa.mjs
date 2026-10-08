import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const root=process.cwd();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://127.0.0.1').pathname;
  const rel=pathname==='/'?'index.html':pathname.replace(/^\//,'');
  const file=path.resolve(root,rel);
  if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,buf)=>{
    if(err){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    res.end(buf);
  });
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
const url=`http://127.0.0.1:${address.port}/`;

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const consoleErrors=[];
page.on('pageerror',e=>consoleErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(`console: ${m.text()}`)});
await page.goto(url,{waitUntil:'load'});
await page.waitForTimeout(400);

const mmPx=96/25.4;
const expectedW=210*mmPx;
const expectedH=297*mmPx;

async function waitForAssets(){
  await page.evaluate(async()=>{
    if(window.MathJax?.startup?.promise)await window.MathJax.startup.promise;
    if(document.fonts){
      await Promise.all([
        document.fonts.load('16px "Rubik"','אבג'),
        document.fonts.load('16px "Heebo"','אבג')
      ]);
      await document.fonts.ready;
    }
    await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
      img.addEventListener('load',resolve,{once:true});
      img.addEventListener('error',resolve,{once:true});
    })));
  });
}

await waitForAssets();
const canonicalPageCount=await page.locator('.page').count();
ok(canonicalPageCount>=8,`canonical workbook must have at least 8 student pages, got ${canonicalPageCount}`);
const subsectionAudit=await page.evaluate(()=>{
  const parts=[...document.querySelectorAll('.subpart')];
  return {
    count:parts.length,
    invalid:parts.filter(part=>!part.querySelector('.work-grid')||!part.querySelector('.final-answer')).map(part=>part.dataset.subpart||'?'),
    emptyMarkers:parts.filter(part=>!part.dataset.subpart).length,
    answerLabels:parts.filter(part=>(part.querySelector('.final-answer')?.textContent||'').includes('תשובה:')).length
  };
});
ok(subsectionAudit.count>=11,`expected at least 11 independently rendered subsections, got ${subsectionAudit.count}`);
ok(subsectionAudit.invalid.length===0,`subsections without dedicated work grid + answer: ${subsectionAudit.invalid.join(', ')}`);
ok(subsectionAudit.emptyMarkers===0,'every subsection must have a stable data-subpart marker');
ok(subsectionAudit.answerLabels===subsectionAudit.count,'every subsection must visibly include its own תשובה: label');

async function inspectViewport(width,height,label){
  await page.setViewportSize({width,height});
  await page.reload({waitUntil:'load'});
  await page.waitForTimeout(150);
  await waitForAssets();
  const result=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.page')];
    const visible=pages.filter(p=>getComputedStyle(p).display!=='none');
    const box=pages[0].getBoundingClientRect();
    const rawW=parseFloat(getComputedStyle(pages[0]).width);
    const rawH=parseFloat(getComputedStyle(pages[0]).height);
    const controls=[...document.querySelectorAll('button')].map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height}});
    return {
      total:pages.length,
      visible:visible.length,
      rawW,rawH,
      transformedW:box.width,
      transformedH:box.height,
      bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,
      pageOverflow:pages.some(p=>p.scrollWidth>p.clientWidth+1||p.scrollHeight>p.clientHeight+1),
      controls,
      counter:document.querySelector('#counter')?.textContent||'',
      rubik:document.fonts?.check('16px "Rubik"','אבג')??true,
      heebo:document.fonts?.check('16px "Heebo"','אבג')??true,
      imagesOk:[...document.images].every(img=>img.complete&&img.naturalWidth>0)
    };
  });
  ok(result.total===canonicalPageCount,`${label}: page-count drift; expected ${canonicalPageCount}, got ${result.total}`);
  ok(result.visible===1,`${label}: expected exactly one visible reader page, got ${result.visible}`);
  ok(Math.abs(result.rawW-expectedW)<2,`${label}: A4 width drift ${result.rawW}`);
  ok(Math.abs(result.rawH-expectedH)<2,`${label}: A4 height drift ${result.rawH}`);
  ok(!result.pageOverflow,`${label}: internal A4 overflow detected`);
  ok(!result.bodyOverflow,`${label}: shell horizontal overflow detected`);
  ok(result.controls.every(c=>c.w>=44&&c.h>=44),`${label}: touch target below 44px`);
  ok(result.counter===`1 / ${canonicalPageCount}`,`${label}: initial counter mismatch: ${result.counter}`);
  ok(result.rubik&&result.heebo,`${label}: canonical Rubik/Heebo fonts did not load`);
  ok(result.imagesOk,`${label}: one or more required images failed to load`);
  if(width<=850)ok(result.transformedW<=width-8,`${label}: scaled A4 wider than viewport`);
}

await inspectViewport(1440,1200,'desktop');
await inspectViewport(360,800,'android-portrait');
await inspectViewport(915,412,'android-landscape');
await inspectViewport(390,844,'iphone-portrait');
await inspectViewport(844,390,'iphone-landscape');

// Continuous scroll view: every student page visible in one scrollable flow,
// counter follows navigation, A4 geometry/overflow rules still hold, print
// pagination unchanged, and the toggle returns to the single-page reader.
async function inspectScrollView(width,height,label){
  await page.setViewportSize({width,height});
  await page.goto(`${url}?view=scroll`,{waitUntil:'load'});
  await page.waitForTimeout(150);
  await waitForAssets();
  const result=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.page')];
    return {
      scrollClass:document.body.classList.contains('scroll-view'),
      pressed:document.querySelector('#view-toggle')?.getAttribute('aria-pressed'),
      visible:pages.filter(p=>getComputedStyle(p).display!=='none').length,
      bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,
      pageOverflow:pages.some(p=>p.scrollWidth>p.clientWidth+1||p.scrollHeight>p.clientHeight+1),
      scrollable:document.documentElement.scrollHeight>innerHeight+1,
      counter:document.querySelector('#counter')?.textContent||'',
      toggle:(()=>{const r=document.querySelector('#view-toggle').getBoundingClientRect();return {w:r.width,h:r.height}})()
    };
  });
  ok(result.scrollClass&&result.pressed==='true',`${label}: ?view=scroll did not activate the scroll view`);
  ok(result.visible===canonicalPageCount,`${label}: scroll view must show all ${canonicalPageCount} pages, got ${result.visible}`);
  ok(result.counter===`1 / ${canonicalPageCount}`,`${label}: scroll view initial counter mismatch: ${result.counter}`);
  ok(!result.pageOverflow,`${label}: scroll view internal A4 overflow detected`);
  ok(!result.bodyOverflow,`${label}: scroll view horizontal overflow detected`);
  ok(result.scrollable,`${label}: scroll view must be vertically scrollable`);
  ok(result.toggle.w>=44&&result.toggle.h>=44,`${label}: view toggle below 44px touch target`);
  await page.click('#next');
  await page.waitForTimeout(300);
  ok((await page.textContent('#counter'))?.trim()===`2 / ${canonicalPageCount}`,`${label}: scroll view next did not move the counter to page 2`);
  await page.evaluate(()=>{const p=document.querySelectorAll('.page')[4];scrollTo({top:p.getBoundingClientRect().top+scrollY-document.querySelector('.reader').offsetHeight-8})});
  await page.waitForTimeout(300);
  ok((await page.textContent('#counter'))?.trim()===`5 / ${canonicalPageCount}`,`${label}: counter did not follow a manual scroll to page 5`);
  await page.emulateMedia({media:'print'});
  const printMargins=await page.evaluate(()=>[...document.querySelectorAll('.page')].map(p=>getComputedStyle(p).marginBottom));
  ok(printMargins.every(m=>m==='0px'),`${label}: scroll view must print without inter-page margins (${[...new Set(printMargins)].join(',')})`);
  await page.emulateMedia({media:null});
  await page.click('#view-toggle');
  await page.waitForTimeout(150);
  const paged=await page.evaluate(()=>({
    visible:[...document.querySelectorAll('.page')].filter(p=>getComputedStyle(p).display!=='none').length,
    scrollClass:document.body.classList.contains('scroll-view'),
    view:new URL(location.href).searchParams.get('view')
  }));
  ok(paged.visible===1&&!paged.scrollClass&&paged.view==='paged',`${label}: toggle did not return to the single-page reader`);
  await page.evaluate(()=>{try{localStorage.clear()}catch{}});
}
await inspectScrollView(1440,1200,'desktop-scroll');
await inspectScrollView(360,800,'android-portrait-scroll');
await page.goto(url,{waitUntil:'load'});

await page.setViewportSize({width:1440,height:1200});
await page.reload({waitUntil:'load'});
await waitForAssets();
fs.mkdirSync('qa-artifacts',{recursive:true});
for(let i=1;i<=canonicalPageCount;i++){
  const pageEl=page.locator('.page:not([hidden])');
  await pageEl.screenshot({path:`qa-artifacts/page-${String(i).padStart(2,'0')}.png`});
  if(i<canonicalPageCount)await page.click('#next');
}
ok((await page.textContent('#counter'))?.trim()===`${canonicalPageCount} / ${canonicalPageCount}`,'navigation did not reach final page');
ok(await page.isDisabled('#next'),'next button should disable on final page');
for(let i=1;i<canonicalPageCount;i++)await page.click('#prev');
ok((await page.textContent('#counter'))?.trim()===`1 / ${canonicalPageCount}`,'navigation did not return to page 1');

await page.emulateMedia({media:'print'});
const printResult=await page.evaluate(()=>({
  visible:[...document.querySelectorAll('.page')].filter(p=>getComputedStyle(p).display!=='none').length,
  transforms:[...document.querySelectorAll('.page')].map(p=>getComputedStyle(p).transform)
}));
ok(printResult.visible===canonicalPageCount,`print: expected ${canonicalPageCount} printable pages, got ${printResult.visible}`);
ok(printResult.transforms.every(t=>t==='none'),`print: transformed/scaled A4 page detected`);

const pdfPath='qa-artifacts/cone-student.pdf';
await page.pdf({path:pdfPath,format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',right:'0',bottom:'0',left:'0'}});
const pdfBytes=fs.readFileSync(pdfPath);
const pdf=await PDFDocument.load(pdfBytes);
ok(pdf.getPageCount()===canonicalPageCount,`PDF: expected ${canonicalPageCount} pages, got ${pdf.getPageCount()}`);
const a4Pt={w:595.28,h:841.89};
pdf.getPages().forEach((p,i)=>{
  const {width,height}=p.getSize();
  ok(Math.abs(width-a4Pt.w)<1.5&&Math.abs(height-a4Pt.h)<1.5,`PDF page ${i+1}: not A4 (${width} x ${height})`);
});
ok(pdfBytes.length>50000,`PDF: suspiciously small (${pdfBytes.length} bytes)`);

ok(consoleErrors.length===0,`browser console errors: ${consoleErrors.join(' | ')}`);
await browser.close();
await new Promise(resolve=>server.close(resolve));

if(failures.length){
  console.error('BROWSER QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`BROWSER QA PASS: HTTP-served workbook; ${canonicalPageCount} A4 pages; ${subsectionAudit.count} independent subsection work units; canonical fonts/images; desktop + Android + iPhone portrait/landscape; navigation; print; screenshots; PDF ${pdfBytes.length} bytes / ${canonicalPageCount} A4 pages; no internal overflow.`);
