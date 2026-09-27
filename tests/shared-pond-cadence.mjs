import assert from 'node:assert/strict';
import {SharedTank} from '../dist/iterations/shared-pond/tank.js';
globalThis.document={hidden:false};let steps=0;
const e={raf:0,paused:false,visible:true,mini:false,last:1000,accumulator:0,school:{},step(dt){assert(dt>0&&dt<=1/30);steps++;},draw(){},onFrame(){},start(){}};
SharedTank.prototype.frame.call(e,1016.1);assert(steps>0,'a slightly early display callback must advance the visible pose');
for(const elapsed of [16.1,17.2,15.4,18.7,33,49]){const before=steps;SharedTank.prototype.frame.call(e,e.last+elapsed);assert(steps>before);}
console.log('Every display callback advances the shared pose; long frames use bounded substeps.');
