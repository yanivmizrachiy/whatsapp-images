(()=>{
  'use strict';
  const normalize=s=>String(s||'').replace(/\s+/g,' ').trim();
  const data=window.CONE_DATA||{};
  const questions=Array.isArray(data.questions)?data.questions:[];
  const canonicalTexts=new Set();
  for(const item of questions){
    const raw=String(item&&item.prompt||'').trim();
    if(!raw)continue;
    const split=raw.search(/\s[אבגדהוזחטיכלמנסעפצקרשת][.)]\s/);
    // Blanks (____) render as empty answer lines, so they are not part of the comparable text.
    canonicalTexts.add(normalize((split>0?raw.slice(0,split):raw).replace(/_{3,}/g,' ')));
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
    const match=node.nodeValue.match(/^(\s*\d+\s*(?:\.\s*|\s+(?=[אבגדהוזחטיכלמנסעפצקרשת][.)]\s*)))/);
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
  // Main questions also render as completion boxes (.obj-summary, .definition), side-by-side
  // columns (.obj-col) and, when the canonical text has no stem and starts at subpart א, as that
  // first subpart; they get a marker only when their text is a canonical question stem.
  document.querySelectorAll('.question-intro,.official-question,.obj-summary,.definition,.obj-col>.task,.subpart>.subpart-task').forEach(el=>{
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
    if(/^\d+(?:\.\s*\S|\s+[אבגדהוזחטיכלמנסעפצקרשת][.)]\s*\S)/.test(text)){
      hideLeadingQuestionNumber(el);
      addMarker(el);
    }
  });
})();
