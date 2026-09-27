import assert from 'node:assert/strict';
import {Koi} from '../dist/iterations/brain/koi.js';
const e=Object.create(Koi.prototype);let calls=0;
Object.assign(e,{paused:false,school:null,last:0,accumulator:0,raf:0,measure(){},draw(){},updateDiagnostics(){},onFrame(state){assert.equal(state,e);calls++;}});
globalThis.cancelAnimationFrame=()=>{};
e.setPaused(true);assert.equal(calls,1,'Pause must publish the exact frozen engine to its cameras.');
console.log('Passed: camera pause receives shared engine.');

import {CameraAtlas} from '../dist/iterations/brain/atlas.js';
const atlas=Object.create(CameraAtlas.prototype),a={id:1,state:'fleeing'},b={id:2,state:'home'};
atlas.engine={paused:false,time:1,prey:b,school:{visible:[a,b]}};atlas.selected=null;atlas.lastSelection=-1;
assert.equal(atlas.select(),a,'Camera tracks an actual active letter object, not a copy.');
a.phase=2.3;assert.equal(atlas.selected.phase,2.3);
atlas.engine.paused=true;atlas.engine.school.visible=[];assert.equal(atlas.select(),a,'Paused camera keeps its tracked subject.');
console.log('Passed: shared letter identity and frozen selection.');
