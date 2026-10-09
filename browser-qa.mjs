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

// SSOT §13.5 + §18.3: page 1 shows no בס"ד line and carries the Ayelet credit
// footer only; every later page keeps the shared two-line district footer.
const footerAudit=await page.evaluate(()=>{
  const pages=[...document.querySelectorAll('.page')];
  const text=p=>(p.querySelector('.gz-footer')?.textContent||'').replace(/\s+/g,' ').trim();
  const first=pages[0].querySelector('.gz-footer');
  return {
    first:text(pages[0]),
    firstHasLogo:Boolean(first?.querySelector('.district-logo')),
    firstOverflow:first?(first.scrollWidth>first.clientWidth+1||first.scrollHeight>first.clientHeight+1):true,
    othersShared:pages.slice(1).filter(p=>text(p).includes('יניב רז')&&text(p).includes('בהובלת איילת קריספין')).length,
    others:pages.length-1,
    bsd:pages.some(p=>/בס['"״]ד/.test(p.textContent))
  };
});
ok(footerAudit.first.includes('איילת קריספין')&&footerAudit.first.includes('מתכללת')&&!footerAudit.first.includes('יניב רז'),`page 1 footer must carry the Ayelet credit only, got: ${footerAudit.first}`);
ok(footerAudit.firstHasLogo,'page 1 footer must keep the verified district logo');
ok(!footerAudit.firstOverflow,'page 1 credit footer overflows its footer box');
ok(footerAudit.othersShared===footerAudit.others,`every page after page 1 must keep the shared district footer (${footerAudit.othersShared}/${footerAudit.others})`);
ok(!footerAudit.bsd,'no student page may show the בס"ד line (SSOT §13.5)');

// SSOT 15.1 + 15.3: diagram labels are deterministic and must not overlap
// structural strokes, nor clip outside the viewBox (safe label zones). This
// geometric gate replaces assertion-only "manual review" evidence for R25.
// Pages are temporarily un-hidden so getBBox has a real layout for every SVG.
const LABEL_CLEARANCE=2; // minimum user-unit gap between a label box and any stroke edge
const labelSafety=await page.evaluate((MIN)=>{
  const pages=[...document.querySelectorAll('.page')];
  const prevHidden=pages.map(p=>p.hidden);
  pages.forEach(p=>{p.hidden=false;});
  void document.body.offsetHeight; // force synchronous layout
  const sample=(el)=>{
    const tag=el.tagName.toLowerCase();const pts=[];
    if(tag==='line'){
      const x1=+el.getAttribute('x1'),y1=+el.getAttribute('y1'),x2=+el.getAttribute('x2'),y2=+el.getAttribute('y2');
      for(let i=0;i<=40;i++){const t=i/40;pts.push([x1+(x2-x1)*t,y1+(y2-y1)*t]);}
    }else{
      try{
        const len=el.getTotalLength?el.getTotalLength():0;
        if(len>0){const n=Math.max(40,Math.round(len/4));for(let i=0;i<=n;i++){const q=el.getPointAtLength(len*i/n);pts.push([q.x,q.y]);}}
        else if(tag==='ellipse'){const cx=+el.getAttribute('cx'),cy=+el.getAttribute('cy'),rx=+el.getAttribute('rx'),ry=+el.getAttribute('ry');for(let i=0;i<=80;i++){const a=2*Math.PI*i/80;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}}
      }catch(e){}
    }
    return {pts,half:(parseFloat(getComputedStyle(el).strokeWidth)||0)/2};
  };
  const violations=[];
  for(const svg of document.querySelectorAll('svg.cone-svg,svg.axial-svg,svg.orientation-cone')){
    const vb=svg.viewBox.baseVal;
    const strokes=[...svg.querySelectorAll('line,path,ellipse')]
      .filter(el=>{const cs=getComputedStyle(el);return cs.stroke&&cs.stroke!=='none'&&cs.strokeWidth!=='0px';})
      .map(sample);
    for(const t of svg.querySelectorAll('text.label')){
      const b=t.getBBox();const id=svg.getAttribute('aria-label')+':"'+t.textContent+'"';
      if(b.width===0&&b.height===0)continue; // not laid out (should not happen after un-hide)
      if(b.x<vb.x-0.5||b.y<vb.y-0.5||b.x+b.width>vb.x+vb.width+0.5||b.y+b.height>vb.y+vb.height+0.5)violations.push(id+' clipped outside viewBox');
      let min=Infinity;
      for(const st of strokes)for(const [px,py] of st.pts){
        const dx=Math.max(b.x-px,0,px-(b.x+b.width));
        const dy=Math.max(b.y-py,0,py-(b.y+b.height));
        const d=Math.hypot(dx,dy)-st.half;
        if(d<min)min=d;
      }
      if(min<MIN)violations.push(id+' clearance '+(Math.round(min*10)/10)+' < '+MIN);
    }
  }
  pages.forEach((p,i)=>{p.hidden=prevHidden[i];});
  return violations;
},LABEL_CLEARANCE);
ok(labelSafety.length===0,'SSOT 15.3 diagram label-safety: '+labelSafety.join(' | '));

// SSOT §16.2: a diagram must stay inside the box reserved for it. A width-driven
// SVG/image can paint far outside a fixed-height container (overflow:visible) and
// silently collide with the text above/below it WITHOUT growing the page's
// scrollHeight — so the A4-overflow gate above is blind to it. This geometric gate
// asserts every student-page diagram's painted rect is contained within its direct
// parent box, which is the root invariant that keeps diagrams off the surrounding
// text. Scope is the curated student-diagram classes only: MathJax glyph <svg>s
// (wrapped in mjx-container) and the locked page-1 source reproduction are guarded
// by their own gates and are deliberately excluded to avoid false positives.
const DIAGRAM_SELECTOR='svg.cone-svg,svg.axial-svg,svg.orientation-cone,svg.comic-scene,svg.object-strip-svg,svg.compare-svg,svg.net-svg,svg.top-view-svg,svg.side-view-svg,svg.bare-triangle-svg,svg.net-options-svg,svg.net-label-svg,svg.sector-compare-svg,svg.sector-angle-svg,svg.sector-svg,svg.cone-cuts-svg,svg.ratio-svg,svg.diameter-cone-svg,svg.funnel-svg,svg.beam-svg,svg.arch-roofs,svg.arch-cyl-cone,svg.arch-sections,svg.circle-svg,svg.right-triangle-svg,img.cone-3d';
const SPILL_TOLERANCE=2; // px (~0.5mm) for sub-pixel rounding
const containment=await page.evaluate(({sel,EPS})=>{
  const pages=[...document.querySelectorAll('.page')];
  const prevHidden=pages.map(p=>p.hidden);
  pages.forEach(p=>{p.hidden=false;});
  void document.body.offsetHeight; // force synchronous layout for every page
  const bad=[];
  pages.forEach((pg,pi)=>{
    for(const fig of pg.querySelectorAll(sel)){
      const parent=fig.parentElement;
      if(!parent)continue;
      const fr=fig.getBoundingClientRect();
      if(fr.width===0&&fr.height===0)continue; // not laid out
      const pr=parent.getBoundingClientRect();
      const spill=Math.max(0,pr.top-fr.top,fr.bottom-pr.bottom,pr.left-fr.left,fr.right-pr.right);
      if(spill>EPS){
        const cls=fig.getAttribute('class')?'.'+fig.getAttribute('class').trim().replace(/\s+/g,'.'):'';
        const pcls=parent.getAttribute('class')?'.'+parent.getAttribute('class').trim().replace(/\s+/g,'.'):'';
        bad.push(`page ${pi+1}: <${fig.tagName.toLowerCase()}${cls}> spills ${Math.round(spill)}px out of <${parent.tagName.toLowerCase()}${pcls}>`);
      }
    }
  });
  pages.forEach((p,i)=>{p.hidden=prevHidden[i];});
  return bad;
},{sel:DIAGRAM_SELECTOR,EPS:SPILL_TOLERANCE});
ok(containment.length===0,'SSOT 16.2 figure containment (diagram spills out of its box onto surrounding content): '+containment.join(' | '));

// SSOT §15.3 for the expansion diagrams: a text label positioned near a viewBox edge
// with the wrong text-anchor is silently clipped and loses characters. The measured
// cone/axial/orientation diagrams are covered by the label-safety gate above; this
// gate asserts that every <text> in the new instructional SVGs stays inside its own
// viewBox, so clipped labels fail QA instead of shipping.
const CLIP_SELECTOR='svg.object-strip-svg,svg.compare-svg,svg.net-svg,svg.top-view-svg,svg.side-view-svg,svg.net-options-svg,svg.net-label-svg,svg.sector-compare-svg,svg.sector-angle-svg,svg.sector-svg,svg.cone-cuts-svg,svg.ratio-svg,svg.diameter-cone-svg,svg.funnel-svg,svg.beam-svg,svg.arch-roofs,svg.arch-cyl-cone,svg.arch-sections,svg.circle-svg,svg.right-triangle-svg';
const labelClip=await page.evaluate((sel)=>{
  const pages=[...document.querySelectorAll('.page')];
  const prevHidden=pages.map(p=>p.hidden);
  pages.forEach(p=>{p.hidden=false;});
  void document.body.offsetHeight;
  const bad=[];
  for(const svg of document.querySelectorAll(sel)){
    const vb=svg.viewBox.baseVal;
    for(const t of svg.querySelectorAll('text')){
      const b=t.getBBox();
      if(b.width===0&&b.height===0)continue;
      if(b.x<vb.x-1||b.y<vb.y-1||b.x+b.width>vb.x+vb.width+1||b.y+b.height>vb.y+vb.height+1){
        bad.push((svg.getAttribute('aria-label')||svg.getAttribute('class'))+':"'+t.textContent+'" clipped outside viewBox');
      }
    }
  }
  pages.forEach((p,i)=>{p.hidden=prevHidden[i];});
  return bad;
},CLIP_SELECTOR);
ok(labelClip.length===0,'SSOT 15.3 expansion-diagram label clipping: '+labelClip.join(' | '));

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
