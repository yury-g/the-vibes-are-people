import assert from 'node:assert/strict';
import {Koi} from '../dist/iterations/ultraviolet/koi.js';
const fish=Object.create(Koi.prototype);let drawn=0;
Object.assign(fish,{ctx:{clearRect(){},save(){},restore(){},beginPath(){},rect(){},clip(){},translate(){}},w:1200,h:800,paused:true,allType:true,body:[],drawFish(){drawn++;}});
globalThis.scrollY=0;globalThis.document={body:{classList:{contains(){return false;}}}};
fish.draw();assert.equal(drawn,1,'Paused UV tank retains its still skeleton.');
console.log('Passed: paused UV fish remains visible.');
// Resize clears the canvas; paused fish must be redrawn immediately.
Object.assign(globalThis,{innerWidth:390,innerHeight:844,devicePixelRatio:1});
globalThis.document={querySelector(){return null;},body:{classList:{contains(){return false;}}}};
Object.assign(fish,{canvas:{},ctx:{...fish.ctx,setTransform(){}},letters:[],mini:false,x:200,y:250,heading:0,spine:Array.from({length:15},(_,i)=>({x:200-i*6.4,y:250})),tap:{until:0},phase:0,speed:0,time:0,biteAt:0});
fish.resize();assert.equal(drawn,2,'Resize redraws a paused skeleton.');
import {drawSkeleton} from '../dist/iterations/ultraviolet/skeleton.js';
const context=new Proxy({},{set(target,key,value){target[key]=value;return true;},get(target,key){return target[key]??((...args)=>{for(const arg of args)if(typeof arg==='number')assert(Number.isFinite(arg),`${key} received non-finite geometry`);});}});
for(const phase of [0,1.5,3.2,5]){fish.phase=phase;fish.heading+=.6;fish.articulate(1/60);drawSkeleton(context,fish);}
console.log('Passed: paused resize and finite skeleton geometry across articulation phases.');
