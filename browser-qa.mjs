import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const consoleErrors=[];
page.on('pageerror',e=>consoleErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(`console: ${m.text()}`)});

const url=pathToFileURL(path.resolve('index.html')).href;
await page.goto(url,{waitUntil:'load'});
await page.waitForTimeout(400);

const mmPx=96/25.4;
const expectedW=210*mmPx;
const expectedH=297*mmPx;

async function inspectViewport(width,height,label){
  await page.setViewportSize({width,height});
  await page.reload({waitUntil:'load'});
  await page.waitForTimeout(150);
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
      counter:document.querySelector('#counter')?.textContent||''
    };
  });
  ok(result.total===8,`${label}: expected 8 student pages, got ${result.total}`);
  ok(result.visible===1,`${label}: expected exactly one visible reader page, got ${result.visible}`);
  ok(Math.abs(result.rawW-expectedW)<2,`${label}: A4 width drift ${result.rawW}`);
  ok(Math.abs(result.rawH-expectedH)<2,`${label}: A4 height drift ${result.rawH}`);
  ok(!result.pageOverflow,`${label}: internal A4 overflow detected`);
  ok(!result.bodyOverflow,`${label}: shell horizontal overflow detected`);
  ok(result.controls.every(c=>c.w>=44&&c.h>=44),`${label}: touch target below 44px`);
  ok(result.counter==='1 / 8',`${label}: initial counter mismatch: ${result.counter}`);
  if(width<=850) ok(result.transformedW<=width-8,`${label}: scaled A4 wider than viewport`);
}

await inspectViewport(1440,1200,'desktop');
await inspectViewport(360,800,'android-portrait');
await inspectViewport(915,412,'android-landscape');
await inspectViewport(390,844,'iphone-portrait');
await inspectViewport(844,390,'iphone-landscape');

await page.setViewportSize({width:1440,height:1200});
await page.reload({waitUntil:'load'});
for(let i=1;i<8;i++) await page.click('#next');
ok((await page.textContent('#counter'))?.trim()==='8 / 8','navigation did not reach page 8');
ok(await page.isDisabled('#next'),'next button should disable on final page');
for(let i=1;i<8;i++) await page.click('#prev');
ok((await page.textContent('#counter'))?.trim()==='1 / 8','navigation did not return to page 1');

await page.emulateMedia({media:'print'});
const printResult=await page.evaluate(()=>({
  visible:[...document.querySelectorAll('.page')].filter(p=>getComputedStyle(p).display!=='none').length,
  transforms:[...document.querySelectorAll('.page')].map(p=>getComputedStyle(p).transform)
}));
ok(printResult.visible===8,`print: expected 8 printable pages, got ${printResult.visible}`);
ok(printResult.transforms.every(t=>t==='none'),`print: transformed/scaled A4 page detected`);

ok(consoleErrors.length===0,`browser console errors: ${consoleErrors.join(' | ')}`);
await browser.close();

if(failures.length){
  console.error('BROWSER QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('BROWSER QA PASS: 8 A4 pages; desktop + Android + iPhone portrait/landscape; navigation; print; no internal overflow.');
