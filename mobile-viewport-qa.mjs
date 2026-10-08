import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

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
const {port}=server.address();
const base=`http://127.0.0.1:${port}/`;
const browser=await chromium.launch({headless:true});
const failures=[];

async function check(width,height){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(`${base}?view=scroll&mobile=1`,{waitUntil:'load'});
  await page.waitForTimeout(300);
  const result=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.page')].filter(p=>getComputedStyle(p).display!=='none');
    const first=pages[0];
    const firstRect=first.getBoundingClientRect();
    const task=first.querySelector('.source-sheet')||document.querySelector('.task');
    const taskFont=task?parseFloat(getComputedStyle(task).fontSize):0;
    return {
      bodyClass:document.body.classList.contains('mobile-reader'),
      visible:pages.length,
      pageRects:pages.map((p,i)=>{const r=p.getBoundingClientRect();return {i:i+1,left:r.left,right:r.right,width:r.width}}),
      viewport:innerWidth,
      firstTransform:getComputedStyle(first).transform,
      firstWidth:firstRect.width,
      taskFont,
      bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,
      toggleDisplay:getComputedStyle(document.querySelector('#view-toggle')).display
    };
  });
  if(!result.bodyClass)failures.push(`${width}x${height}: mobile-reader class missing`);
  if(result.visible<8)failures.push(`${width}x${height}: expected all workbook pages visible, got ${result.visible}`);
  if(result.bodyOverflow)failures.push(`${width}x${height}: horizontal document overflow`);
  if(result.firstTransform!=='none')failures.push(`${width}x${height}: mobile reader must not scale the page with transform (${result.firstTransform})`);
  if(result.firstWidth<width-30||result.firstWidth>width)failures.push(`${width}x${height}: first page width ${result.firstWidth.toFixed(1)} is not phone-width`);
  if(result.taskFont<14)failures.push(`${width}x${height}: readable text too small (${result.taskFont}px)`);
  if(result.toggleDisplay!=='none')failures.push(`${width}x${height}: A4 view toggle should be hidden in dedicated mobile reader`);
  for(const r of result.pageRects){
    if(r.left < -1 || r.right > result.viewport + 1){
      failures.push(`${width}x${height} page ${r.i}: clipped horizontally (left=${r.left.toFixed(1)}, right=${r.right.toFixed(1)}, viewport=${result.viewport})`);
    }
  }
  await page.close();
}

for(const [w,h] of [[360,800],[390,844],[412,915]])await check(w,h);

await browser.close();
await new Promise(resolve=>server.close(resolve));
if(failures.length){
  console.error('MOBILE VIEWPORT QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('MOBILE VIEWPORT QA PASS: phone-native reader is full-width, readable, unscaled, horizontally unclipped, and shows the complete workbook in continuous scroll.');
