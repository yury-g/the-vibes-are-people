import assert from 'node:assert/strict';
import {articulate,swim} from '../dist/iterations/ultraviolet-best/body.js';
import {buildSkin} from '../dist/iterations/ultraviolet-best/skin.js';
for(const [w,h] of [[320,568],[375,667],[768,1024],[1440,900],[844,390],[568,320]]){
 const e={w,h,x:w/2,y:h/2,heading:0,speed:56,phase:0,requestedSpeed:108,navBounds:{left:45,right:w-45,top:45,bottom:h-45}};articulate(e,0);let margin=Infinity,turns=0;
 for(let i=0;i<6000;i++){
  e.target={x:i%720<360?w-30:30,y:i%1440<720?30:h-30};
  const oldYaw=e.yaw||0,oldSpeed=e.speed;swim(e,1/60);articulate(e,1/60);
  assert(Math.abs(e.yaw-oldYaw)<=3/60+1e-8,'bounded yaw acceleration');assert(Math.abs(e.speed-oldSpeed)<=160/60+1e-8,'bounded speed change');assert(e.speed>0,'escape never stops');
  const b=buildSkin(e).bounds;margin=Math.min(margin,b.left,w-b.right,b.top,h-b.bottom);turns=Math.max(turns,e.turnLedger.used/(2*Math.PI));
  assert(margin>=0,JSON.stringify({w,h,i,margin,turns}));assert(turns<=2.5+1e-9);
 }
 console.log({w,h,minSilhouetteMargin:margin,maxDirectionalTurns:turns});
}
