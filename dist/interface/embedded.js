(() => {
 // Only the same-origin folding shell may suppress this page's standalone chrome.
 let embedded=false;
 try { embedded=Boolean(window.frameElement?.matches('iframe[data-book-page]')); } catch {}
 if(!embedded)return;
 document.documentElement.classList.add('in-book');
 window.addEventListener('message',event=>{
  if(event.origin===location.origin && event.source===parent && event.data?.type==='book-dismiss-dialog')document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
 });
 document.addEventListener('pointerdown',()=>parent.postMessage({type:'book-interaction'},location.origin));
 document.addEventListener('DOMContentLoaded',()=>{
  const motion=document.querySelector('body > header #motion');
  if(motion)document.querySelector('.surface-label')?.append(motion);
  // Keep ordinary destinations out of a pane whose label would become misleading.
  // Same-document filters/anchors and explicitly opened external sources stay local.
  document.addEventListener('click',event=>{
   const link=event.target.closest('a[href]');
   if(!link || link.hasAttribute('download'))return;
   if(link.classList.contains('notes-home')){link.target='_top';return;}
   const url=new URL(link.href,location.href);
   if(url.origin!==location.origin)return;
   if(url.pathname===location.pathname && (url.search || url.hash))return;
   const view=!url.search&&!url.hash ? ({
    '/notes/living/':'people',
    '/notes/ingredients/people.html':'people',
    '/notes/techniques/':'ingredients',
    '/notes/ingredients/techniques.html':'ingredients',
    '/notes/ingredients/compare.html':'together',
    '/notes/ingredients/':'together',
    '/':'together'
   })[url.pathname] : null;
   if(view && event.button===0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey){
    event.preventDefault();
    parent.postMessage({type:'book-view',view},location.origin);
   }else if(!link.target || link.target==='_self'){
    link.target='_top';
   }
  });
 });
})();
// A gesture inside an iframe cannot reliably scroll its parent on iOS.
// Forward a deliberate horizontal swipe; vertical reading and dialog gestures stay local.
if(document.documentElement.classList.contains('in-book')){
 let swipeStart=null;
 document.addEventListener('touchstart',event=>{
  swipeStart=null;
  if(event.touches.length!==1 || !matchMedia('(max-width:700px), (pointer:coarse) and (max-width:1000px) and (max-height:500px)').matches || document.querySelector('dialog[open]') || event.target.closest('input,a,#world') || (event.target.closest('button') && !event.target.closest('.card,.tile')))return;
  const touch=event.touches[0];swipeStart={x:touch.clientX,y:touch.clientY};
 },{passive:true});
 document.addEventListener('touchend',event=>{
  if(!swipeStart)return;
  const touch=event.changedTouches[0],dx=touch.clientX-swipeStart.x,dy=touch.clientY-swipeStart.y;
  swipeStart=null;
  if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.8){event.preventDefault();parent.postMessage({type:'book-view',view:dx<0?'ingredients':'people'},location.origin);}
 },{passive:false});
 document.addEventListener('touchcancel',()=>{swipeStart=null},{passive:true});
}
