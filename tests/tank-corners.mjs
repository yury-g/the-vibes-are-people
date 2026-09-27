import assert from 'node:assert/strict';
import {tank} from './tank.mjs';
import {glyph} from './size-hunt.mjs';
import {glyphBox,penetration} from '../dist/iterations/tank/solid.js';
import {shakeOffset} from '../dist/iterations/tank/water.js';
for(const [x,y]of[[65,65],[735,65],[65,535],[735,535]]){
 const e=tank();e.x=x;e.y=y;e.spine.forEach((p,i)=>{p.x=x-i*6.4;p.y=y;});e.articulate(0);e.shake();let back=0;
 for(let i=0;i<1800;i++){if(i===60||i===120)e.shake();e.step(1/60);assert(e.x>=24&&e.x<=776&&e.y>=24&&e.y<=576);assert(Math.abs(e.water.x)<35&&Math.abs(e.water.y)<20);back=Math.max(back,e.letters.filter(l=>l.state==='home').length);for(const l of e.school.visible){assert(Number.isFinite(l.x)&&Number.isFinite(l.y));} }
 assert(back>=5);assert(e.water.energy<.01);assert.notEqual(e.mode,'startled');console.log(`Corner${x},${y}: bounded repeated impulses;${back}home`);
}
const e=tank();e.shake();e.time+=.1;assert(Math.abs(shakeOffset(e).x)>0);e.reducedMotion=true;assert.deepEqual(shakeOffset(e),{x:0,y:0});
// Dense same-run home slots stress simultaneous recovery of large typography.
const dense=tank(),run={};dense.letters=Array.from({length:18},(_,i)=>({...glyph(i+1,140+(i%9)*52,130+Math.floor(i/9)*130,72),run}));dense.school.visible=dense.letters;dense.shake();dense.selectTarget=function(){this.prey=null;this.mode='wander';this.target={x:740,y:540};this.requestedSpeed=56;};let settled=0;
for(let i=0;i<3600;i++){dense.step(1/60);settled=Math.max(settled,dense.letters.filter(l=>l.state==='home').length);for(let a=0;a<dense.school.visible.length;a++)for(let b=a+1;b<dense.school.visible.length;b++){const x=dense.school.visible[a],y=dense.school.visible[b];if(x.state==='home'&&y.state==='home')continue;const p=penetration(glyphBox(x),glyphBox(y));assert(!p||p.depth<.2,'Dense recovery stays planar');}}
assert(settled>=16,`Dense large letters return:${settled}`);console.log(`Dense72px school:${settled}home; reducedmotion jolt suppressed`);
// An unsuccessful or consumed path must respect its retry deadline, leaving
// the bounded planner budget available for other individuals.
const {returnRoute}=await import('../dist/iterations/tank/return-route.js');
const retry=tank(),waiting=retry.letters[0];waiting.state='returning';waiting.path=[];waiting.pathUntil=retry.time+1;retry.school.pathBudget=3;
assert.equal(returnRoute(retry.school,waiting),null);assert.equal(retry.school.pathBudget,3,'Empty path honors retry deadline');
console.log('Failed-route retry fairness passes');
const shelter=tank();shelter.shake();shelter.startleGoal={x:shelter.x+40,y:shelter.y};shelter.selectTarget();assert.equal(shelter.startleGoal.y,shelter.h*.8,'Clear-water transition precedes arrival braking');
