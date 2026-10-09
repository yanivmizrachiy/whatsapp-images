import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const content=read('./content.js');
const app=read('./app.js');
const inventory=JSON.parse(read('./curriculum-cone-inventory.json'));
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};

const sandbox={window:{}};
vm.runInNewContext(content,sandbox);
const data=sandbox.window.CONE_DATA;
const byId=new Map(data.questions.map(q=>[q.id,q]));
const text=id=>`${byId.get(id)?.prompt||''} ${byId.get(id)?.answer||''}`;

// Canonical curriculum inventory gate: prove that the cone workbook contains
// every official cone question in the audited cylinder/cone curriculum range,
// and no untracked CURR-CONE question can silently appear or disappear.
const expectedPages=[14,15,16,17,18,19];
ok(inventory?.authority==='SOURCE_OF_TRUTH.md','curriculum inventory must remain derived from SOURCE_OF_TRUTH.md');
ok(inventory?.curriculumSource?.repository==='yanivmizrachiy/jerusalem2','curriculum inventory repository drifted');
ok(inventory?.curriculumSource?.path==='src/content/curriculum-fragments/idkun-geometri-8/idkun-geometri-8-p001-025.json','curriculum inventory source path drifted');
ok(JSON.stringify(inventory?.curriculumSource?.auditedSourcePages)===JSON.stringify(expectedPages),'curriculum inventory must prove pages 14–19 were audited');
const includedNumbers=(inventory.classification||[]).filter(row=>row.includedInConeWorkbook===true).map(row=>row.questionNumber).sort((a,b)=>a-b);
ok(JSON.stringify(includedNumbers)===JSON.stringify([6]),'official cone question-number inventory must contain exactly question 6');
const excludedCylinderNumbers=(inventory.classification||[]).filter(row=>row.body==='cylinder'&&row.includedInConeWorkbook===false).map(row=>row.questionNumber).sort((a,b)=>a-b);
ok(JSON.stringify(excludedCylinderNumbers)===JSON.stringify([1,2,3,4,5,7]),'questions 1–5 and 7 must remain classified as cylinder, not cone');
const inventoryIds=[...(inventory.officialConeQuestionIds||[])].sort();
ok(JSON.stringify(inventoryIds)===JSON.stringify(['CURR-CONE-06']),'official cone ID inventory drifted');
for(const id of inventoryIds){
  ok(Boolean(byId.get(id)),`official inventory question missing from canonical content: ${id}`);
  ok(byId.get(id)?.locked===true,`official inventory question must remain locked=true: ${id}`);
}
const contentOfficialIds=[...byId.keys()].filter(id=>id.startsWith('CURR-CONE-')).sort();
ok(JSON.stringify(contentOfficialIds)===JSON.stringify(inventoryIds),'CURR-CONE content IDs and curriculum inventory are out of sync');

const coverage=[
  ['definition', content.includes('חרוט הוא גוף') || app.includes('חרוט הוא גוף')],
  ['active-completion cone definition (SSOT §10.4)', app.includes('השלימו את שמות חלקי החרוט') && !app.includes('נקראת קודקוד החרוט') && !app.includes('נקרא בסיס החרוט')],
  ['cone-parts identification page (SSOT §26)', Boolean(byId.get('CONE-PARTS-01')) && app.includes('מסמנים את חלקי החרוט')],
  ['base/vertex/mantle/height identification', text('CONE-ID-01').includes('בסיס החרוט') && text('CONE-ID-01').includes('קודקוד החרוט') && text('CONE-ID-01').includes('מעטפת החרוט') && text('CONE-ID-01').includes('גובה החרוט')],
  ['axial-section definition', app.includes('חתך צירי של חרוט הוא משולש שווה שוקיים')],
  ['axial-section student sketch', Boolean(byId.get('CONE-AX-SKETCH-01')) && app.includes("prompt('CONE-AX-SKETCH-01')") && app.includes('sketch-box')],
  ['cone volume direct calculation', Boolean(byId.get('CONE-VOL-01'))],
  ['radius/diameter relationship', Array.isArray(data.volumeTableRows) && data.volumeTableRows.some(r=>r.r!=null&&r.d==null) && data.volumeTableRows.some(r=>r.d!=null&&r.r==null)],
  ['reverse calculation from volume', Boolean(byId.get('CONE-REV-01')) && data.volumeTableRows.some(r=>r.vPi!=null&&r.h==null)],
  ['unit conversion', text('CONE-CONV-01').includes('המירו')],
  ['explicit estimation / order of magnitude', text('CONE-CONV-01').includes('שערו') && text('CONE-CONV-01').includes('300,000') && text('CONE-CONV-01').includes('600,000')],
  ['exact pi', text('CONE-VOL-01').includes('π')],
  ['approximate pi', text('CONE-CONV-01').includes('π ≈ 3.14')],
  ['Pythagoras inside cone', Boolean(byId.get('CONE-PYT-01')) && text('CONE-PYT-01').includes('h²+6²=10²') && app.includes('חתך צירי ומשפט פיתגורס')],
  ['axial-section area', Boolean(byId.get('CONE-AX-01'))],
  ['guided numeric dimension changes', Boolean(byId.get('CONE-CHANGE-01')) && text('CONE-CHANGE-01').includes('רדיוס הבסיס 3') && text('CONE-CHANGE-01').includes('גובהו 8') && text('CONE-CHANGE-01').includes('16 ס״מ') && text('CONE-CHANGE-01').includes('6 ס״מ') && text('CONE-CHANGE-01').includes('24π') && text('CONE-CHANGE-01').includes('48π') && text('CONE-CHANGE-01').includes('96π')],
  ['varied cone orientations', Boolean(byId.get('CONE-ORIENT-01')) && text('CONE-ORIENT-01').includes('מעטפת החרוט') && app.includes('orientedConeSvg(90)') && app.includes('orientedConeSvg(180)')],
  ['orientation drawing practice', Boolean(byId.get('CONE-ORIENT-DRAW-01')) && app.includes("prompt('CONE-ORIENT-DRAW-01')") && app.includes('orientation-sketch')],
  ['realistic context', Boolean(byId.get('CURR-CONE-06')) && text('CURR-CONE-06').includes('גלידרייה')],
  ['official curriculum question locked', byId.get('CURR-CONE-06')?.locked===true],
  ['official question includes Pythagoras + volume + dimension comparison', text('CURR-CONE-06').includes('פיתגורס') && text('CURR-CONE-06').includes('נפח') && text('CURR-CONE-06').includes('להגדיל את רדיוס הגביע פי 2')],
  ['student-only phase', !app.includes('teacher-page') && !app.includes('פתרונות למורה')]
];

for(const [name,covered] of coverage)ok(covered,`coverage missing: ${name}`);

if(failures.length){
  console.error('COVERAGE QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`COVERAGE QA PASS: ${coverage.length} mandatory student coverage checks + canonical curriculum inventory gate satisfied.`);
