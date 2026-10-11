from pathlib import Path
import json

ssot_path=Path('SOURCE_OF_TRUTH.md')
ssot=ssot_path.read_text(encoding='utf-8')
anchor='17.6. אין placeholders, demo text, כפתורים מזויפים או כותרות מיותרות.'
addition='''\n\n17.7. **סימון שאלות ללא מספור גלוי — כלל מחייב (הוראת יניב, 2026-10-11).** בדפי התלמיד אין להציג מספרי שאלות רציפים כגון `1.`, `2.`, `3.` בתחילת שאלה. כל שאלה ראשית נפתחת **בסמן עגול כחול ברור** במקום מספר. בשאלה שמקורה רשמי/נעול 1:1, מספר השאלה המקורי נשמר בנתוני המקור וב־DOM לצורכי נאמנות, traceability ו־QA, אך מוסתר חזותית ומוחלף בעיגול; אסור לשנות בשל כך את נוסח המקור, הנתונים או סדר הסעיפים. סעיפי משנה א׳/ב׳/ג׳ אינם נספרים כשאלות חדשות ונשמרים לפי מבנה השאלה המאושר. QA חייב להיכשל אם הכלל נעלם מן ה־SSOT, אם מנגנון הסמנים אינו מחובר לקורא, או אם מספר שאלה רשמי חוזר להיות גלוי במקום הסמן.'''
if '17.7. **סימון שאלות ללא מספור גלוי' not in ssot:
    if anchor not in ssot:
        raise SystemExit('SSOT anchor not found; refusing broad rewrite')
    ssot=ssot.replace(anchor,anchor+addition,1)
    ssot_path.write_text(ssot,encoding='utf-8')

idx_path=Path('index.html')
idx=idx_path.read_text(encoding='utf-8')
if 'question-markers.css' not in idx:
    idx=idx.replace('  <link rel="stylesheet" href="styles.css">','  <link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="question-markers.css">',1)
if 'question-markers.js' not in idx:
    idx=idx.replace('  <script src="app.js"></script>','  <script src="app.js"></script>\n  <script src="question-markers.js"></script>',1)
idx_path.write_text(idx,encoding='utf-8')

Path('question-markers.css').write_text('''/* SSOT §17.7 — presentation-only question markers; source wording stays intact. */
.question-with-marker{position:relative;padding-inline-start:8.5mm}
.question-marker{position:absolute;inset-inline-start:0;top:.15em;width:6.6mm;height:6.6mm;border-radius:50%;background:#1d4ed8;display:grid;place-items:center;box-sizing:border-box}
.question-marker::after{content:"";width:2.1mm;height:2.1mm;border-radius:50%;background:#fff}
.source-question-number{font-size:0!important;line-height:0!important;display:inline-block!important;width:0!important;max-width:0!important;overflow:hidden!important;white-space:nowrap!important}
.source-number-only{display:none!important}
''',encoding='utf-8')

Path('question-markers.js').write_text(r'''(()=>{
  'use strict';
  const normalize=s=>String(s||'').replace(/\s+/g,' ').trim();
  const data=window.CONE_DATA||{};
  const questions=Array.isArray(data.questions)?data.questions:[];
  const canonicalTexts=new Set();
  for(const item of questions){
    const raw=String(item&&item.prompt||'').trim();
    if(!raw)continue;
    const split=raw.search(/\s[אבגדהוזחטיכלמנסעפצקרשת][.)]\s/);
    canonicalTexts.add(normalize(split>0?raw.slice(0,split):raw));
  }
  const addMarker=el=>{
    if(!el||el.classList.contains('question-with-marker'))return;
    const marker=document.createElement('span');
    marker.className='question-marker';
    marker.setAttribute('aria-hidden','true');
    el.classList.add('question-with-marker');
    el.prepend(marker);
  };
  const firstTextNode=el=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(node){
      if(!node.nodeValue||!node.nodeValue.trim())return NodeFilter.FILTER_SKIP;
      const parent=node.parentElement;
      if(parent&&(parent.classList.contains('question-marker')||parent.classList.contains('source-question-number')))return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }});
    return walker.nextNode();
  };
  const hideLeadingQuestionNumber=el=>{
    const node=firstTextNode(el);
    if(!node)return false;
    const match=node.nodeValue.match(/^(\s*\d+\s*\.\s*)/);
    if(!match)return false;
    const rest=node.nodeValue.slice(match[0].length);
    if(!rest.trim()){
      el.classList.add('source-number-only');
      return true;
    }
    const hidden=document.createElement('span');
    hidden.className='source-question-number';
    hidden.setAttribute('aria-hidden','true');
    hidden.textContent=match[0];
    node.nodeValue=rest;
    node.parentNode.insertBefore(hidden,node);
    return true;
  };
  document.querySelectorAll('.task:not(.subpart-task)').forEach(addMarker);
  document.querySelectorAll('.question-intro,.official-question').forEach(el=>{
    const text=normalize(el.textContent);
    const canonical=[...canonicalTexts].some(x=>x&&(text===x||text.startsWith(x)||x.startsWith(text)));
    if(canonical||el.classList.contains('official-question'))addMarker(el);
  });
  document.querySelectorAll('.official-question').forEach(hideLeadingQuestionNumber);
  const page1Selector='.source-sheet .ayelet-question-block p,.source-sheet .ayelet-middle-source p,.source-sheet .ayelet-math-source p,.source-sheet .ayelet-definition-source p';
  document.querySelectorAll(page1Selector).forEach(el=>{
    const text=normalize(el.textContent);
    if(/^\d+\.$/.test(text)){
      hideLeadingQuestionNumber(el);
      el.classList.add('source-number-only');
      return;
    }
    if(/^\d+\.\s*\S/.test(text)){
      hideLeadingQuestionNumber(el);
      addMarker(el);
    }
  });
})();
''',encoding='utf-8')

Path('question-marker-qa.mjs').write_text(r'''import fs from 'node:fs';
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
''',encoding='utf-8')

pkg_path=Path('package.json')
pkg=json.loads(pkg_path.read_text(encoding='utf-8'))
qa=pkg['scripts']['qa']
if 'question-marker-qa.mjs' not in qa:
    pkg['scripts']['qa']=qa.replace('node qa.mjs','node qa.mjs && node question-marker-qa.mjs',1)
    pkg_path.write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

tracker_path=Path('STUDENT_PROGRESS.json')
tracker=json.loads(tracker_path.read_text(encoding='utf-8'))
tracker['updatedAt']='2026-10-11T15:20:00+03:00'
for group in tracker.get('groups',[]):
    if group.get('id')=='G08':
        ev=group.setdefault('evidence',[])
        note='2026-10-11: restored and canonicalized Yaniv question-display rule: no visible numeric question numbering; every main question starts with a blue circle. Locked source numbers remain in source/DOM only. Added data-driven question-markers layer and dedicated regression QA.'
        if note not in ev: ev.append(note)
        tests=group.setdefault('testsPassed',[])
        if 'question-marker-qa.mjs' not in tests: tests.append('question-marker-qa.mjs')
tracker_path.write_text(json.dumps(tracker,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
