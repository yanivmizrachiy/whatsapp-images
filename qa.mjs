import fs from 'node:fs';
import vm from 'node:vm';

const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const index=read('./index.html');
const app=read('./app.js');
const content=read('./content.js');
const css=read('./styles.css');
const ssot=read('./SOURCE_OF_TRUTH.md');
const page1Lock=read('./tests/page1-source-lock.txt');
const officialLock=read('./tests/official-cone-q6-lock.txt');

const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const normalize=(s)=>String(s).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();

const sandbox={window:{}};
vm.runInNewContext(content,sandbox);
const data=sandbox.window.CONE_DATA;
const officialQuestion=data.questions.find(q=>q.id==='CURR-CONE-06');
const orientationQuestion=data.questions.find(q=>q.id==='CONE-ORIENT-01');
const orientationDrawQuestion=data.questions.find(q=>q.id==='CONE-ORIENT-DRAW-01');
const axialSketchQuestion=data.questions.find(q=>q.id==='CONE-AX-SKETCH-01');
const conversionQuestion=data.questions.find(q=>q.id==='CONE-CONV-01');
const ids=data.questions.map(q=>q.id);

ok(ids.length>=13,'expected at least 13 canonical question IDs');
ok(new Set(ids).size===ids.length,'duplicate question IDs found');
ok(officialQuestion?.locked===true,'official curriculum question is not locked');
ok(Boolean(orientationQuestion),'varied-orientation identification task missing');
ok(orientationQuestion?.prompt.includes('מעטפת החרוט'),'varied-orientation task must include mantle identification');
ok(Boolean(orientationDrawQuestion),'orientation drawing task missing from canonical data');
ok(app.includes("prompt('CONE-ORIENT-DRAW-01')")&&app.includes('orientation-sketch'),'orientation drawing task is not rendered with its own workspace');
ok(Boolean(axialSketchQuestion),'axial-section sketch task missing from canonical data');
ok(app.includes("prompt('CONE-AX-SKETCH-01')")&&app.includes('sketch-box'),'axial-section sketch task is not rendered on the student page');
ok(Array.isArray(data.volumeTableRows)&&data.volumeTableRows.length===5,'canonical volume table must contain five rows');
ok(data.volumeTableRows.filter(r=>r.vPi!=null).length>=2,'canonical volume table must include reverse rows with V given');
ok(normalize(data.page1)===normalize(page1Lock),'locked page-1 source wording changed');
ok(officialQuestion&&normalize(officialQuestion.prompt)===normalize(officialLock),'locked official curriculum cone question changed');
ok(app.includes('שאלות מתוך תוכנית הלימודים'),'official curriculum heading missing');
ok(content.includes('96π')&&content.includes('384π')&&content.includes('h=8'),'official cone QA values missing');
ok(content.includes('מעטפת החרוט'),'mantle identification is missing from student content');
ok(app.includes('חתך צירי של חרוט הוא משולש שווה שוקיים'),'explicit axial-section definition is missing');
ok(content.includes('raw.githubusercontent.com/yanivmizrachiy/smartschool-hebrew-voice-notes/main/worksheets/assets/ayelet-original-cone.png'),'verified companion-sheet source asset reference is missing');
ok(app.includes('7121dfeaa9d8dc9f4101eea155c23a24374a0a2a/worksheets/assets/ayelet-original-cone.png'),'rendered companion-sheet artwork is not pinned to the verified immutable source commit');
ok(!content.includes('src="assets/ayelet-original-cone.png'),'broken local companion-sheet image path still present');

ok(!index.includes('פתרונות למורה'),'teacher UI must not exist during student phase');
ok(!app.includes('teacher-page')&&!app.includes('פתרונות למורה'),'teacher pages must not be rendered during student phase');
const teacherIronRule=
  ssot.includes('אין ליצור, להשלים, לעצב, לפרסם או לבצע QA סופי לעמודי מורה') &&
  ssot.includes('עד שיניב מודיע במפורש שסיים את כל דפי התלמיד');
ok(teacherIronRule,'teacher-page iron rule missing from SSOT');

