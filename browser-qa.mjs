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
const DIAGRAM_SELECTOR='svg.cone-svg,svg.axial-svg,svg.orientation-cone,svg.comic-scene,svg.object-strip-svg,svg.compare-svg,svg.net-svg,svg.top-view-svg,svg.side-view-svg,svg.bare-triangle-svg,svg.net-options-svg,svg.net-label-svg,svg.sector-compare-svg,svg.sector-angle-svg,svg.sector-svg,svg.cone-cuts-svg,svg.ratio-svg,svg.diameter-cone-svg,svg.funnel-svg,svg.beam-svg,svg.arch-roofs,svg.arch-cyl-cone,svg.arch-sections,svg.circle-svg,svg.right-triangle-svg,svg.scale-cone-svg,img.cone-3d';
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
const CLIP_SELECTOR='svg.object-strip-svg,svg.compare-svg,svg.net-svg,svg.top-view-svg,svg.side-view-svg,svg.net-options-svg,svg.net-label-svg,svg.sector-compare-svg,svg.sector-angle-svg,svg.sector-svg,svg.cone-cuts-svg,svg.ratio-svg,svg.diameter-cone-svg,svg.funnel-svg,svg.beam-svg,svg.arch-roofs,svg.arch-cyl-cone,svg.arch-sections,svg.circle-svg,svg.right-triangle-svg,svg.scale-cone-svg';
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

