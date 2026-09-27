import assert from 'node:assert/strict';
import {waterMatrix,screenToWorld,applyWater,withoutWater} from '../dist/iterations/ultraviolet-best/water.js';
for(let t=0;t<80;t+=.13)for(const scroll of [0,314,1200]){
 const m=waterMatrix(t),[a,b,c,d,tx,ty]=m;
 for(const [x,y] of [[0,0],[195,844],[1280,720]]){
  const p=screenToWorld(m,a*x+c*y+tx,b*x+d*y+ty,scroll);
  assert(Math.abs(p.x-x)<1e-8&&Math.abs(p.y-y-scroll)<1e-8);
 }
 const page={style:{}},canvas={style:{}};applyWater(page,canvas,t,false,scroll);
 const pm=page.style.transform.match(/matrix\((.*)\)/)[1].split(',').map(Number);
 const worldY=scroll+320,x=50;
 assert(Math.abs(pm[0]*x+pm[2]*worldY+pm[4]-(a*x+c*320+tx))<1e-8);
 assert(Math.abs(pm[1]*x+pm[3]*worldY+pm[5]-scroll-(b*x+d*320+ty))<1e-8);
 assert(Math.abs(tx)<1&&Math.abs(ty)<1.2&&Math.abs(c)<.001);
 const before=[page.style.transform,canvas.style.transform];
 assert.throws(()=>withoutWater([page,canvas],()=>{assert.equal(page.style.transform,'none');throw new Error('measurement');}));
 assert.deepEqual([page.style.transform,canvas.style.transform],before);
 applyWater(page,canvas,t,true,scroll);assert.equal(page.style.transform,'none');assert.equal(canvas.style.transform,'none');
}
console.log('Water: coherent screen/document transforms, inverse taps, exception-safe layout measurements and pause identity passed.');
