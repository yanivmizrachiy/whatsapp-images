import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const content=read('./content.js');
const app=read('./app.js');
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};

const sandbox={window:{}};
vm.runInNewContext(content,sandbox);
const data=sandbox.window.CONE_DATA;
const byId=new Map(data.questions.map(q=>[q.id,q]));
const text=id=>`${byId.get(id)?.prompt||''} ${byId.get(id)?.answer||''}`;

const coverage=[
  ['definition', content.includes('חרוט הוא גוף') || app.includes('חרוט הוא גוף')],
  ['base/vertex/mantle/height identification', text('CONE-ID-01').includes('בסיס החרוט') && text('CONE-ID-01').includes('קודקוד החרוט') && text('CONE-ID-01').includes('מעטפת החרוט') && text('CONE-ID-01').includes('גובה החרוט')],
  ['axial-section definition', app.includes('חתך צירי של חרוט הוא משולש שווה שוקיים')],
  ['cone volume direct calculation', Boolean(byId.get('CONE-VOL-01'))],
  ['radius/diameter relationship', Array.isArray(data.volumeTableRows) && data.volumeTableRows.some(r=>r.r!=null&&r.d==null) && data.volumeTableRows.some(r=>r.d!=null&&r.r==null)],
  ['reverse calculation from volume', Boolean(byId.get('CONE-REV-01')) && data.volumeTableRows.some(r=>r.vPi!=null&&r.h==null)],
  ['unit conversion', text('CONE-CONV-01').includes('המירו')],
  ['explicit estimation / order of magnitude', text('CONE-CONV-01').includes('שערו') && text('CONE-CONV-01').includes('300,000') && text('CONE-CONV-01').includes('600,000')],
  ['exact pi', text('CONE-VOL-01').includes('π')],
  ['approximate pi', text('CONE-CONV-01').includes('π ≈ 3.14')],
  ['Pythagoras inside cone', Boolean(byId.get('CONE-PYT-01')) && text('CONE-PYT-01').includes('h²+6²=10²') && app.includes('חתך צירי ומשפט פיתגורס')],
  ['axial-section area', Boolean(byId.get('CONE-AX-01'))],
  ['dimension changes', Boolean(byId.get('CONE-CHANGE-01')) && text('CONE-CHANGE-01').includes('פי 2')],
  ['varied cone orientations', Boolean(byId.get('CONE-ORIENT-01')) && app.includes('orientedConeSvg(90)') && app.includes('orientedConeSvg(180)')],
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
console.log(`COVERAGE QA PASS: ${coverage.length} mandatory student coverage checks satisfied.`);
