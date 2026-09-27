import assert from 'node:assert/strict';
import {EdgeCleaners} from '../dist/iterations/cleaner-shrimp/cleaners.js';
for(const [w,h,count] of [[1280,900,6],[390,844,4],[320,640,4],[844,390,6]]){
 const c=new EdgeCleaners(w,h),start=c.patches.reduce((n,p)=>n+p.food,0);
 assert.equal(c.shrimp.length,count);
 let picking=0,crawling=0;
 for(let frame=0;frame<7200;frame++){
  c.update(1/60);
  for(const s of c.shrimp){const p=c.pose(s.s);assert(p.x>=18&&p.x<=w-18&&p.y>=18&&p.y<=h-18);assert(Math.min(p.x,w-p.x,p.y,h-p.y)<30);assert(Number.isFinite(p.a));if(s.feeding)picking++;else crawling++;}
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){const a=c.pose(c.shrimp[i].s),b=c.pose(c.shrimp[j].s);assert(Math.hypot(a.x-b.x,a.y-b.y)>40,'shrimp remain separated');}
 }
 assert(c.patches.reduce((n,p)=>n+p.food,0)<start-5,'rendered algae is actually consumed');assert(c.grazed>5);assert(picking>0&&crawling>0);assert(c.shrimp.every(s=>s.travel>100));
 const consumed=c.grazed;c.resize(h,w);assert(c.length/c.patches.length>=40);assert.equal(c.grazed,consumed);for(const s of c.shrimp){const p=c.pose(s.s);assert(p.x>=18&&p.x<=h-18&&p.y>=18&&p.y<=w-18);}
 console.log({w,h,count,grazed:c.grazed,minTravel:Math.min(...c.shrimp.map(s=>s.travel))});
}
