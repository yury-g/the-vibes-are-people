export function studyLink(dialog,kind,value){
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
