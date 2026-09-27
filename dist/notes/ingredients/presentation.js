// B is a presentation adapter over the original controllers, records and loops.
// The original A documents, scripts, data and assets remain untouched.
const techniques = document.body.dataset.page === 'techniques';
await import(techniques ? '../techniques/techniques.js' : '../living/app.js');

if (techniques) {
  import('./technique-labels.js').catch(() => {
    document.querySelector('#provenance-status').textContent='People and sources could not load. Reload this page to try again.';
  });
}

if (!techniques) {
  const { people } = await import('../living/data.js');
  const { portrait } = await import('../living/portraits.js');
  const $ = selector => document.querySelector(selector);
  const text = (selector, value) => {
    const el = $(selector);
    if (el && el.textContent !== value) el.textContent = value;
  };
  const dialog = $('#detail');
  function addTrailPortraits() {
    document.querySelectorAll('.trail-link:not(.with-face)').forEach(link => {
      const person=people.find(p=>link.textContent.startsWith(p.name));
      if(!person)return;
      const photo=portrait(person);
      if(photo){link.prepend(photo);link.classList.add('with-face')}
    });
  }
  function presentDetail() {
    addTrailPortraits();
    const step = Number($('.unmix-steps [aria-pressed="true"]')?.dataset.step || 0);
    const person = people.find(p => p.name === $('#detail-name').textContent);
    text('#unmix-title', step === 2 ? person?.name || 'People' : step === 1 ? 'THE RECIPE' : 'LOOK CLOSELY.');
    text('#unmix-next', ['Next: technique →','Next: human ingredients →','Start again ↺'][step]);
    if (step === 1 && person) {
      // Use the existing documented technique, not a newly inferred attribution.
      text('#unmix-kicker', person.tag);
      text('#unmix-content > p:first-child', person.technique);
      text('#unmix-content .unmix-hint', 'Technique context from this person’s existing record. The moving image is an illustrative study; its appearance alone does not establish authorship.');
    }
  }
  const detailObserver = new MutationObserver(presentDetail);
  detailObserver.observe(dialog, {subtree:true,childList:true,attributes:true,attributeFilter:['open','aria-pressed']});
  // Existing click handlers select the record and open the dialog first.
  // B starts its inspection at the vibe, with the full person card still available.
  document.addEventListener('click', event => {
    if (event.target.closest('#sheet .card, #nodes .node, #prev, #next') && dialog.open) $('#unmix-open').click();
  });
  function addConnectionPortraits() {
    document.querySelectorAll('#evidence h3:not(.with-faces)').forEach(heading=>{
      const participants=people.filter(person=>heading.textContent.includes(person.name));
      if(!participants.length)return;
      heading.replaceChildren();heading.classList.add('with-faces');
      participants.forEach((person,index)=>{
        if(index)heading.append(document.createTextNode(' ↔ '));
        const label=document.createElement('span');label.className='connection-person';
        const photo=portrait(person);if(photo)label.append(photo);
        label.append(document.createTextNode(person.name));heading.append(label);
      });
    });
  }
  new MutationObserver(addConnectionPortraits).observe($('#evidence'),{childList:true,subtree:true});
  addConnectionPortraits();
  const title = $('#surface-title');
  new MutationObserver(() => {
    text('#surface-title', $('#network').hidden ? '01 — SELECT A MOVING STUDY' : '03 — DOCUMENTED HUMAN CONNECTIONS');
  }).observe(title,{childList:true});
  text('#surface-title','01 — SELECT A MOVING STUDY');
  text('#surface-hint','OPEN A STUDY · READ ITS LABEL');
  const requested=new URL(location.href).searchParams.get('person');
  const requestedIndex=people.findIndex(person=>person.id===requested);
  if(requestedIndex>=0) { document.querySelectorAll('#sheet .card')[requestedIndex].click(); document.querySelector('[data-step="2"]').click(); }

}
