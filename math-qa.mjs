import fs from 'node:fs';
import vm from 'node:vm';

const content=fs.readFileSync(new URL('./content.js',import.meta.url),'utf8');
const sandbox={window:{}};
vm.runInNewContext(content,sandbox);
const questions=new Map(sandbox.window.CONE_DATA.questions.map(q=>[q.id,q]));
const failures=[];
const ok=(cond,msg)=>{if(!cond)failures.push(msg)};
const answer=(id)=>questions.get(id)?.answer||'';

const volumeCoeff=(r,h)=>r*r*h/3;
const coneVolumeApprox=(r,h,pi=3.14)=>volumeCoeff(r,h)*pi;
const rightLeg=(hyp,leg)=>Math.sqrt(hyp*hyp-leg*leg);
const axialArea=(r,h)=>(2*r*h)/2;

ok(volumeCoeff(3,8)===24,'CONE-VOL-01 coefficient must be 24π');
ok(answer('CONE-VOL-01').includes('24π'),'CONE-VOL-01 stored result drifted');

const table=[
  {r:3,d:6,h:8,v:volumeCoeff(3,8)},
  {r:4,d:8,h:12,v:volumeCoeff(4,12)},
  {r:5,d:10,h:12,v:volumeCoeff(5,12)}
];
ok(table[0].v===24&&table[1].v===64&&table[2].v===100,'completion-table cone volumes are wrong');
for(const row of table){
  ok(row.d===2*row.r,'radius/diameter relation failed');
  ok(answer('CONE-TAB-01').includes(`${row.v}π`),`table answer missing ${row.v}π`);
}

const h=rightLeg(10,6);
ok(h===8,'Pythagoras height must be 8');
ok(answer('CONE-PYT-01').includes('h=8'),'Pythagoras stored result drifted');
ok(axialArea(6,8)===48,'axial-section area must be 48');
ok(answer('CONE-AX-01').includes('48'),'axial-section stored result drifted');

const convertedRadiusCm=0.5*100;
const convertedVolume=coneVolumeApprox(convertedRadiusCm,120);
ok(convertedRadiusCm===50,'0.5 m must convert to 50 cm');
ok(convertedVolume===314000,'converted cone volume must be 314000 cm³');
ok(answer('CONE-CONV-01').includes('314000'),'conversion stored result drifted');

const reverseR=Math.sqrt((48*3)/9);
ok(reverseR===4,'reverse-volume radius must be 4');
ok(answer('CONE-REV-01').includes('r=4'),'reverse-volume stored result drifted');

ok(volumeCoeff(6,16)/volumeCoeff(6,8)===2,'doubling height must double cone volume');
ok(volumeCoeff(12,8)/volumeCoeff(6,8)===4,'doubling radius must quadruple cone volume');
ok(answer('CONE-CHANGE-01').includes('פי 2')&&answer('CONE-CHANGE-01').includes('פי 4'),'dimension-change stored result drifted');

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
console.log('MATH QA PASS: volume, radius/diameter, Pythagoras, axial section, conversions, reverse calculation and dimension-change results verified.');
