import assert from 'node:assert/strict';
import {articulate,swim,angleDelta} from '../dist/iterations/ultraviolet-flow/body.js';
import {buildSkin} from '../dist/iterations/ultraviolet-flow/skin.js';
import {limitYaw,recordTurn,MAX_TURN} from '../dist/iterations/ultraviolet-flow/turns.js';
import {Koi as Legacy} from '../dist/iterations/ultraviolet-full-copy/koi.js';
globalThis.scrollY=0;
const old=Object.create(Legacy.prototype);Object.assign(old,{x:500,y:400,w:1280,h:720,right:1280,bottom:700,allType:true,heading:0,vx:56,vy:0,speed:56,phase:0,requestedSpeed:56,target:{x:100,y:400},spine:Array.from({length:15},(_,i)=>({x:500-i*6.4,y:400}))});
let oldNeck=0,oldLink=0;
for(let i=0;i<120;i++){old.steer(1/60);old.articulate(1/60);oldNeck=Math.max(oldNeck,Math.abs(angleDelta(old.heading,old.body[1].a)));for(let j=1;j<15;j++)oldLink=Math.max(oldLink,Math.abs(Math.hypot(old.body[j].x-old.body[j-1].x,old.body[j].y-old.body[j-1].y)-6.4));}
assert(oldNeck>.3&&oldLink>.2,'The original low-speed reversal reproduces neck separation and stretched rendered links');
console.log({legacyNeckDegrees:oldNeck*180/Math.PI,legacyRenderedLinkError:oldLink});
const straight={w:1280,h:720,x:640,y:360,heading:0,speed:56,phase:0};articulate(straight,0);let tailMin=Infinity,tailMax=-Infinity;
for(let i=0;i<360;i++){straight.x+=56/60;straight.phase+=(2.5+56*.035)/60;articulate(straight,1/60);if(i>60){tailMin=Math.min(tailMin,straight.body[14].y-straight.y);tailMax=Math.max(tailMax,straight.body[14].y-straight.y);}}
assert(tailMax-tailMin>5,'tail visibly flexes even in straight swimming without any turning');console.log({straightSwimmingTailSweep:tailMax-tailMin});
if(process.argv.includes('--legacy-only'))process.exit(0);
for(const hz of [60,30])for(const [w,h] of [[320,640],[390,844],[768,1024],[1280,720],[844,390]]){
 const scale=Math.min(1,w/600,h/600),dt=1/hz,e={x:w/2,y:h/2,w,h,heading:0,speed:56*scale,vx:56*scale,vy:0,phase:0,requestedSpeed:108,navBounds:{left:45,right:w-45,top:45,bottom:h-45}};articulate(e,0);
 let minSkin=Infinity,maxYawAccel=0,maxNeck=0,maxJoint=0,maxLink=0,maxTurns=0,waveMin=Infinity,waveMax=-Infinity,minTravel=Infinity;
 for(let i=0;i<90*hz;i++){
  const t=i/hz,goals=[[w-20,20],[20,h-20],[w-20,h-20],[20,20]];
  const g=t<40?goals[Math.floor(t/5)%4]:t<65?[w/2+Math.cos(t*1.2)*w*.2,h/2+Math.sin(t*1.2)*h*.2]:(Math.floor(t/2)%2?[w-20,h/2]:[20,h/2]);
  e.target={x:g[0],y:g[1]};e.requestedSpeed=t%15>12?56:108;
  const prev={x:e.x,y:e.y,yaw:e.yaw||0,speed:e.speed};swim(e,dt);articulate(e,dt);
  const accel=Math.abs(e.yaw-prev.yaw)/dt;maxYawAccel=Math.max(maxYawAccel,accel);assert(accel<=3+1e-7,'bounded yaw acceleration');assert(Math.abs(e.yaw)<=1.5+1e-8);
  const travel=Math.hypot(e.x-prev.x,e.y-prev.y);minTravel=Math.min(minTravel,travel);assert(travel>0.1*scale,'forward swimming cannot stall');assert(Math.abs(travel-e.speed*dt)<1e-8,'forward inertia without teleport');assert(Math.abs(e.speed-prev.speed)<=110*scale*dt+1e-8);
  const neck=Math.abs(angleDelta(e.body[1].a,e.heading));maxNeck=Math.max(maxNeck,neck);assert(neck<1e-10,'head is physically joined to the neck');
  for(let j=1;j<15;j++){const p=e.body[j-1],q=e.body[j],link=Math.abs(Math.hypot(q.x-p.x,q.y-p.y)-e.segmentLength),joint=Math.abs(angleDelta(q.a,p.a));maxLink=Math.max(maxLink,link);maxJoint=Math.max(maxJoint,joint);assert(link<1e-8,'all rendered skeleton links retain their physical length');assert(joint<=.18+1e-8,'no body kink');}
  const wave=angleDelta(e.body[14].a,e.body[8].a);waveMin=Math.min(waveMin,wave);waveMax=Math.max(waveMax,wave);
  const box=buildSkin(e).bounds,clear=Math.min(box.left,w-box.right,box.top,h-box.bottom);minSkin=Math.min(minSkin,clear);assert(clear>=0,`full skin remains visible: ${w}x${h} at ${t}s, clearance ${clear}`);
  maxTurns=Math.max(maxTurns,e.turnLedger.used/(2*Math.PI));assert(e.turnLedger.used<=MAX_TURN+1e-9,'directional rotations never exceed 2.5');
 }
 assert(waveMax-waveMin>.1,'tail has an active flexible wave');console.log({w,h,hz,minSkin,maxYawAccel,maxNeck,maxJoint,maxLink,maxTurns,tailFlexRange:waveMax-waveMin,minTravel});
}
for(const sign of [-1,1]){const e={yaw:0,canCounterturn:false};for(let i=0;i<2400;i++){const previous=e.yaw;e.yaw=limitYaw(e,sign*1.5,1/60,1.5);assert(Math.abs(e.yaw-previous)<=3/60+1e-8);recordTurn(e,e.yaw/60);assert(e.turnLedger.used<=MAX_TURN+1e-9);}assert(Math.abs(e.turnLedger.used-MAX_TURN)<1e-7,'hard cap exercised by sustained same-direction requests');}
console.log('Flow motion: original defect reproduced; 900 simulated seconds of fullskin corner, chase, and reversal checks passed.');
