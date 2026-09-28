(() => {
 const slug=text=>text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 let scrolled=false;
 function addLinks(root){
  const headings=[...(root.matches?.('h2,h3,h4')?[root]:[]),...root.querySelectorAll('h2,h3,h4')];
  for(const heading of headings){
   if(heading.closest('dialog,.masthead,.page-bar') || heading.querySelector('a') || !heading.textContent.trim())continue;
   const label=heading.textContent.trim();
   if(!heading.id){
    const section=heading.closest('section[id],article[id]');
    const base=(section?section.id+'-':'')+slug(label);let id=base,n=2;
    while(document.getElementById(id))id=base+'-'+n++;
    heading.id=id;
   }
   const link=document.createElement('a');link.className='section-link';
   const url=new URL(location.href);url.searchParams.delete('book');url.hash=heading.id;
   link.href=url.href;if(document.documentElement.classList.contains('in-book'))link.target='_top';link.setAttribute('aria-label','Link to '+label);link.title='Link to this section';
   heading.append(link);
  }
  if(!scrolled && location.hash){
   let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);
   if(target){scrolled=true;target.scrollIntoView({block:'start'});}
  }
 }
 addLinks(document);
 new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1 && !node.matches('.section-link'))addLinks(node);
 }).observe(document.body,{childList:true,subtree:true});
})();
