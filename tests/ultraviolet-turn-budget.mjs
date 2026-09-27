import assert from 'node:assert/strict';
import {recordTurn,limitYaw,MAX_TURN} from '../dist/iterations/ultraviolet-best/turns.js';
import {buildSkin} from '../dist/iterations/ultraviolet-best/skin.js';
import {articulate,swim} from '../dist/iterations/ultraviolet-best/body.js';
for(const canCounterturn of [true,false])for(const direction of [-1,1]){
 const e={yaw:0,heading:0,canCounterturn};let max=0,previous=0;
 for(let i=0;i<12000;i++){
  // Deliberately request the same turn forever; target and capture churn cannot
  // reset a physical rotation ledger.
  e.target={id:i%7};e.biteAt=i%100<30?i+1:0;e.prey=i%3?{}:null;
  const yaw=limitYaw(e,direction*1.5,1/60,1.5);assert(Math.abs(yaw-previous)<=3/60+1e-8,'no hard yaw reversal');previous=yaw;e.yaw=yaw;const da=yaw/60;e.heading+=da;recordTurn(e,da);max=Math.max(max,e.turnLedger.used);assert(e.turnLedger.used<=MAX_TURN+1e-9,'5π directional cap');
 }
 assert(max>Math.PI,'Test exercises meaningful sustained turns');console.log({canCounterturn,direction,maxDirectionalTurns:max/(2*Math.PI)});
}
const jitter={};recordTurn(jitter,2);for(let i=0;i<100;i++){recordTurn(jitter,-.001);recordTurn(jitter,.001);}assert(jitter.turnLedger.used>=2,'tiny direction jitter cannot erase prior rotation');
const wrapped={heading:Math.PI-.001};recordTurn(wrapped,.01);recordTurn(wrapped,.02);assert(Math.abs(wrapped.turnLedger.used-.03)<1e-12,'ledger uses increments, not wrapped headings');
for(const w of [390,1280])for(const sign of [-1,1]){const e={x:w/2,y:360,w,h:720,heading:0,speed:56,vx:56,vy:0,phase:0,requestedSpeed:108,navBounds:{left:45,right:w-45,top:45,bottom:675}};articulate(e,0);let max=0;
 for(let i=0;i<9000;i++){const a=sign*i*.025;e.target={x:w/2+Math.cos(a)*70,y:360+Math.sin(a)*70};if(i%500===0)e.biteAt=i+50;swim(e,1/60);articulate(e,1/60);max=Math.max(max,e.turnLedger.used);assert(e.turnLedger.used<=MAX_TURN+1e-9);const box=buildSkin(e).bounds;assert(Math.min(box.left,w-box.right,box.top,720-box.bottom)>=0,'entire fish stays inside during escape');assert(e.x>=15&&e.x<=w-15&&e.y>=15&&e.y<=705,'turn escape stays within tank');}console.log({w,sign,maxTurns:max/(2*Math.PI)});}
