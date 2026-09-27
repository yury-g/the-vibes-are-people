import test from 'node:test';
import assert from 'node:assert/strict';
import {BalloonShrimp,targetHunters} from '../dist/iterations/inflated-tank/riders.js';
import {makeFish} from '../dist/iterations/shared-pond/world.js';
const balloon=(x=300)=>({group:'name',x,y:250,hx:x,hy:250,width:50,height:65,glyphWidth:40,inkHeight:48,vx:0,vy:0,bites:[]});
test('a shrimp with no letter meal chooses an unbitten balloon ride',()=>{
 const tank=new BalloonShrimp(800,600),l=balloon();tank.letters=[l];const s=tank.shrimp[0];tank.patches.forEach(p=>p.amount=0);tank.setFeeder([{x:700,y:100}]);
 assert.equal(tank.pickFood(s,[])?.letter,l);assert.ok(!tank.pickFood(s,[])?.meal);
 l.bites=[{x:1,y:1,r:1}];assert.notEqual(tank.pickFood(s,[])?.letter,l);
});
test('an edible meal takes priority over a recreational ride',()=>{
 const tank=new BalloonShrimp(800,600),l=balloon(),meal={...balloon(500),settled:true,bites:[{}]};tank.letters=[l,meal];const choice=tank.pickFood(tank.shrimp[0],[]);assert.equal(choice.letter,meal);assert.equal(choice.meal,true);
});
test('one fish investigates an occupied balloon while the others keep their own interests',()=>{
 const l=balloon(),fishes=[2,3,4].map(id=>makeFish(id,800,600)),rider={host:l,meal:false,state:'perched',x:l.x,y:l.y-40};
 targetHunters(fishes,[l],[rider],10);const interested=fishes.filter(f=>f.riderHunt);assert.equal(interested.length,1);assert.equal(interested[0].prey,l);assert.ok(interested[0].requestedSpeed>=170);assert.ok(fishes.some(f=>f.mode==='wander'));
 rider.host=null;rider.state='escape';targetHunters(fishes,[l],[rider],10.1);assert.ok(fishes.every(f=>!f.riderHunt));assert.ok(fishes.every(f=>f.requestedSpeed<170));
});
test('a hungry fish does not duplicate another fish’s occupied balloon pursuit',()=>{
 const l=balloon(),fishes=[2,3,4].map(id=>makeFish(id,800,600)),rider={host:l,meal:false,state:'perched',x:l.x,y:l.y-40};
 targetHunters(fishes,[l],[rider],0);
 assert.equal(fishes.filter(f=>f.prey===l).length,1);
});
test('a shrimp still approaching does not activate the fish; poke recovery still wins',()=>{
 const l=balloon(),fishes=[2,3,4].map(id=>makeFish(id,800,600)),rider={destination:{letter:l},state:'approach',x:20,y:20};
 targetHunters(fishes,[l],[rider],10);assert.equal(fishes[0].prey,null);
 rider.host=l;rider.state='perched';fishes[0].fleeUntil=11;fishes[0].fleeTarget={x:100,y:500};targetHunters(fishes,[l],[rider],10.5);assert.equal(fishes[0].mode,'flee');assert.equal(fishes[0].prey,null);
});
test('a perched shrimp rides a moving balloon and leaves when it deflates',()=>{
 const tank=new BalloonShrimp(800,600),l=balloon(),s=tank.shrimp[0];tank.letters=[l];Object.assign(s,{host:l,meal:false,state:'perched',patch:null,rideUntil:100});
 l.x+=60;l.y+=20;l.vx=45;l.vy=12;tank.syncRiders([l]);const pose=tank.refugePose(l,s);assert.equal(s.x,pose.x);assert.equal(s.y,pose.y);assert.equal(s.vx,45);
 l.bites=[{}];tank.step(1/120,[],[l]);assert.notEqual(s.host,l);assert.notEqual(s.destination?.letter,l);
});
test('balloon ride reservations keep two shrimp from choosing the same perch',()=>{
 const tank=new BalloonShrimp(800,600),a=balloon(300),b=balloon(450);tank.letters=[a,b];const first=tank.shrimp[0],second=tank.shrimp[1];tank.travelTo(first,tank.pickFood(first,[]));const choice=tank.pickFood(second,[]);assert.ok(choice?.letter);assert.notEqual(choice.letter,first.destination.letter);
});
test('each occupied balloon gets at most one interested fish and choices stay stable',()=>{
 const a=balloon(300),b=balloon(600),fishes=[2,3,4].map(id=>makeFish(id,800,600)),riders=[{host:a,meal:false,state:'perched',x:300,y:210},{host:b,meal:false,state:'perched',x:600,y:210}];
 targetHunters(fishes,[a,b],riders,10);const first=fishes.filter(f=>f.riderHunt);assert.equal(first.length,2);assert.notEqual(first[0].prey,first[1].prey);
 for(const f of fishes){f.x=700-f.x;f.y=300;}targetHunters(fishes,[a,b],riders,10.1);for(const f of first)assert.ok(f.riderHunt&&[a,b].includes(f.prey));assert.notEqual(first[0].prey,first[1].prey);
 const departing=first[0].prey;riders.find(s=>s.host===departing).host=null;targetHunters(fishes,[a,b],riders,10.2);assert.equal(fishes.filter(f=>f.riderHunt).length,1);assert.equal(fishes.find(f=>f.riderHunt).prey,first[1].prey);
});
