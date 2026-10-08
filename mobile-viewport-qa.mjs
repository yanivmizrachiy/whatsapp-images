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

async function check(width,height,view){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(`${base}?view=${view}`,{waitUntil:'load'});
  await page.waitForTimeout(250);
  const result=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.page')].filter(p=>getComputedStyle(p).display!=='none');
    return pages.map((p,i)=>{
      const r=p.getBoundingClientRect();
      return {i:i+1,left:r.left,right:r.right,width:r.width,viewport:innerWidth};
    });
  });
  for(const r of result){
    if(r.left < -1 || r.right > r.viewport + 1){
      failures.push(`${width}x${height} ${view} page ${r.i}: clipped horizontally (left=${r.left.toFixed(1)}, right=${r.right.toFixed(1)}, viewport=${r.viewport})`);
    }
  }
  await page.close();
}

for(const [w,h] of [[360,800],[390,844]]){
  await check(w,h,'paged');
  await check(w,h,'scroll');
}

await browser.close();
await new Promise(resolve=>server.close(resolve));
if(failures.length){
  console.error('MOBILE VIEWPORT QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('MOBILE VIEWPORT QA PASS: every visible A4 page stays fully inside Android/iPhone portrait viewport in paged and scroll modes.');
