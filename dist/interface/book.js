const book=document.querySelector('.book');
const leaves=[...book.querySelectorAll('.leaf')];
const controls=[...document.querySelectorAll('.view-controls button')];
const status=document.querySelector('#view-status');
function setView(view){
 if(!['people','ingredients','together'].includes(view))return;
 for(const leaf of leaves){
  const folded=view!=='together'&&view!==leaf.id;
  const content=leaf.querySelector('.page-content');
  if(folded&&!leaf.classList.contains('is-folded')){
   const rect=content.getBoundingClientRect();
   leaf.style.setProperty('--resting-width',rect.width+'px');
   leaf.style.setProperty('--resting-height',rect.height+'px');
  }
  // Retain the browsing contexts: never remove, hide with display:none, or reload an iframe.
  content.inert=folded;content.setAttribute('aria-hidden',String(folded));
  leaf.querySelector('iframe').tabIndex=folded?-1:0;
  leaf.classList.toggle('is-folded',folded);
  const expand=leaf.querySelector('[data-expand]');
  expand.textContent=view===leaf.id?'Show both ↔':'Expand ↗';
  expand.setAttribute('aria-label',view===leaf.id?'Show both views':`Expand ${leaf.dataset.label}`);
 }
 book.dataset.view=view;
 controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
 status.textContent=view==='together'?'People and Ingredients open':`${view==='people'?'People':'Ingredients'} expanded`;
}
controls.forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
leaves.forEach(leaf=>{
 leaf.querySelector('[data-expand]').addEventListener('click',()=>setView(book.dataset.view===leaf.id?'together':leaf.id));
 leaf.querySelector('.fold-tab').addEventListener('click',()=>{
  setView('together');
  // The unfolding rail disappears; place keyboard focus on the view it opened.
  leaf.querySelector('[data-expand]').focus({preventScroll:true});
 });
});
new ResizeObserver(([entry])=>document.body.style.setProperty('--masthead-height',entry.target.getBoundingClientRect().height+'px')).observe(document.querySelector('.masthead'));
