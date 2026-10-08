import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const TRACKER='STUDENT_PROGRESS.json';
const p=JSON.parse(fs.readFileSync(new URL(`./${TRACKER}`,import.meta.url),'utf8'));
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const allowed=new Set(['done','partial','todo','blocked','failed']);

ok(p.scope==='student-pages-only','progress scope must remain student-pages-only');
ok(p.teacherPagesAllowed===false,'teacher pages must remain forbidden in progress tracker');
ok(p.authority==='SOURCE_OF_TRUTH.md','SOURCE_OF_TRUTH.md must remain the sole authority');
ok(Array.isArray(p.groups)&&p.groups.length>0,'progress groups missing');

const weightSum=p.groups.reduce((s,g)=>s+Number(g.weight||0),0);
ok(Math.abs(weightSum-100)<1e-9,`weights must sum to 100, got ${weightSum}`);
ok(Number(p.weightsSum)===100,'weightsSum field must be 100');

for(const g of p.groups){
  ok(typeof g.id==='string'&&g.id,`group without id: ${JSON.stringify(g)}`);
  ok(Number.isFinite(g.weight)&&g.weight>0,`${g.id}: invalid weight`);
  ok(Number.isFinite(g.completionPercent)&&g.completionPercent>=0&&g.completionPercent<=100,`${g.id}: completionPercent out of range`);
  ok(allowed.has(g.status),`${g.id}: invalid status ${g.status}`);
  if(g.status==='done')ok(g.completionPercent===100,`${g.id}: done requires completionPercent=100`);
  if(g.completionPercent===100)ok(g.status==='done',`${g.id}: completionPercent=100 requires status=done`);
  if(['partial','blocked','failed'].includes(g.status))ok(Array.isArray(g.remaining)&&g.remaining.length>0,`${g.id}: ${g.status} requires explicit remaining/blocker details`);
  ok(Array.isArray(g.evidence),`${g.id}: evidence must be an array`);
  ok(Array.isArray(g.testsPassed),`${g.id}: testsPassed must be an array`);
}

const computed=Number(p.groups.reduce((s,g)=>s+g.weight*g.completionPercent/100,0).toFixed(2));
ok(Math.abs(Number(p.overallPercent)-computed)<1e-9,`overallPercent ${p.overallPercent} does not match weighted calculation ${computed}`);

if(Number(p.overallPercent)===100){
  ok(p.groups.every(g=>g.status==='done'&&g.completionPercent===100),'overallPercent=100 is forbidden while any group is not fully done');
}

const meaningful=(file)=>[
  /^SOURCE_OF_TRUTH\.md$/,
  /^content\.js$/,
  /^app\.js$/,
  /^styles\.css$/,
  /^index\.html$/,
  /^math-qa\.mjs$/,
  /^coverage-qa\.mjs$/,
  /^qa\.mjs$/,
  /^browser-qa\.mjs$/,
  /^tests\//,
  /^assets\//
].some(rx=>rx.test(file));

function git(args){
  return execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024}).trim();
}
function changedFiles(base,head='HEAD'){
  if(base && !/^0+$/.test(base)){
    return git(['diff','--name-only',base,head]).split(/\r?\n/).filter(Boolean);
  }
  const changed=git(['diff','--name-only','HEAD']).split(/\r?\n/).filter(Boolean);
  const untracked=git(['ls-files','--others','--exclude-standard']).split(/\r?\n/).filter(Boolean);
  return [...new Set([...changed,...untracked])];
}

try{
  const [baseArg,headArg='HEAD']=process.argv.slice(2);
  const changed=changedFiles(baseArg,headArg);
  const projectChanged=changed.some(meaningful);
  const trackerChanged=changed.includes(TRACKER);
  if(projectChanged&&!trackerChanged){
    failures.push(`meaningful Harut change without ${TRACKER} in the same work cycle/change`);
  }
}catch(error){
  failures.push(`unable to verify progress coupling: ${error.message}`);
}

if(failures.length){
  console.error('PROGRESS QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`PROGRESS QA PASS: ${p.groups.length} groups, weights=100, weighted completion=${computed}%, tracker coupling enforced, teacher pages locked.`);
