const book=document.querySelector('.book');
const leaves=[...book.querySelectorAll('.leaf')];
const controls=[...document.querySelectorAll('.view-controls button')];
const status=document.querySelector('#view-status');
const phone=matchMedia('(max-width:700px), (pointer:coarse) and (max-width:1000px) and (max-height:500px)');
let lastSingleView='people';
function setView(view,scroll=true){
 if(!['people','ingredients','together'].includes(view))return;
 if(phone.matches && view==='together')view=lastSingleView;
 if(view!=='together')lastSingleView=view;
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

 }
 book.dataset.view=view;
 if(phone.matches && scroll)book.scrollTo({left:view==='ingredients'?book.clientWidth:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
 status.textContent=view==='together'?'People and Ingredients open':`${view==='people'?'People':'Ingredients'} expanded`;
}
controls.forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
leaves.forEach(leaf=>{
 leaf.querySelector('.fold-tab').addEventListener('click',()=>{
  setView('together');
  // The unfolding rail disappears; place keyboard focus on the view it opened.
  controls.find(button=>button.dataset.view===book.dataset.view).focus({preventScroll:true});
 });
});
new ResizeObserver(([entry])=>document.body.style.setProperty('--masthead-height',entry.target.getBoundingClientRect().height+'px')).observe(document.querySelector('.masthead'));

// Child pages request a view change without replacing either browsing context.
window.addEventListener('message',event=>{
 if(event.origin!==location.origin || !leaves.some(leaf=>leaf.querySelector('iframe').contentWindow===event.source))return;
 if(event.data?.type!=='book-view' || !['people','ingredients','together'].includes(event.data.view))return;
 setView(event.data.view);
 controls.find(button=>button.dataset.view===book.dataset.view).focus({preventScroll:true});
});

phone.addEventListener('change',()=>setView(phone.matches?lastSingleView:'together'));
setView(phone.matches?'people':'together');
const closeOtherDialogs=source=>leaves.forEach(leaf=>{
 const frame=leaf.querySelector('iframe');
 if(frame.contentWindow!==source)frame.contentWindow.postMessage({type:'book-dismiss-dialog'},location.origin);
});
window.addEventListener('pointerdown',()=>closeOtherDialogs(null));
window.addEventListener('message',event=>{
 if(event.origin===location.origin && event.data?.type==='book-interaction' && leaves.some(leaf=>leaf.querySelector('iframe').contentWindow===event.source))closeOtherDialogs(event.source);
});
new ResizeObserver(([entry])=>document.body.style.setProperty('--footer-height',entry.target.getBoundingClientRect().height+'px')).observe(document.querySelector('.research-footer'));

book.addEventListener('scroll',()=>{
 if(!phone.matches)return;
 const view=book.scrollLeft>=book.clientWidth/2?'ingredients':'people';
 if(view!==book.dataset.view)setView(view,false);
},{passive:true});

// Shared study links retain the book and open the exact record.
function openSharedStudy(){
if(['#people','#ingredients'].includes(location.hash)){setView(location.hash.slice(1));return;}
const sharedStudy=new URLSearchParams(location.hash.slice(1));
for(const [kind,view] of [['person','people'],['recipe','ingredients']]){
 const value=sharedStudy.get(kind);
 if(!value)continue;
 const frame=document.querySelector('#'+view+' iframe'),url=new URL(frame.src);
 url.searchParams.set(kind,value);frame.src=url.href;setView(view);
 break;
}
}
openSharedStudy();
window.addEventListener('hashchange',openSharedStudy);
window.addEventListener('message',event=>{
 if(event.origin!==location.origin || !leaves.some(leaf=>leaf.querySelector('iframe').contentWindow===event.source))return;
 const {type,kind,value}=event.data||{};
 if(!['person','recipe'].includes(kind))return;
 if(type==='book-detail' && typeof value==='string')history.replaceState(null,'','#'+new URLSearchParams({[kind]:value}));
 if(type==='book-detail-close' && new URLSearchParams(location.hash.slice(1)).has(kind))history.replaceState(null,'',location.pathname+location.search);
});
