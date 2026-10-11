import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const ssot=read('./SOURCE_OF_TRUTH.md');
const index=read('./index.html');
const css=read('./question-markers.css');
const js=read('./question-markers.js');
const failures=[];
const ok=(c,m)=>{if(!c)failures.push(m)};
ok(ssot.includes('סימון שאלות ללא מספור גלוי')&&ssot.includes('סמן עגול כחול'),'SSOT §17.7 question-marker contract missing');
ok(ssot.includes('מספר השאלה המקורי נשמר בנתוני המקור וב־DOM'),'locked-source preservation rule missing');
ok(index.includes('question-markers.css')&&index.includes('question-markers.js'),'question-marker assets not wired into reader');
ok(css.includes('.question-marker')&&css.includes('border-radius:50%')&&css.includes('#1d4ed8'),'blue circular marker CSS missing');
ok(css.includes('.source-question-number')&&css.includes('font-size:0!important'),'visible source-number suppression missing');
ok(js.includes(".task:not(.subpart-task)")&&js.includes('.official-question'),'top-level and official question marker coverage missing');
ok(js.includes('window.CONE_DATA')&&js.includes('canonicalTexts'),'data-driven multi-part question coverage missing');
ok(js.includes('source-sheet .ayelet-question-block'),'locked page-1 display adaptation missing');
ok(!js.includes('window.CONE_DATA='),'marker layer must never rewrite canonical question data');
if(failures.length){console.error('QUESTION MARKER QA FAIL');failures.forEach((x,i)=>console.error(`${i+1}. ${x}`));process.exit(1)}
console.log('QUESTION MARKER QA PASS: no visible question numbering; blue markers wired; locked source preserved.');
