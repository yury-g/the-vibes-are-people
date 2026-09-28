// Touching the backdrop dismisses; scrolling or touching dialog padding does not.
export function dismissOnOutsideTouch(dialog){
 dialog.addEventListener('pointerdown',event=>{
  if(event.target!==dialog || event.button!==0)return;
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom){
   event.preventDefault();
   dialog.close();
  }
 });
}
