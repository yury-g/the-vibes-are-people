import assert from 'node:assert/strict';
import {chooseBehavior,Koi} from '../dist/iterations/koi.js';
import {threatAt,cruiseFor,chooseBehavior as archivedDecision} from '../dist/iterations/net/archive-koi.js';
// Real behavioral invariants: continuous proximity, precedence, and smooth speed response.
const speeds=[300,230,180,115,50,0].map(d=>cruiseFor(threatAt(d)));
assert.equal(speeds[0],56);assert.equal(speeds.at(-1),280);
for(let i=2;i<speeds.length;i++)assert(speeds[i]>speeds[i-1]);
assert.equal(archivedDecision({netActive:true,netDistance:100,tapActive:true,hasPrey:true}),'evade');
assert.equal(chooseBehavior({netActive:true,netDistance:0,tapActive:false,hasPrey:true}),'hunt','The normal study cannot activate net evasion.');
assert.equal(chooseBehavior({netActive:false,netDistance:0,tapActive:true,hasPrey:true}),'investigate');
assert.equal(chooseBehavior({netActive:false,tapActive:false,hasPrey:true}),'hunt');
assert.equal(chooseBehavior({netActive:false,tapActive:false,hasPrey:false}),'wander');
globalThis.scrollY=0;
const koi=Object.create(Koi.prototype);
Object.assign(koi,{x:500,y:400,right:1200,bottom:800,heading:0,vx:56,vy:0,phase:0,mode:'hunt',target:{x:1000,y:400},requestedSpeed:280});
koi.steer(1/60);assert(koi.speed>56&&koi.speed<80,'Acceleration is gradual, not an instant jump.');
for(let i=0;i<40;i++)koi.steer(1/60);assert(koi.speed>220&&koi.speed<240);
koi.requestedSpeed=56;const fast=koi.speed;koi.steer(1/60);assert(koi.speed<fast&&koi.speed>56,'Recovery decelerates smoothly.');
console.log('Behavior checks passed: proximity ramp, decision priority, gradual acceleration and recovery.');
