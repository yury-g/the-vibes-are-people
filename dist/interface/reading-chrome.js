(() => {
// Only the pages currently being read can reveal the shell's research footer.
const book=document.querySelector('.book');
const footer=document.querySelector('.research-footer');
const leaves=[...book.querySelectorAll('.leaf')];
const nearBottom=new Map();
function updateFooter(){
 const visible=leaves.some(leaf=>(book.dataset.view==='together'||book.dataset.view===leaf.id)&&nearBottom.get(leaf.id));
 // Keep keyboard focus stable if someone is already using a footer link.
 footer.hidden=!visible&&!footer.contains(document.activeElement);
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.data?.type!=='book-reading-position'||typeof event.data.nearBottom!=='boolean')return;
 const leaf=leaves.find(leaf=>leaf.querySelector('iframe').contentWindow===event.source);
 if(!leaf)return;
 nearBottom.set(leaf.id,event.data.nearBottom);updateFooter();
});
new MutationObserver(updateFooter).observe(book,{attributes:true,attributeFilter:['data-view']});
footer.addEventListener('focusout',()=>queueMicrotask(updateFooter));

})();
