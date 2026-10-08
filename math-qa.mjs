import fs from 'node:fs';
import vm from 'node:vm';

const content=fs.readFileSync(new URL('./content.js',import.meta.url),'utf8');
const sandbox={window:{}};
vm.runInNewContext(content,sandbox);
const data=sandbox.window.CONE_DATA;
const questions=new Map(data.questions.map(q=>[q.id,q]));
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const answer=(id)=>questions.get(id)?.answer||'';
const prompt=(id)=>questions.get(id)?.prompt||'';

const volumeCoeff=(r,h)=>r*r*h/3;
const coneVolumeApprox=(r,h,pi=3.14)=>volumeCoeff(r,h)*pi;
const rightLeg=(hyp,leg)=>Math.sqrt(hyp*hyp-leg*leg);
const axialArea=(r,h)=>(2*r*h)/2;

// Approximation semantics gate for authored practice. Locked 1:1 source questions
// are excluded because their wording may not be silently edited.
const authoredMathText=data.questions
  .filter(q=>q.locked!==true)
  .map(q=>`${q.prompt||''}\n${q.answer||''}`)
  .join('\n');
ok(!/π\s*=\s*3(?:[.,]14)?/.test(authoredMathText),'authored practice must never present π=3.14 as an exact equality');
ok(prompt('CONE-CONV-01').includes('π ≈ 3.14'),'CONE-CONV-01 must explicitly use the approximation sign for π≈3.14');

ok(volumeCoeff(3,8)===24,'CONE-VOL-01 coefficient must be 24π');
ok(answer('CONE-VOL-01').includes('24π'),'CONE-VOL-01 stored result drifted');

function solveTableRow(row){
  let r=row.r ?? (row.d!=null ? row.d/2 : null);
  let d=row.d ?? (r!=null ? 2*r : null);
  let h=row.h;
  let vPi=row.vPi;
  if(vPi==null && r!=null && h!=null) vPi=volumeCoeff(r,h);
  if(h==null && vPi!=null && r!=null) h=(3*vPi)/(r*r);
  if(r==null && vPi!=null && h!=null){r=Math.sqrt((3*vPi)/h);d=2*r;}
  if(d==null && r!=null)d=2*r;
  return {id:row.id,r,d,h,vPi};
}

ok(Array.isArray(data.volumeTableRows)&&data.volumeTableRows.length===5,'volume table must have five canonical rows');
ok(data.volumeTableRows.filter(r=>r.vPi!=null).length>=2,'volume table must include reverse rows with V given');
const solvedRows=data.volumeTableRows.map(solveTableRow);
const expected={
  A:{r:3,d:6,h:8,vPi:24},
  B:{r:4,d:8,h:12,vPi:64},
  C:{r:5,d:10,h:12,vPi:100},
  D:{r:3,d:6,h:6,vPi:18},
  E:{r:5,d:10,h:6,vPi:50}
};
for(const row of solvedRows){
  const exp=expected[row.id];
  ok(Boolean(exp),`unexpected table row id ${row.id}`);
  if(!exp)continue;
  ok(row.r===exp.r&&row.d===exp.d&&row.h===exp.h&&row.vPi===exp.vPi,`table row ${row.id} solved incorrectly`);
  ok(row.d===2*row.r,`table row ${row.id}: radius/diameter relation failed`);
  ok(volumeCoeff(row.r,row.h)===row.vPi,`table row ${row.id}: cone volume relation failed`);
}
ok(answer('CONE-TAB-01').includes('שורה ד: d=6, h=6'),'table answer missing reverse row D');
ok(answer('CONE-TAB-01').includes('שורה ה: r=5, h=6'),'table answer missing reverse row E');

const h=rightLeg(10,6);
ok(h===8,'Pythagoras height must be 8');
ok(answer('CONE-PYT-01').includes('h=8'),'Pythagoras stored result drifted');
ok(axialArea(6,8)===48,'axial-section area must be 48');
ok(answer('CONE-AX-01').includes('48'),'axial-section stored result drifted');

