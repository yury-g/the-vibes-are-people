export function studyLink(dialog,kind,value){
 let mission=dialog.querySelector('[data-agent-mission]');
 if(!mission){mission=document.createElement('a');mission.dataset.agentMission='';mission.textContent='Send my agent to help trace this ↗';mission.target='_top';mission.style.cssText='display:block;margin:1rem;padding:.8rem;border:1px solid currentColor;color:inherit';dialog.append(mission);}
 const topic=kind==='recipe'?value:(dialog.querySelector('#detail-name')?.textContent||value);
 mission.href='/agents/?'+new URLSearchParams({topic,context:kind}).toString()+'#missions';
 const hash=new URLSearchParams({[kind]:value}).toString();
 const url=new URL('/#'+hash,location.origin);
 let button=dialog.querySelector('[data-copy-study]');
 if(!button){
  button=document.createElement('button');button.type='button';button.dataset.copyStudy='';button.className='quiet';
  dialog.querySelector('.dialog-bar,.dialog-head').insertBefore(button,dialog.querySelector('#close'));
  button.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(button.dataset.url);button.textContent='Link copied';}
   catch{button.textContent='Copy the address bar link';}
  });
 }
 button.dataset.url=url.href;button.textContent='Copy link';
 if(document.documentElement.classList.contains('in-book'))parent.postMessage({type:'book-detail',kind,value},location.origin);
 else history.replaceState(null,'',urlForStandalone());
 function urlForStandalone(){const local=new URL(location.href);local.searchParams.set(kind,value);return local;}
 if(!dialog.dataset.linkClose){
  dialog.dataset.linkClose='true';
  dialog.addEventListener('close',()=>{
   if(document.documentElement.classList.contains('in-book'))parent.postMessage({type:'book-detail-close',kind},location.origin);
   else {const local=new URL(location.href);local.searchParams.delete(kind);history.replaceState(null,'',local);}
  });
 }
}
