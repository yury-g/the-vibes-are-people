// A guide around the existing interfaces. No duplicate art, data or study logic.
(()=>{
 const bar=document.querySelector('#tour-bar'), launch=document.querySelector('#tour-launch');
 const toggle=document.querySelector('#tour-toggle'), previous=document.querySelector('#tour-previous'),next=document.querySelector('#tour-next');
 const title=document.querySelector('#tour-title'),caption=document.querySelector('#tour-caption'),position=document.querySelector('#tour-position'),timing=document.querySelector('#tour-timing'),progress=document.querySelector('#tour-progress');
 const frames={people:document.querySelector('#people iframe'),ingredients:document.querySelector('#ingredients iframe')};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const q=(doc,selector)=>{const el=doc.querySelector(selector);if(!el)throw new Error('The selected view is not ready.');return el};
 const click=(doc,selector)=>q(doc,selector).click();
 const close=doc=>doc.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
 const scroll=(doc,selector)=>{
  const el=q(doc,selector),dialog=el.closest('dialog');
  const top=dialog?el.getBoundingClientRect().top-dialog.getBoundingClientRect().top+dialog.scrollTop:el.getBoundingClientRect().top+doc.defaultView.scrollY;
  (dialog||doc.defaultView).scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
 };
 const person=(doc,name)=>{close(doc);click(doc,'#sheet-tab');const card=[...doc.querySelectorAll('.card')].find(el=>el.querySelector('.card-caption').textContent===name);if(!card)throw new Error('Study unavailable.');card.click()};
 const recipe=(doc,name)=>{close(doc);click(doc,'#clear-search');const tile=[...doc.querySelectorAll('.tile')].find(el=>el.querySelector('.tile-label').textContent===name);if(!tile)throw new Error('Recipe unavailable.');tile.click()};
 const stops=[
  {view:'together',seconds:12,title:'Two ways into the same story',text:'Moving studies on one side. Their human ingredients on the other. Let the tour drive, or pause anywhere to explore.',run:({people:p,ingredients:r})=>{close(p);close(r);click(p,'#sheet-tab');click(r,'#clear-search');scroll(p,'#sheet');scroll(r,'#grid')}},
  {view:'people',seconds:16,title:'Start with what moves you',text:'Every study stays attached to a face. These animations are original explorations, with sources for the people and ideas behind them.',run:({people:p})=>{close(p);click(p,'#sheet-tab');scroll(p,'#sheet')}},
  {view:'people',seconds:22,title:'Meet the person behind an idea',text:'An enlarged moving study sits beside a portrait, a short history, and links you can follow. Take a moment to watch the pattern.',run:({people:p})=>person(p,'Ken Perlin')},
  {view:'people',seconds:22,title:'Unstir the recipe',text:'Look inside the animation: what rules make this study move? The recipe describes this original sketch, while the sources document its connections.',run:({people:p})=>{person(p,'Ken Perlin');click(p,'#unmix-open');click(p,'[data-step="1"]');scroll(p,'#unmix-panel')}},
  {view:'people',seconds:24,title:'Follow the trail back to a person',text:'The recipe leads back to a real person, their contribution, and documented paths onward. A visual resemblance alone is not evidence of influence.',run:({people:p})=>{person(p,'Ken Perlin');click(p,'#unmix-open');click(p,'[data-step="2"]');scroll(p,'#unmix-panel')}},
  {view:'ingredients',seconds:22,title:'Read a recipe as an ingredients label',text:'The same collection can be explored through techniques. Watch this domain-warping sketch, then follow the people listed in its human ingredients.',run:({people:p,ingredients:r})=>{close(p);recipe(r,'Domain warping')}},
  {view:'ingredients',seconds:28,title:'More than a single inventor',text:'Each contribution has a role and a source. Foundational work, later explanations, and artistic practice stay distinct. Pause here to read or follow a link.',run:({ingredients:r})=>{recipe(r,'Domain warping');scroll(r,'#human-ingredients')}},
  {view:'ingredients',seconds:26,title:'Try a different recipe',text:'Reaction–diffusion brings another group of people into view. The moving sketch introduces the idea; the label gives you the contributions and evidence.',run:({ingredients:r})=>recipe(r,'Reaction–diffusion (Gray–Scott)')},
  {view:'people',seconds:22,title:'Return to a moving study',text:'Follow one of those ingredients back into the people collection. The study, portrait, and explanation remain together as you explore.',run:({ingredients:r,people:p})=>{close(r);person(p,'Karl Sims')}},
  {view:'people',seconds:20,title:'Explore documented connections',text:'These lines represent relationships listed in the evidence below. You can drag a card or open a person; the tour pauses when you take over.',run:({people:p})=>{close(p);click(p,'#world-tab');scroll(p,'#network')}},
  {view:'together',seconds:14,title:'Now follow your own curiosity',text:'Open either side, pick a pattern, and read who is inside. You can replay this tour any time, or explore freely from here.',run:({people:p,ingredients:r})=>{close(p);close(r);click(p,'#sheet-tab');click(r,'#clear-search');scroll(p,'#sheet');scroll(r,'#grid')}}
 ];
 let active=false,playing=false,loading=false,index=0,remaining=0,deadline=0,generation=0,finished=false,prepared=-1;
 const bound=new WeakSet();
 function paint(){
  bar.dataset.state=finished?'finished':loading?'loading':playing?'playing':'paused';bar.dataset.step=String(index);
  position.textContent=`${index+1} / ${stops.length}`;
  toggle.textContent=playing?'Ⅱ Pause tour':finished?'↺ Replay tour':'▶ Resume tour';
  toggle.setAttribute('aria-label',playing?'Pause tour':finished?'Replay tour':'Resume tour');
  launch.textContent=active?'End tour':'▶ Play tour';launch.setAttribute('aria-label',active?'End tour':'Play tour');launch.setAttribute('aria-expanded',String(active));
  toggle.disabled=loading;previous.disabled=loading||index===0;next.disabled=loading||index===stops.length-1;
  const seconds=Math.max(0,Math.ceil((playing?deadline-Date.now():remaining)/1000));
  timing.textContent=finished?'Tour complete · explore or replay':loading?'Opening this view…':playing?`Next in ${seconds}s`:`Paused · take your time`;
  progress.max=stops[index].seconds*1000;progress.value=progress.max-Math.max(0,playing?deadline-Date.now():remaining);
 }
 function pause(note){
  if(!active||finished)return;
  if(playing)remaining=Math.max(0,deadline-Date.now());
  playing=false;
  if(loading){generation++;loading=false;}
  if(note)timing.textContent=note;
  paint();
 }
 function takeover(event){
  if(!event.isTrusted||!active||(!playing&&!loading))return;
  if(event.target?.closest?.('#tour-bar,#tour-launch'))return;
  if(event.type==='keydown'&&!['Enter',' ','Escape','ArrowDown','ArrowUp','PageDown','PageUp','Tab'].includes(event.key))return;
  pause();
 }
 function bind(doc){if(bound.has(doc))return;bound.add(doc);for(const event of ['pointerdown','wheel','touchstart','keydown'])doc.addEventListener(event,takeover,{capture:true,passive:true});}
 bind(document);
 for(const frame of Object.values(frames))frame.addEventListener('load',()=>{try{bind(frame.contentDocument)}catch{}if(active&&!loading)pause()});
 async function ready(token){
  const until=Date.now()+12000;
  while(Date.now()<until){
   if(token!==generation||!active)return null;
   try{
    const docs={people:frames.people.contentDocument,ingredients:frames.ingredients.contentDocument};
    if(docs.people?.querySelectorAll('.card').length===18&&docs.ingredients?.body.dataset.provenance==='ready'){
     bind(docs.people);bind(docs.ingredients);return docs;
    }
   }catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error('The views are still loading. Please try Play tour again.');
 }
 async function go(to,autoplay=playing){
  const focused=document.activeElement;
  // Reset only frames that the visitor has navigated away from the tour's views.
  for(const [key,frame] of Object.entries(frames)){
   const path=key==='people'?'/notes/living/':'/notes/ingredients/techniques.html';
   try{if(frame.contentWindow.location.pathname!==path)frame.src=path}catch{frame.src=path}
  }
  prepared=-1;const token=++generation;index=Math.max(0,Math.min(stops.length-1,to));finished=false;playing=false;loading=true;remaining=stops[index].seconds*1000;
  title.textContent=stops[index].title;caption.textContent=stops[index].text;paint();
  try{
   const docs=await ready(token);if(!docs||token!==generation)return;
   setView(stops[index].view);
   // Let the page unfold before asking its existing controls to position content.
   await new Promise(resolve=>setTimeout(resolve,reduced.matches?0:450));
   if(token!==generation||!active)return;
   if(index===0&&!reduced.matches){
    for(const doc of Object.values(docs)){if(q(doc,'#motion').textContent.includes('Play motion'))click(doc,'#motion')}
   }
   stops[index].run(docs);
   // Programmatic dialog and search controls must not steal the tour controls' focus.
   prepared=index;loading=false;playing=autoplay;deadline=Date.now()+remaining;paint();
   if(focused&&focused!==document.body)(focused.disabled?toggle:focused).focus({preventScroll:true});
   window.scrollTo({top:0,behavior:'instant'});
  }catch(error){if(token!==generation)return;loading=false;playing=false;caption.textContent=error.message;paint();}
 }
 function start(){
  active=true;bar.hidden=false;document.body.classList.add('tour-active');
  go(0,true);
 }
 function stop(){active=false;playing=false;loading=false;finished=false;generation++;bar.hidden=true;document.body.classList.remove('tour-active');paint();launch.focus({preventScroll:true})}
 launch.addEventListener('click',()=>active?stop():start());
 document.querySelector('#tour-exit').addEventListener('click',stop);
 toggle.addEventListener('click',()=>{
  if(finished){go(0,true);return;}
  if(playing){pause();return;}
  // A cancelled loading stop must be prepared again before resuming.
  if(prepared!==index){go(index,true);return;}
  playing=true;deadline=Date.now()+remaining;paint();
 });
 previous.addEventListener('click',()=>go(index-1,playing));next.addEventListener('click',()=>go(index+1,playing));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)pause()});
 setInterval(()=>{
  if(!active||!playing||loading)return;
  if(document.hidden){pause();return;}
  if(Date.now()>=deadline){
   if(index===stops.length-1){finished=true;playing=false;remaining=0;paint()}
   else go(index+1,true);
  }else paint();
 },250);
})();
new ResizeObserver(([entry])=>document.body.style.setProperty('--tour-height',entry.target.getBoundingClientRect().height+'px')).observe(document.querySelector('#tour-bar'));
