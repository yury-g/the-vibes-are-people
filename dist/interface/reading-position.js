// Separate enter/exit distances avoid flicker when the footer changes pane height.
if(document.documentElement.classList.contains('in-book')){
 let nearBottom=false,scheduled=false;
 function report(){
  scheduled=false;
  const root=document.scrollingElement;
  const remaining=root.scrollHeight-innerHeight-root.scrollTop;
  const next=root.scrollTop>0&&remaining<=(nearBottom?480:300);
  if(next===nearBottom)return;
  nearBottom=next;
  parent.postMessage({type:'book-reading-position',nearBottom},location.origin);
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(report);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 window.addEventListener('load',schedule);
 new ResizeObserver(schedule).observe(document.body);
 // Reset the parent when an exact study link replaces this frame's document.
 parent.postMessage({type:'book-reading-position',nearBottom:false},location.origin);
}
