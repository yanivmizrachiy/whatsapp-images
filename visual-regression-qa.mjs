import fs from 'node:fs';
import crypto from 'node:crypto';

const manifest=JSON.parse(fs.readFileSync(new URL('./visual-baseline.json',import.meta.url),'utf8'));
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

ok(manifest.project==='חרוט חדש','visual baseline project mismatch');
ok(Number.isInteger(manifest.pageCount)&&manifest.pageCount>0,'invalid visual baseline pageCount');

const expected=Object.entries(manifest.pages||{});
ok(expected.length===manifest.pageCount,`baseline page count mismatch: manifest=${manifest.pageCount}, entries=${expected.length}`);

for(const [name,meta] of expected){
  const file=`qa-artifacts/${name}`;
  ok(fs.existsSync(file),`missing current screenshot ${file}`);
  if(!fs.existsSync(file))continue;
  const bytes=fs.statSync(file).size;
  const sha=digest(file);
  ok(bytes===meta.bytes,`${name}: byte-size visual drift; expected ${meta.bytes}, got ${bytes}`);
  ok(sha===meta.sha256,`${name}: pixel screenshot regression; expected ${meta.sha256}, got ${sha}`);
}

const current=fs.existsSync('qa-artifacts')
  ? fs.readdirSync('qa-artifacts').filter(n=>/^page-\d{2}\.png$/.test(n)).sort()
  : [];
ok(current.length===manifest.pageCount,`current screenshot count mismatch: expected ${manifest.pageCount}, got ${current.length}`);

if(failures.length){
  console.error('VISUAL REGRESSION QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log(`VISUAL REGRESSION QA PASS: ${manifest.pageCount} pages match reviewed baseline from workflow ${manifest.sourceWorkflowRun}.`);
