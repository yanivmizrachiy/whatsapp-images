import fs from 'node:fs';

const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const index=read('./index.html');
const app=read('./app.js');
const content=read('./content.js');
const css=read('./styles.css');
const ssot=read('./SOURCE_OF_TRUTH.md');

const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};

const ids=[...content.matchAll(/id:'([^']+)'/g)].map(m=>m[1]);
ok(ids.length>=10,'expected at least 10 canonical question IDs');
ok(new Set(ids).size===ids.length,'duplicate question IDs found');
ok(content.includes("id:'CURR-CONE-06'")&&content.includes('locked:true'),'official curriculum question is not locked');
ok(content.includes('שאלות מתוך תוכנית הלימודים')||app.includes('שאלות מתוך תוכנית הלימודים'),'official curriculum heading missing');
ok(content.includes('96π')&&content.includes('384π')&&content.includes('h=8'),'official cone QA values missing');
ok(content.includes('מעטפת החרוט'),'mantle identification is missing from student content');
ok(app.includes('חתך צירי של חרוט הוא משולש שווה שוקיים'),'explicit axial-section definition is missing');
ok(content.includes('raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/main/worksheets/assets/ayelet-original-cone.png'),'verified companion-sheet image asset is not wired');
ok(!content.includes('src=\\"assets/ayelet-original-cone.png'),'broken local companion-sheet image path still present');

ok(!index.includes('פתרונות למורה'),'teacher UI must not exist during student phase');
ok(!app.includes('teacher-page')&&!app.includes('פתרונות למורה'),'teacher pages must not be rendered during student phase');
ok(ssot.includes('כלל ברזל — עמודי מורה רק לאחר השלמת כל עמודי התלמיד'),'teacher-page iron rule missing from SSOT');

const studentPageBuilders=(app.match(/addPage\(/g)||[]).length;
ok(studentPageBuilders>=7,'expected at least 7 student A4 pages');
ok(app.includes("splitMarker=' ג. בעל הגלידרייה'"),'official curriculum task is not split safely across A4 pages');

ok(css.includes('@page{size:A4;margin:0}'),'A4 print rule missing');
ok(css.includes('width:210mm')&&css.includes('height:297mm'),'canonical A4 geometry missing');
ok(css.includes('background-size:5mm 5mm'),'5x5 mm work grid missing');
ok(css.includes('--grid:#d7e0ef'),'approved grid color missing');
ok(css.includes('min-height:44px')&&css.includes('min-width:44px'),'touch target rule missing');
ok(css.includes('@media print'),'print CSS missing');
ok(css.includes('--page-scale'),'mobile A4 scaling missing');
ok(index.includes('content.js')&&index.includes('app.js')&&index.includes('styles.css'),'canonical assets are not wired from index');

ok(app.includes('yanivmizrachiy/jerusalem/5dd97f6acfc3e3f95550ef1cb714d416261f174c/public/logo.png'),'verified immutable district logo source missing');
ok(css.includes('width:10mm')&&css.includes('height:10mm'),'district logo must render at 10mm square');
ok(css.includes('family=Rubik')&&css.includes('family=Heebo'),'canonical Google font import missing');
ok(css.includes('font-family:"Rubik","Heebo"'),'canonical typography stack missing');

const forbiddenMath=/[×✕✖]/;
ok(!forbiddenMath.test(app),'forbidden multiplication glyph found in app.js');

if(failures.length){
  console.error('QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`QA PASS: ${ids.length} unique question IDs; ${studentPageBuilders} student page builders; teacher phase locked; cone-concepts/A4/mobile/print/logo/typography contracts present.`);