// SSOT §15.3 (labels/numbers/units must not overlap the lines): the original
// labelSafety gate above only measured text.label inside cone/axial/orientation
// SVGs, so every expansion-diagram label (plain <text>, no .label class) shipped
// unchecked for stroke overlap. This gate covers EVERY measurable student diagram
// and EVERY <text> in it: a drawing stroke whose centreline passes through a
// label's glyph area (bbox inset toward the ink) is a §15.3 overlap and fails QA.
// Comic illustrations (svg.comic-scene) and raster art (img.cone-3d) are stylised
// scenes, not measurable diagrams, and are intentionally out of this gate's scope.
const OVERLAP_SELECTOR='svg.cone-svg,svg.axial-svg,svg.orientation-cone,'+CLIP_SELECTOR;
const TEXT_INSET=0.15; // shrink the text bbox toward the glyph ink before testing
const labelOverlap=await page.evaluate(({sel,INSET})=>{
  const pages=[...document.querySelectorAll('.page')];
  const prevHidden=pages.map(p=>p.hidden);
  pages.forEach(p=>{p.hidden=false;});
  void document.body.offsetHeight;
  const num=(el,a)=>+el.getAttribute(a);
  const sample=(el)=>{
    const tag=el.tagName.toLowerCase();const pts=[];
    if(tag==='line'){const x1=num(el,'x1'),y1=num(el,'y1'),x2=num(el,'x2'),y2=num(el,'y2');for(let i=0;i<=60;i++){const t=i/60;pts.push([x1+(x2-x1)*t,y1+(y2-y1)*t]);}}
    else if(tag==='ellipse'){const cx=num(el,'cx'),cy=num(el,'cy'),rx=num(el,'rx'),ry=num(el,'ry');for(let i=0;i<=120;i++){const a=2*Math.PI*i/120;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}}
    else if(tag==='circle'){const cx=num(el,'cx'),cy=num(el,'cy'),r=num(el,'r');for(let i=0;i<=120;i++){const a=2*Math.PI*i/120;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}}
    else if(tag==='rect'){const x=num(el,'x'),y=num(el,'y'),w=num(el,'width'),h=num(el,'height');const per=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];for(let s=0;s<4;s++)for(let i=0;i<=25;i++){const t=i/25;pts.push([per[s][0]+(per[s+1][0]-per[s][0])*t,per[s][1]+(per[s+1][1]-per[s][1])*t]);}}
    else if(tag==='polygon'||tag==='polyline'){const raw=(el.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number);const vs=[];for(let i=0;i+1<raw.length;i+=2)vs.push([raw[i],raw[i+1]]);if(tag==='polygon'&&vs.length)vs.push(vs[0]);for(let s=0;s+1<vs.length;s++)for(let i=0;i<=25;i++){const t=i/25;pts.push([vs[s][0]+(vs[s+1][0]-vs[s][0])*t,vs[s][1]+(vs[s+1][1]-vs[s][1])*t]);}}
    else{try{const len=el.getTotalLength?el.getTotalLength():0;if(len>0){const n=Math.max(60,Math.round(len/3));for(let i=0;i<=n;i++){const q=el.getPointAtLength(len*i/n);pts.push([q.x,q.y]);}}}catch(e){}}
    return pts;
  };
  const bad=[];
  for(const svg of document.querySelectorAll(sel)){
    const id=svg.getAttribute('aria-label')||svg.getAttribute('class');
    const strokes=[...svg.querySelectorAll('line,path,ellipse,circle,rect,polygon,polyline')]
      .filter(el=>{const cs=getComputedStyle(el);return cs.stroke&&cs.stroke!=='none'&&cs.strokeWidth!=='0px';})
      .map(sample);
    for(const t of svg.querySelectorAll('text')){
      const b=t.getBBox();if(b.width===0&&b.height===0)continue;
      const ix=b.x+b.width*INSET,iy=b.y+b.height*INSET,iw=b.width*(1-2*INSET),ih=b.height*(1-2*INSET);
      let hit=false;
      for(const pts of strokes){for(const [px,py] of pts){if(px>=ix&&px<=ix+iw&&py>=iy&&py<=iy+ih){hit=true;break;}}if(hit)break;}
      if(hit)bad.push(id+':"'+t.textContent+'" overlaps a drawing stroke');
    }
  }
  pages.forEach((p,i)=>{p.hidden=prevHidden[i];});
  return bad;
},{sel:OVERLAP_SELECTOR,INSET:TEXT_INSET});
ok(labelOverlap.length===0,'SSOT 15.3 diagram label overlaps a line: '+labelOverlap.join(' | '));

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
    const controls=[...document.querySelectorAll('.reader button,.reader a')].filter(b=>getComputedStyle(b).display!=='none').map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height,text:b.textContent.trim()}});
    return {
      total:pages.length,
      visible:visible.length,
      rawW,rawH,
      transformedW:box.width,
      transformedH:box.height,
      transformedLeft:box.left,
      transformedRight:box.right,
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
  ok(result.visible===canonicalPageCount,`${label}: public reader must open with all ${canonicalPageCount} pages in continuous scroll, got ${result.visible}`);
  ok(result.controls.length===1&&result.controls[0].text==='הורדת PDF',`${label}: exactly one visible action (הורדת PDF) allowed, got ${result.controls.map(c=>c.text).join('|')}`);
  ok(Math.abs(result.rawW-expectedW)<2,`${label}: A4 width drift ${result.rawW}`);
  ok(Math.abs(result.rawH-expectedH)<2,`${label}: A4 height drift ${result.rawH}`);
  ok(!result.pageOverflow,`${label}: internal A4 overflow detected`);
  ok(!result.bodyOverflow,`${label}: shell horizontal overflow detected`);
  ok(result.controls.every(c=>c.w>=44&&c.h>=44),`${label}: touch target below 44px`);
  ok(result.counter===`1 / ${canonicalPageCount}`,`${label}: initial counter mismatch: ${result.counter}`);
  ok(result.rubik&&result.heebo,`${label}: canonical Rubik/Heebo fonts did not load`);
  ok(result.imagesOk,`${label}: one or more required images failed to load`);
  if(width<=850)ok(result.transformedW<=width-8,`${label}: scaled A4 wider than viewport`);
  // §20.1: on mobile the scaled A4 page must be fully visible (not pushed off-screen / clipped).
  // #book{overflow:hidden} would otherwise mask a horizontal clip from the bodyOverflow check.
  if(width<=850)ok(result.transformedLeft>=-1&&result.transformedRight<=width+1,`${label}: scaled A4 horizontally clipped (left=${Math.round(result.transformedLeft)}, right=${Math.round(result.transformedRight)}, viewport=${width})`);
}

await inspectViewport(1440,1200,'desktop');
await inspectViewport(360,800,'android-portrait');
await inspectViewport(915,412,'android-landscape');
await inspectViewport(390,844,'iphone-portrait');
await inspectViewport(844,390,'iphone-landscape');

