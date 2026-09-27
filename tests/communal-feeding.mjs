import test from 'node:test';
import assert from 'node:assert/strict';
import {FeedingShrimp} from '../dist/iterations/hunting-tank/feeding.js';
const letter=(group,x=350,y=550)=>({group,x,y,width:60,glyphWidth:52,height:70,inkHeight:60,inkOffset:0,settled:true,sinking:true,inkPixels:Array.from({length:240},(_,i)=>({x:i%20*2,y:Math.floor(i/20)*2})),bites:[]});

test('large meals fill three seats, then spare hungry shrimp take small meals',()=>{
 const w=new FeedingShrimp(800,700),big=letter('name'),small=letter('science',100);
 w.letters=[small,big];
 for(const s of w.shrimp.slice(0,3)){const l=w.pickMeal(s);assert.equal(l,big);w.travelTo(s,{letter:l,meal:true});}
 assert.equal(w.pickMeal(w.shrimp[3]),small);
 const poses=w.shrimp.slice(0,3).map(s=>w.refugePose(big,s));
 for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(Math.hypot(poses[i].x-poses[j].x,poses[i].y-poses[j].y)>=30*(w.shrimp[i].scale+w.shrimp[j].scale)+3);
 big.eaten=true;assert.equal(w.pickMeal(w.shrimp[3]),small);
});
test('small-letter diners finish their meal when large food becomes available',()=>{
 const w=new FeedingShrimp(800,700),big=letter('name'),small=letter('science',100),s=w.shrimp[0];
 Object.assign(s,{host:small,meal:true,patch:null,state:'feeding'});
 w.step(1/120,[],[big,small]);assert.equal(s.host,small);assert.equal(s.state,'feeding');assert.ok(small.remainingInk.length<small.inkPixels.length);
});
test('three large-letter diners stay attached, finish at triple speed, then permit small meals',()=>{
 const w=new FeedingShrimp(800,700),big=letter('name'),small=letter('science',100);
 w.shrimp=w.shrimp.slice(0,3);w.letters=[big,small];
 for(const s of w.shrimp){w.travelTo(s,{letter:big,meal:true});Object.assign(s,{...w.refugePose(big,s),host:big,meal:true,destination:null,state:'feeding',cooldown:Infinity});}
 for(let i=0;i<120*30;i++){w.update(1/120,[],[big,small]);w.syncRiders([big,small]);assert.equal(w.shrimp.filter(s=>s.host===big).length,3);}
 assert.ok(!big.eaten);assert.ok(big.remainingInk.length<big.inkPixels.length);assert.equal(small.feastStarted,undefined);
 for(let i=0;i<120*15&&!big.eaten;i++){w.update(1/120,[],[big,small]);w.syncRiders([big,small]);}
 assert.ok(big.eaten);w.update(1/120,[],[big,small]);assert.ok(w.shrimp.some(s=>s.destination?.letter===small));
});
test('two diners fit a smaller large glyph at the floor without a third stacking',()=>{
 const w=new FeedingShrimp(520,700),big={...letter('name',250,648),glyphWidth:30,width:38,inkHeight:30,height:44};w.letters=[big];
 for(const s of w.shrimp.slice(0,2)){assert.equal(w.pickMeal(s),big);w.travelTo(s,{letter:big,meal:true});}
 assert.equal(w.pickMeal(w.shrimp[2]),undefined);
});
test('three shrimp swim into their reserved large-letter feeding positions',()=>{
 const w=new FeedingShrimp(800,700),big=letter('name');w.letters=[big];w.shrimp=w.shrimp.slice(0,3);
 for(const s of w.shrimp){w.travelTo(s,{letter:big,meal:true});const p=w.refugePose(big,s);Object.assign(s,{x:p.x+20,y:p.y-20,angle:p.angle,cooldown:Infinity});}
 for(let i=0;i<120*25;i++){w.update(1/120,[],[big]);w.syncRiders([big]);}
 assert.equal(w.shrimp.filter(s=>s.host===big&&s.meal).length,3);
});
test('actual diners multiply intake; shrimp still approaching do not count',()=>{
 for(const count of [1,2,3]){
  const w=new FeedingShrimp(800,700),big=letter('name');
  for(const [i,s]of w.shrimp.entries())Object.assign(s,i<count?{host:big,meal:true,state:'feeding'}:{destination:{letter:big,meal:true},state:'approach'});
  assert.equal(w.feedingRate(big),count);
  let finish=0;for(;finish<120&&!big.eaten;finish+=.01){w.time=finish;w.graze(big,w.shrimp[0]);}
  assert.ok(Math.abs(finish*count-100)<6,`${count} diners finish in ${finish.toFixed(2)} s`);
 }
});

test('surplus shrimp reach and eat small letters alongside an occupied large feast',()=>{
 const w=new FeedingShrimp(800,700),big=letter('name',350,620),small=letter('science',150,640);
 w.shrimp=w.shrimp.slice(0,4);w.letters=[big,small];
 for(const s of w.shrimp.slice(0,3)){w.travelTo(s,{letter:big,meal:true});Object.assign(s,{...w.refugePose(big,s),host:big,meal:true,destination:null,state:'feeding',cooldown:Infinity});}
 const hungry=w.shrimp[3];Object.assign(hungry,{x:small.x+35,y:small.y-65,patch:null,host:null,destination:null,state:'perched',cooldown:Infinity});
 let bothEating=false;
 for(let i=0;i<120*60&&!small.eaten;i++){w.update(1/120,[],[big,small]);w.syncRiders([big,small]);if(hungry.host===small&&w.shrimp.some(s=>s.host===big))bothEating=true;}
 assert.ok(bothEating,'small feeding starts while the large feast continues');assert.ok(small.eaten,'hungry shrimp completes the small meal');
});

test('feeding claws touch remaining ink on large and small meals',()=>{
 const w=new FeedingShrimp(800,700);
 for(const group of ['name','science'])for(const s of w.shrimp.slice(0,2)){
  const l={...letter(group),maskWidth:60,maskHeight:70,remainingInk:[{x:22,y:33},{x:24,y:33},{x:22,y:35}]};
  Object.assign(s,{host:l,meal:true,mealSlot:2});const p=w.refugePose(l,s),flip=p.surfaceFlip;
  const claw={x:p.x+(9*Math.cos(p.angle)-10*flip*Math.sin(p.angle))*s.scale,y:p.y+(9*Math.sin(p.angle)+10*flip*Math.cos(p.angle))*s.scale};
  assert.ok(l.remainingInk.some(q=>Math.hypot(claw.x-(l.x-30+q.x),claw.y-(l.y-35+q.y))<.01),'claw target reaches actual remaining ink');
 }
});
