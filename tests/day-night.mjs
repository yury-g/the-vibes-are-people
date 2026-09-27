import test from 'node:test';
import assert from 'node:assert/strict';
const physics=await import('../dist/iterations/day-night/physics.js').catch(()=>({}));
const bead=await import('../dist/iterations/day-night/chain.js').catch(()=>({}));
// A missing contact pass permits letters to overlap under sustained central force.
test('letters remain separate and inside the tank under crowding and variable frame times',()=>{
 assert.equal(typeof physics.stepLetters,'function','letter solver is available');
 for(const [w,h] of [[320,568],[390,844],[1280,800]]){
  const ls=Array.from({length:10},(_,i)=>({x:35+i*25,y:170,hx:35+i*25,hy:170,width:18,height:32,vx:0,vy:0}));
  for(let k=0;k<1200;k++){
   physics.stepLetters(ls,[.008,.016,.033,.05][k%4],{width:w,height:h,pointer:{x:w/2,y:170},time:k/60});
   for(let i=0;i<ls.length;i++){
    const a=ls[i];assert(a.x-a.width/2>=7.99&&a.x+a.width/2<=w-7.99);assert(a.y-a.height/2>=7.99&&a.y+a.height/2<=h-7.99);
    for(let j=i+1;j<ls.length;j++){const b=ls[j];assert(Math.abs(a.x-b.x)>=(a.width+b.width)/2-.001||Math.abs(a.y-b.y)>=(a.height+b.height)/2-.001,`overlap ${i}/${j} at ${k}`);}
   }
  }
 }
});
// Release must latch once, reject accidental short drags, and cancel safely.
test('chain switches once after a pull, not on a small drag or cancellation',()=>{
 assert.equal(typeof bead.BeadChain,'function','chain is available');
 const c=new bead.BeadChain(90,16);let tip=c.points.at(-1);c.begin(tip.x,tip.y);c.move(tip.x+5,tip.y+4);assert.equal(c.release(),false);
 tip=c.points.at(-1);c.begin(tip.x,tip.y);c.move(tip.x+15,tip.y+45);for(let i=0;i<20;i++)c.step(1/60);assert.equal(c.release(),true);assert.equal(c.release(),false);
 for(let i=0;i<600;i++)c.step(1/60);
 assert.equal(c.points[0].x,90);assert.equal(c.points[0].y,16);
 assert(Math.abs(c.points.at(-1).x-90)<3,'chain settles below its anchor');
 tip=c.points.at(-1);c.begin(tip.x,tip.y);c.move(tip.x,tip.y+70);assert.equal(c.release(true),false);
 assert(c.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
