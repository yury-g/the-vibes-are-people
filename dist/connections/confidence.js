export function confidenceMeter(record){
 const wrap=document.createElement('span');wrap.className='confidence';wrap.dataset.level=String(record.confidence);
 const label=({3:'Documented',2:'Inferred',1:'Tentative'})[record.confidence];
 const meter=document.createElement('meter');meter.min=0;meter.max=3;meter.value=record.confidence;meter.setAttribute('aria-label',`${label} confidence: ${record.confidence} of 3; editorial evidence scale, not a probability`);
 wrap.append(meter,document.createTextNode(`${label} · ${record.confidence}/3`));return wrap;
}
