import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT=8093;
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(PORT),HOST:'127.0.0.1'},stdio:['ignore','pipe','pipe']});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const failures=[];
const ok=(c,m)=>{if(!c)failures.push(m)};
try{
  for(let i=0;i<50;i++){
    try{const r=await fetch(`http://127.0.0.1:${PORT}/`);if(r.ok)break}catch{}
    await wait(100);
  }
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(`http://127.0.0.1:${PORT}/?view=scroll`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('.page').length===43);
  const audit=await page.evaluate(()=>{
    const visiblePrefix=el=>{
      const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      while(w.nextNode()){
        const n=w.currentNode;
        if(!n.nodeValue?.trim())continue;
        const p=n.parentElement;
        if(p?.closest('.question-marker,.source-question-number,.source-number-only'))continue;
        const cs=p?getComputedStyle(p):null;
        if(cs&&(cs.display==='none'||cs.visibility==='hidden'||Number.parseFloat(cs.fontSize)===0))continue;
        return n.nodeValue.trimStart();
      }
      return '';
    };
    const markers=[...document.querySelectorAll('.question-with-marker')].map(el=>{
      const m=el.querySelector(':scope > .question-marker');
      const cs=m?getComputedStyle(m):null;
      const r=m?.getBoundingClientRect();
      return {prefix:visiblePrefix(el),has:!!m,display:cs?.display,bg:cs?.backgroundColor,w:r?.width||0,h:r?.height||0};
    });
    const sourceNumbers=[...document.querySelectorAll('.source-question-number')].map(el=>({text:el.textContent,fs:getComputedStyle(el).fontSize,w:el.getBoundingClientRect().width}));
    const page1=[...document.querySelectorAll('.source-sheet .ayelet-question-block p,.source-sheet .ayelet-middle-source p,.source-sheet .ayelet-math-source p,.source-sheet .ayelet-definition-source p')].map(el=>({text:el.textContent.trim(),prefix:visiblePrefix(el),hidden:el.classList.contains('source-number-only'),marker:!!el.querySelector(':scope > .question-marker')}));
    return {markers,sourceNumbers,page1,official:[...document.querySelectorAll('.official-question')].map(el=>({marker:el.classList.contains('question-with-marker'),prefix:visiblePrefix(el)}))};
  });
  ok(audit.markers.length>0,'no rendered question markers found');
  for(const [i,m] of audit.markers.entries()){
    ok(m.has&&m.display!=='none'&&m.w>=20&&m.h>=20,`marker ${i+1} is missing or too small`);
    ok(m.bg==='rgb(29, 78, 216)',`marker ${i+1} is not canonical blue: ${m.bg}`);
    ok(!/^\d+\s*\.\s+/.test(m.prefix)&&!/^\d+\s+[אבגדהוזחטיכלמנסעפצקרשת][.)]\s*/.test(m.prefix),`marker ${i+1} still exposes a numeric question prefix: ${m.prefix}`);
  }
  for(const n of audit.sourceNumbers)ok(n.fs==='0px'&&n.w===0,`locked source number is visible: ${n.text}`);
  for(const item of audit.page1){
    ok(!/^\d+\s*\.\s+/.test(item.prefix)&&!/^\d+\s+[אבגדהוזחטיכלמנסעפצקרשת][.)]\s*/.test(item.prefix),`page 1 still exposes question number: ${item.prefix}`);
  }
  const page1PartA=audit.page1.find(x=>/2\s*א\./.test(x.text));
  ok(Boolean(page1PartA),'page 1 source question 2א not found');
  if(page1PartA){ok(page1PartA.marker,'page 1 question 2א must carry a blue question marker');ok(/^א\./.test(page1PartA.prefix),'page 1 question 2א must visibly start with א. after hiding source question number');}
  for(const [i,o] of audit.official.entries()){ok(o.marker,`official question ${i+1} lacks marker`);ok(!/^\d+\s*\.\s+/.test(o.prefix),`official question ${i+1} exposes numeric prefix: ${o.prefix}`);}
  await browser.close();
} finally {
  server.kill('SIGTERM');
}
if(failures.length){console.error('QUESTION MARKER BROWSER QA FAIL');failures.forEach((x,i)=>console.error(`${i+1}. ${x}`));process.exit(1)}
console.log('QUESTION MARKER BROWSER QA PASS: blue circles rendered; numeric question prefixes hidden; locked source preserved.');
