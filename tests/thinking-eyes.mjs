import assert from 'node:assert/strict';
import {updateEyes,eyePose} from '../dist/iterations/brain/eyes.js';
const e={x:300,y:300,heading:0,time:0,body:[{x:300,y:300,a:0},{x:294,y:300,a:0}],letters:[{id:1,ch:'a',x:390,y:240,visible:true},{id:2,ch:'b',x:400,y:360,visible:true}]};
for(let i=0;i<60;i++){e.time+=1/60;updateEyes(e,1/60);}
assert.equal(e.eyes[0].target.id,1);assert.equal(e.eyes[1].target.id,2);
const before=e.eyes.map(x=>({...x.gaze}));e.letters[0].y=190;for(let i=0;i<20;i++){e.time+=1/60;updateEyes(e,1/60);}
assert.notEqual(e.eyes[0].gaze.y,before[0].y);assert(Math.abs(e.eyes[1].gaze.y-before[1].y)<.01,'Right eye must not copy the left');
e.letters[0].visible=false;updateEyes(e,1/60);assert.equal(e.eyes[0].target,null,'No tracking invisible letters');
e.letters=[{id:3,ch:'c',x:200,y:450,visible:true}];updateEyes(e,1/60);assert.equal(e.eyes[0].target,null,'Far-side target cannot be seen through head');
for(const eye of e.eyes){assert(Math.hypot(eye.gaze.x/1.65,eye.gaze.y/1.05)<=1.001);assert(Number.isFinite(eyePose(e,eye.side).x));}
console.log('Independent targets, side visibility, bounded pupils, and lost-target release passed');
