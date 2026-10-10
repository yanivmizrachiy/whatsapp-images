import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const ok=(condition,message)=>{if(!condition)failures.push(message)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://127.0.0.1').pathname;
  const rel=pathname==='/'?'index.html':pathname.replace(/^\//,'');
  const file=path.resolve(root,rel);
  if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);res.end();return;}
  fs.readFile(file,(error,buffer)=>{
    if(error){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    res.end(buffer);
  });
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}/`;

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));
await page.goto(url,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(150);

const audit=await page.evaluate(()=>{
  const book=document.querySelector('#book');
  const headings=[...book.querySelectorAll('.page-header h1')].map(node=>node.textContent.replace(/\s+/g,' ').trim());
  const table=book.querySelector('table[data-student-units="explicit"]');
  const headers=table?[...table.querySelectorAll('thead th')].map(node=>node.textContent.replace(/\s+/g,' ').trim()):[];
  const rows=table?[...table.querySelectorAll('tbody tr')].map(row=>[...row.cells].map(cell=>({text:cell.textContent.replace(/\s+/g,' ').trim(),unit:cell.dataset.unit||''}))):[];
  const captions=[...book.querySelectorAll('.dim-change-figure .dc-cell figcaption span')].map(node=>node.textContent.replace(/\s+/g,' ').trim());
  const ellipses=[...book.querySelectorAll('.scale-cone-svg ellipse')].map(node=>({rx:Number(node.getAttribute('rx')),ry:Number(node.getAttribute('ry'))}));
  const formulaNotes=[...book.querySelectorAll('.formula-completion')].map(node=>node.textContent.replace(/\s+/g,' ').trim());
  const grids=[...book.querySelectorAll('.work-grid')];
  const volumePage=[...book.querySelectorAll('.page')].find(node=>(node.querySelector('.page-header h1')?.textContent||'').trim()==='נפח חרוט');
  return {
    applied:book.dataset.studentDisplayPolicy,
    headings,
    headers,
    rows,
    captions,
    ellipses,
    formulaNotes,
    gridCount:grids.length,
    volumeGridCount:volumePage?volumePage.querySelectorAll('.work-grid').length:0
  };
});

ok(audit.applied==='applied','student display policy did not run');
ok(!audit.headings.some(title=>title.includes('השלימו:')),'student page title still contains a demo/completion prompt');
ok(audit.headings.includes('נפח חרוט'),'volume topic title missing after normalization');
ok(audit.headings.includes('נפח חרוט — קירוב מספרי'),'numeric-approximation topic title missing after normalization');
ok(audit.formulaNotes.length===2,'both active formula completions must remain visible outside the title');
ok(audit.headers.join('|')==='רדיוס (ס״מ)|קוטר (ס״מ)|גובה (ס״מ)|נפח מדויק (סמ״ק)',`unexpected volume-table headers: ${audit.headers.join('|')}`);
for(const row of audit.rows){
  row.forEach((cell,index)=>{
    if(!cell.text)return;
    const expected=index<3?'ס״מ':'סמ״ק';
    ok(cell.unit===expected&&cell.text.includes(expected),`table cell lacks explicit ${expected}: ${cell.text}`);
  });
}
ok(audit.captions.join('|')==='רדיוס = 3 ס״מ, גובה = 8 ס״מ|רדיוס = 3 ס״מ, גובה = 16 ס״מ|רדיוס = 6 ס״מ, גובה = 8 ס״מ',`dimension captions are not fully unit-qualified: ${audit.captions.join('|')}`);
ok(audit.ellipses.length===3,'expected three to-scale cone base ellipses');
for(const ellipse of audit.ellipses)ok(Math.abs(ellipse.ry-Math.max(7,ellipse.rx*0.3))<1e-9,`scale-cone ellipse ratio drifted: rx=${ellipse.rx}, ry=${ellipse.ry}`);
ok(audit.gridCount>0&&audit.volumeGridCount>=2,'canonical calculation grids were lost from the student volume page');
ok(pageErrors.length===0,`page errors: ${pageErrors.join(' | ')}`);

await browser.close();
await new Promise(resolve=>server.close(resolve));

if(failures.length){
  console.error('STUDENT DISPLAY POLICY BROWSER QA FAIL');
  failures.forEach((failure,index)=>console.error(`${index+1}. ${failure}`));
  process.exit(1);
}
console.log('STUDENT DISPLAY POLICY BROWSER QA PASS: rendered titles, units, diameter terminology, scale figure and calculation grids are correct.');
