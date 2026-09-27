import assert from 'node:assert/strict';
import {buildSkin} from '../dist/iterations/fish-skin.js';
import {buildSkin as before} from '../history/2026-09-16-v10/dist/iterations/fish-skin.js';
import {Plumage} from '../dist/iterations/toy-koi/plumage.js';
for(const toy of [false,true]){
 const e={x:400,y:300,phase:1.2,speed:56,turn:.05,body:Array.from({length:15},(_,i)=>({x:400-i*6.4,y:300+Math.sin(i*.3)*8,a:.1}))};if(toy){e.plumage=new Plumage();e.plumage.update(1/60,e);}
 const a=buildSkin(e),b=before(e);
 for(let i=0;i<1200;i++){const x=200+(i*37%340),y=170+(i*59%280),r=i%50;const p=a.query(x,y,r),q=b.query(x,y,r);assert(p.clearance===q.clearance||Math.abs(p.clearance-q.clearance)<1e-8);const pa=a.project(x,y,r),pb=b.project(x,y,r);assert(Math.hypot(pa.x-pb.x,pa.y-pb.y)<1e-7);}
}
console.log('Passed: optimized normal/toy skin queries and projections match the preserved original geometry.');
