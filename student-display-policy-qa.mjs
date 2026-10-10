import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const index=read('./index.html');
const policy=read('./student-display-policy.js');
const css=read('./styles.css');
const failures=[];
const ok=(condition,message)=>{if(!condition)failures.push(message)};

const appPos=index.indexOf('src="app.js"');
const policyPos=index.indexOf('src="student-display-policy.js"');
ok(appPos>=0&&policyPos>appPos,'student display policy must load after the canonical renderer');
ok(policy.includes('קוטר (ס״מ)'),'diameter must be student-facing Hebrew with an explicit length unit');
ok(policy.includes('נפח מדויק (סמ״ק)'),'volume table must expose the volume unit in its student-facing header');
ok(policy.includes("heading.textContent='נפח חרוט'"),'formula prompt must not remain embedded in the volume-page title');
ok(policy.includes("heading.textContent='נפח חרוט — קירוב מספרי'"),'approximation page must use a topic title rather than a demo/prompt title');
ok(policy.includes('formula-completion'),'active formula completion must be preserved outside the title');
ok(policy.includes('השלימו את נוסחת הנפח')&&policy.includes('V=\\\\underline'),'volume formula completion must remain an active student task');
ok(policy.includes('השלימו את ערך הקירוב')&&policy.includes('\\\\pi\\\\approx'),'π approximation completion must remain an active student task');
ok(policy.includes('רדיוס = 3 ס״מ, גובה = 8 ס״מ'),'each numeric dimension in the comparison caption must carry its own unit');
ok(policy.includes("tableQuestion.answer='שורה א: קוטר=6 ס״מ"),'canonical table answer metadata must use student-facing diameter terminology and units');
ok(policy.includes("book.dataset.studentDisplayPolicy='applied'"),'policy must expose a deterministic applied marker for browser QA');

// SSOT §16 remains the actual work-area rule: calculations use the existing
// 5×5 mm grid system. The display policy must not replace it with text lines.
ok(css.includes('background-size:5mm 5mm'),'canonical 5x5 mm student work grid missing');
ok(css.includes('.work-grid'),'student work-grid component missing');
ok(!policy.includes('work-grid')&&!policy.includes('final-answer'),'display policy must not rewrite or weaken computational workspaces');

if(failures.length){
  console.error('STUDENT DISPLAY POLICY QA FAIL');
  failures.forEach((failure,index)=>console.error(`${index+1}. ${failure}`));
  process.exit(1);
}
console.log('STUDENT DISPLAY POLICY QA PASS: Hebrew diameter, explicit units, topic-only titles, active completions and canonical 5x5 mm work grids are protected.');