// SSOT §20.3 public reader: continuous scroll by default (no ?view needed),
// sticky non-button counter follows the scroll, A4 geometry/overflow rules
// hold, print pagination unchanged. No hidden-control clicks (§20.7).
// Reader shell uses scroll-behavior:smooth + scroll-snap; QA scrolls instantly
// and waits for the position to settle before reading the sticky counter.
async function scrollReaderTo(pageIndex){
  await page.evaluate((i)=>{
    const pages=[...document.querySelectorAll('.page')];
    const top=i<0?0:pages[i].getBoundingClientRect().top+scrollY-document.querySelector('.reader').offsetHeight-8;
    document.documentElement.style.scrollBehavior='auto';
    scrollTo({top:Math.max(0,top),behavior:'instant'});
  },pageIndex);
  await page.waitForFunction(()=>new Promise(r=>{let last=scrollY;setTimeout(()=>r(last===scrollY),120)}));
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='';dispatchEvent(new Event('scroll'))});
  await page.waitForTimeout(100);
}
async function inspectScrollView(width,height,label){
  await page.setViewportSize({width,height});
  await page.goto(url,{waitUntil:'load'});
  await page.waitForTimeout(150);
  await waitForAssets();
  const result=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.page')];
    const counterEl=document.querySelector('#counter');
    return {
      scrollClass:document.body.classList.contains('scroll-view'),
      view:new URL(location.href).searchParams.get('view'),
      visible:pages.filter(p=>getComputedStyle(p).display!=='none').length,
      bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,
      pageOverflow:pages.some(p=>p.scrollWidth>p.clientWidth+1||p.scrollHeight>p.clientHeight+1),
      scrollable:document.documentElement.scrollHeight>innerHeight+1,
      counter:counterEl?.textContent||'',
      counterIsButton:!!counterEl?.closest('button,a'),
      sticky:getComputedStyle(document.querySelector('.reader')).position==='sticky',
      download:(()=>{const a=document.querySelector('a.download-pdf');return a&&a.hasAttribute('download')&&new URL(a.href).origin===location.origin&&getComputedStyle(a).display!=='none'})(),
      selector:(()=>{const sel=document.querySelector('#page-selector');if(!sel)return null;const r=sel.getBoundingClientRect();return {visible:getComputedStyle(sel).display!=='none'&&r.height>0,h:r.height,options:sel.options.length,text:sel.options[sel.selectedIndex]?.textContent.trim(),isButton:sel.tagName!=='SELECT'}})(),
      forbiddenVisible:[...document.querySelectorAll('#prev,#next,#view-toggle,.reader button')].filter(el=>getComputedStyle(el).display!=='none').length
    };
  });
  ok(result.scrollClass&&result.view==='scroll',`${label}: public reader did not open in continuous scroll`);
  ok(result.visible===canonicalPageCount,`${label}: scroll view must show all ${canonicalPageCount} pages, got ${result.visible}`);
  ok(result.counter===`1 / ${canonicalPageCount}`,`${label}: initial counter mismatch: ${result.counter}`);
  ok(!result.counterIsButton&&result.sticky,`${label}: counter must be a sticky non-button read-out`);
  ok(result.download,`${label}: הורדת PDF must be a visible same-origin download link`);
  ok(result.selector&&result.selector.visible&&!result.selector.isButton&&result.selector.options===canonicalPageCount&&result.selector.text===`עמוד 1 מתוך ${canonicalPageCount}`,`${label}: compact page <select> must be visible with ${canonicalPageCount} options reading "עמוד X מתוך N" (got ${JSON.stringify(result.selector)})`);
  ok(result.selector&&result.selector.h>=40,`${label}: page selector touch target too small (${result.selector?.h}px)`);
  ok(result.forbiddenVisible===0,`${label}: prev/next/view-toggle/print controls must not be visible (${result.forbiddenVisible})`);
  ok(!result.pageOverflow,`${label}: scroll view internal A4 overflow detected`);
  ok(!result.bodyOverflow,`${label}: scroll view horizontal overflow detected`);
  ok(result.scrollable,`${label}: scroll view must be vertically scrollable`);
  await scrollReaderTo(4);
  ok((await page.textContent('#counter'))?.trim()===`5 / ${canonicalPageCount}`,`${label}: counter did not follow a manual scroll to page 5`);
  ok(await page.$eval('#page-selector',el=>Number(el.value))===5,`${label}: page selector did not follow a manual scroll to page 5`);
  // §20.3 selector: choosing a page = short fade + instant jump (no smooth scroll through the pages in between).
  await scrollReaderTo(-1);
  const jumpTarget=Math.min(canonicalPageCount,30);
  const t0=Date.now();
  await page.selectOption('#page-selector',String(jumpTarget));
  const faded=await page.waitForFunction(()=>document.getElementById('book').classList.contains('reader-fading'),null,{timeout:1000}).then(()=>true).catch(()=>false);
  ok(faded,`${label}: selecting a page must fade #book out (reader-fading) before the jump`);
  await page.waitForFunction(()=>!document.getElementById('book').classList.contains('reader-fading'),null,{timeout:2000});
  const jumpMs=Date.now()-t0;
  await page.waitForTimeout(250);
  const landed=await page.evaluate((n)=>{const p=document.querySelectorAll('.page')[n-1].getBoundingClientRect();const bar=document.querySelector('.reader').getBoundingClientRect();
    return {top:p.top-bar.bottom,sel:Number(document.getElementById('page-selector').value),hash:location.hash,transition:getComputedStyle(document.getElementById('book')).transitionDuration}},jumpTarget);
  ok(landed.top>-40&&landed.top<60,`${label}: selector jump must land page ${jumpTarget} under the sticky bar (offset ${Math.round(landed.top)}px)`);
  ok(landed.sel===jumpTarget&&landed.hash===`#page=${jumpTarget}`,`${label}: selector/hash must reflect the jumped page (sel=${landed.sel}, hash=${landed.hash})`);
  ok(jumpMs<900,`${label}: page jump must be a short fade-jump, not a long smooth scroll (${jumpMs}ms)`);
  const tr=parseFloat(landed.transition)*(/ms$/.test(landed.transition)?1:1000);
  ok(tr>=150&&tr<=220,`${label}: #book fade transition must be 150–220ms (got ${landed.transition})`);
  await scrollReaderTo(-1);
  ok(await page.$eval('#page-selector',el=>Number(el.value))===1,`${label}: selector did not return to page 1 on scroll`);
  await page.emulateMedia({media:'print'});
  const printMargins=await page.evaluate(()=>[...document.querySelectorAll('.page')].map(p=>getComputedStyle(p).marginBottom));
  ok(printMargins.every(m=>m==='0px'),`${label}: scroll view must print without inter-page margins (${[...new Set(printMargins)].join(',')})`);
  await page.emulateMedia({media:null});
  await scrollReaderTo(-1);
}
await inspectScrollView(1440,1200,'desktop-scroll');
await page.goto(url,{waitUntil:'load'});