const studentPageBuilders=(app.match(/addPage\(/g)||[]).length;
ok(studentPageBuilders>=8,'expected at least 8 student A4 pages');
ok(app.includes('volumeTableRows()'),'student volume table is not rendered from canonical data');
ok(app.includes('orientedConeSvg(90)')&&app.includes('orientedConeSvg(180)'),'varied cone orientations are not rendered');
ok(app.includes('בסיס, קודקוד, מעטפת וגובה'),'orientation page must visibly ask for base, vertex, mantle and height');
ok(app.includes('splitHebrewSubsections')&&app.includes('renderSubpart'),'multi-part questions must use the canonical subsection renderer');
ok(app.includes('data-subpart="${part.letter}"'),'subsection renderer must expose a stable per-part marker');
ok(app.includes('${grid(size)}${answerLine(unit)}'),'each subsection renderer must include its own work grid and answer line');
for(const letter of ['א','ב','ג'])ok(app.includes(`renderSubpart(findPart(conversionParts,'${letter}')`),`conversion subsection ${letter} is not independently rendered`);
for(const letter of ['א','ב','ג','ד'])ok(app.includes(`renderSubpart(findPart(changeParts,'${letter}')`),`dimension-change subsection ${letter} is not independently rendered`);
for(const name of ['officialA','officialB','officialC','officialD'])ok(app.includes(`renderSubpart(${name}`),`${name} is not independently rendered`);
ok(!app.includes('מרחב פתרון לסעיפים א׳–ב׳'),'official a-b must not share one combined workspace');
ok(!app.includes('מרחב חישוב והסבר'),'official c-d must not share one combined workspace');
ok(app.includes('const q=id=>D.questions.find'),'student renderer must resolve questions by stable ID');
ok(!app.includes('D.questions['),'student renderer must not depend on question array positions');

ok(Boolean(conversionQuestion),'conversion/estimate question missing');
ok(conversionQuestion?.prompt.includes('שערו')&&conversionQuestion?.prompt.includes('300,000')&&conversionQuestion?.prompt.includes('600,000'),'explicit π estimation practice missing');
ok(conversionQuestion?.answer.includes('314000')&&conversionQuestion?.answer.includes('300000'),'estimate answer/verification missing');

ok(css.includes('@page{size:A4;margin:0}'),'A4 print rule missing');
ok(css.includes('width:210mm')&&css.includes('height:297mm'),'canonical A4 geometry missing');
ok(css.includes('background-size:5mm 5mm'),'5x5 mm work grid missing');
ok(css.includes('--grid:#d7e0ef'),'approved grid color missing');
ok(css.includes('min-height:44px')&&css.includes('min-width:44px'),'touch target rule missing');
ok(css.includes('@media print'),'print CSS missing');
ok(css.includes('--page-scale'),'mobile A4 scaling missing');
ok(css.includes('.orientation-grid'),'orientation exercise layout missing');
ok(css.includes('.sketch-box{height:42mm'),'dedicated axial-section sketch workspace missing');
ok(css.includes('.sketch-box.orientation-sketch{height:105mm}'),'dedicated orientation drawing workspace missing');
ok(css.includes('.subpart{')&&css.includes('.subpart-task{'),'independent subsection visual structure missing');
ok(css.includes('.work-grid.subpart-small{height:20mm}')&&css.includes('.work-grid.subpart-medium{height:28mm}'),'subsection work-grid sizing missing');
ok(css.includes('.work-grid.official-part-a{height:27mm}')&&css.includes('.work-grid.official-part-d{height:29mm}'),'official subsection work-grid sizing missing');
ok(css.includes('#counter{min-width:56px;text-align:center;direction:ltr;unicode-bidi:isolate}'),'page counter must remain LTR inside RTL reader');
ok(css.includes('.page-header>b{font-weight:500}'),'student page number must stay within approved 400-500 range');
ok(css.includes('.page h1{font-size:24px;font-weight:500'),'student h1 weight must stay within approved 400-500 range');
ok(css.includes('.page h2{font-size:18px;font-weight:500'),'student h2 weight must stay within approved 400-500 range');
ok(!css.includes('.page h1{font-size:24px;font-weight:700'),'student h1 must not regress to heavy weight');
ok(index.includes('content.js')&&index.includes('app.js')&&index.includes('styles.css'),'canonical assets are not wired from index');

ok(app.includes('yanivmizrachiy/jerusalem/5dd97f6acfc3e3f95550ef1cb714d416261f174c/public/logo.png'),'verified immutable district logo source missing');
ok(css.includes('width:10mm')&&css.includes('height:10mm'),'district logo must render at 10mm square');
ok(css.includes('family=Rubik')&&css.includes('family=Heebo'),'canonical Google font import missing');
ok(css.includes('font-family:"Rubik","Heebo"'),'canonical typography stack missing');

ok(index.includes('mathjax@3.2.2/es5/tex-svg.js'),'pinned MathJax 3.2.2 TeX-SVG renderer missing');
ok(index.includes("inlineMath:[['\\\\(','\\\\)']]"),'MathJax inline TeX delimiters missing');
ok(app.includes("const tex=(s)=>`\\\\(${s}\\\\)`"),'shared TeX helper missing');
ok(app.includes('\\\\underline{\\\\hspace{28mm}}'),'volume formula active completion missing');
ok(app.includes('\\\\pi\\\\approx\\\\underline{\\\\hspace{14mm}}'),'volume approximation heading must contain a real student completion blank');
ok(app.includes("tex('r')")&&app.includes("tex('d')")&&app.includes("tex('h')")&&app.includes("tex('V')"),'math labels are not consistently rendered through TeX');

const forbiddenMath=/[×✕✖]/;
ok(!forbiddenMath.test(app),'forbidden multiplication glyph found in app.js');
ok(!app.includes('\\\\times'),'forbidden \\times found in app.js; use \\cdot');

if(failures.length){
  console.error('QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`QA PASS: ${ids.length} unique question IDs; ${data.volumeTableRows.length} canonical volume-table rows; ${studentPageBuilders} student A4 pages; locked sources intact; every multi-part task independently rendered; teacher phase locked.`);