const convertedRadiusCm=0.5*100;
const convertedCoeff=volumeCoeff(convertedRadiusCm,120);
const convertedVolume=coneVolumeApprox(convertedRadiusCm,120);
const roughVolume=convertedCoeff*3;
ok(convertedRadiusCm===50,'0.5 m must convert to 50 cm');
ok(convertedCoeff===100000,'converted cone π coefficient must be 100000');
ok(roughVolume===300000,'π≈3 estimate must be 300000 cm³');
ok(Math.abs(convertedVolume-300000)<Math.abs(convertedVolume-600000),'estimate must be closer to 300000 than 600000');
ok(convertedVolume===314000,'converted cone volume must be 314000 cm³');
ok(prompt('CONE-CONV-01').includes('300,000')&&prompt('CONE-CONV-01').includes('600,000'),'conversion prompt estimate options drifted');
ok(answer('CONE-CONV-01').includes('314000')&&answer('CONE-CONV-01').includes('300000'),'conversion estimate stored result drifted');

// Supplement table rows: unit conversion before exact volume, and an explicit
// kπ exact result -> numeric approximation bridge (SSOT §9/§11; execution P02/P03).
const convTable=questions.get('CONE-TAB-CONV-01')?.table||{};
ok(convTable.rCm===20,'conversion table row: converted radius must be 20 cm');
ok(convTable.rCm===Math.round(parseFloat(convTable.rGiven)*100),'conversion table row: 0.2 m must convert to 20 cm');
ok(volumeCoeff(convTable.rCm,convTable.h)===convTable.vPiCoeff,'conversion table row: exact π coefficient must match the converted dimensions');
ok(convTable.vPiCoeff===4000,'conversion table row exact coefficient must be 4000');
ok(answer('CONE-TAB-CONV-01').includes('20 ס״מ')&&answer('CONE-TAB-CONV-01').includes('4000π'),'conversion table row stored result drifted');

const approxTable=questions.get('CONE-TAB-APPROX-01')?.table||{};
ok(approxTable.piApprox===3.14,'approximation table row must use π≈3.14');
ok((approxTable.vPiCoeff*314)/100===approxTable.approx,'approximation table row: kπ coefficient · 3.14 must equal the numeric approximation');
ok(approxTable.vPiCoeff===50&&approxTable.approx===157,'approximation table row: 50π must approximate to 157');
ok(answer('CONE-TAB-APPROX-01').includes('50π')&&answer('CONE-TAB-APPROX-01').includes('157'),'approximation table row stored kπ→numeric bridge drifted');
ok(/≈/.test(answer('CONE-TAB-APPROX-01')),'approximation table row must use the ≈ sign for the numeric value');

const reverseR=Math.sqrt((48*3)/9);
ok(reverseR===4,'reverse-volume radius must be 4');
ok(answer('CONE-REV-01').includes('r=4'),'reverse-volume stored result drifted');

const changeBase=volumeCoeff(3,8);
const changeDoubleH=volumeCoeff(3,16);
const changeDoubleR=volumeCoeff(6,8);
ok(changeBase===24&&changeDoubleH===48&&changeDoubleR===96,'guided dimension-change π coefficients must be 24, 48 and 96');
ok(changeDoubleH/changeBase===2,'guided investigation: doubling height must double cone volume');
ok(changeDoubleR/changeBase===4,'guided investigation: doubling radius must quadruple cone volume');
ok(answer('CONE-CHANGE-01').includes('24π')&&answer('CONE-CHANGE-01').includes('48π')&&answer('CONE-CHANGE-01').includes('96π'),'guided dimension-change stored values drifted');

const officialBase=volumeCoeff(6,8);
const officialLarge=volumeCoeff(12,8);
ok(officialBase===96&&officialLarge===384,'official question exact π coefficients are wrong');
ok(coneVolumeApprox(6,8)===301.44,'official original approximate volume must be 301.44');
ok(coneVolumeApprox(12,8)===1205.76,'official enlarged approximate volume must be 1205.76');
ok(answer('CURR-CONE-06').includes('96π')&&answer('CURR-CONE-06').includes('384π'),'official stored exact results drifted');
ok(answer('CURR-CONE-06').includes('301.44')&&answer('CURR-CONE-06').includes('1205.76'),'official stored approximate results drifted');

if(failures.length){
  console.error('MATH QA FAIL');
  failures.forEach((f,i)=>console.error(`${i+1}. ${f}`));
  process.exit(1);
}
console.log('MATH QA PASS: table rows, volume, π approximation semantics, estimation, radius/diameter, Pythagoras, axial section, conversions, reverse calculation and guided dimension-change results verified.');
