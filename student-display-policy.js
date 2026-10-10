(()=>{
  'use strict';

  const book=document.querySelector('#book');
  if(!book||book.dataset.studentDisplayPolicy==='applied')return;

  // Keep the mathematical data model compact (r/d/h/V) while enforcing the
  // student-facing language/units policy in one presentation boundary.
  const data=window.CONE_DATA;
  const tableQuestion=data?.questions?.find(item=>item.id==='CONE-TAB-01');
  if(tableQuestion&&!tableQuestion.locked){
    tableQuestion.answer='שורה א: קוטר=6 ס״מ, נפח=24π סמ״ק; שורה ב: רדיוס=4 ס״מ, נפח=64π סמ״ק; שורה ג: קוטר=10 ס״מ, נפח=100π סמ״ק; שורה ד: קוטר=6 ס״מ, גובה=6 ס״מ; שורה ה: רדיוס=5 ס״מ, גובה=6 ס״מ.';
  }

  const addFormulaCompletion=(page,html)=>{
    if(!page||page.querySelector('.formula-completion'))return;
    const note=document.createElement('div');
    note.className='concept-note formula-completion';
    note.innerHTML=html;
    page.querySelector('.page-header')?.insertAdjacentElement('afterend',note);
  };

  for(const heading of book.querySelectorAll('.page-header h1')){
    const raw=heading.textContent||'';
    if(!raw.includes('נפח חרוט — השלימו:'))continue;
    const page=heading.closest('.page');
    if(raw.includes('V=')){
      heading.textContent='נפח חרוט';
      addFormulaCompletion(page,'השלימו את נוסחת הנפח: \\(V=\\underline{\\hspace{28mm}}\\)');
    }else if(raw.includes('pi')||raw.includes('π')||raw.includes('\\pi')){
      heading.textContent='נפח חרוט — קירוב מספרי';
      addFormulaCompletion(page,'השלימו את ערך הקירוב: \\(\\pi\\approx\\underline{\\hspace{14mm}}\\)');
    }
  }

  // The canonical table may keep d internally for deterministic mathematics,
  // but a student sees full Hebrew names and a unit context in every column.
  const volumeTable=[...book.querySelectorAll('table.practice-table')].find(table=>{
    const labels=[...table.querySelectorAll('thead th')].map(th=>(th.textContent||'').trim());
    return labels.length===4&&labels.some(label=>label.includes('\\(d\\)'))&&labels.some(label=>label.includes('\\(V\\)'));
  });

  if(volumeTable){
    const headers=[...volumeTable.querySelectorAll('thead th')];
    ['רדיוס (ס״מ)','קוטר (ס״מ)','גובה (ס״מ)','נפח מדויק (סמ״ק)'].forEach((label,index)=>{
      if(headers[index])headers[index].textContent=label;
    });
    for(const row of volumeTable.querySelectorAll('tbody tr')){
      [...row.cells].forEach((cell,index)=>{
        const value=(cell.textContent||'').trim();
        if(!value)return;
        const unit=index<3?'ס״מ':'סמ״ק';
        if(!value.includes(unit))cell.append(document.createTextNode(` ${unit}`));
        cell.dataset.unit=unit;
      });
    }
    volumeTable.dataset.studentUnits='explicit';
  }

  // Every numeric dimension in the to-scale comparison receives its own unit;
  // do not rely on one trailing unit to cover two different measurements.
  const captions=[...book.querySelectorAll('.dim-change-figure .dc-cell figcaption span')];
  const captionText=[
    'רדיוס = 3 ס״מ, גובה = 8 ס״מ',
    'רדיוס = 3 ס״מ, גובה = 16 ס״מ',
    'רדיוס = 6 ס״מ, גובה = 8 ס״מ'
  ];
  captions.forEach((caption,index)=>{if(captionText[index])caption.textContent=captionText[index];});

  // Remove the small rounding artefact in the radius-doubled base ellipse:
  // preserve the same shared scale, but keep the 0.30 ellipse ratio exact.
  for(const ellipse of book.querySelectorAll('.scale-cone-svg ellipse')){
    const rx=Number(ellipse.getAttribute('rx'));
    if(Number.isFinite(rx))ellipse.setAttribute('ry',String(Math.max(7,rx*0.3)));
  }

  book.dataset.studentDisplayPolicy='applied';
})();