await page.setViewportSize({width:1440,height:1200});
await page.reload({waitUntil:'load'});
await waitForAssets();
fs.mkdirSync('qa-artifacts',{recursive:true});
await page.evaluate(()=>{document.querySelector('.reader').style.visibility='hidden'});
for(let i=1;i<=canonicalPageCount;i++){
  await page.locator('.page').nth(i-1).screenshot({path:`qa-artifacts/page-${String(i).padStart(2,'0')}.png`});
}
await page.evaluate(()=>{document.querySelector('.reader').style.visibility=''});
// Sticky counter follows the scroll position (no prev/next clicks — §20.7).
await scrollReaderTo(canonicalPageCount-1);
ok((await page.textContent('#counter'))?.trim()===`${canonicalPageCount} / ${canonicalPageCount}`,'counter did not reach final page on scroll');
await scrollReaderTo(-1);
ok((await page.textContent('#counter'))?.trim()===`1 / ${canonicalPageCount}`,'counter did not return to page 1 on scroll');

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
console.log(`BROWSER QA PASS: HTTP-served workbook; ${canonicalPageCount} A4 pages; ${subsectionAudit.count} independent subsection work units; canonical fonts/images; desktop + Android + iPhone portrait/landscape; continuous-scroll reader with page selector fade-jump; print; screenshots; PDF ${pdfBytes.length} bytes / ${canonicalPageCount} A4 pages; no internal overflow.`);
