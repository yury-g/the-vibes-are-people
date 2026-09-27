import assert from 'node:assert/strict';
import {Koi} from '../dist/iterations/brain/koi.js';
globalThis.scrollY=0;
function fish(){const e=Object.create(Koi.prototype);Object.assign(e,{x:300,y:300,vx:0,vy:56,heading:Math.PI/2,w:800,h:600,right:800,bottom:580,allType:true,time:0,phase:0,letters:[],tap:{until:0},transitions:[],mode:'wander',requestedSpeed:56,steps:0});return e;}
const e=fish(),locked={x:310,y:300,vx:0,vy:0,scares:0,state:'home',visible:true,locked:true};e.letters=[locked];e.selectTarget();assert.notEqual(e.prey,locked,'A locked control letter cannot be a chase target.');
e.letters=[{...locked,locked:false,x:500,scares:8,state:'returning'}];e.selectTarget();assert.equal(e.mode,'wander','Original score cutoff abandons stale prey.');
const arrival=fish();arrival.x=280;arrival.target={x:300,y:300};
for(let i=0;i<1800;i++)arrival.steer(1/60);
assert(Math.hypot(arrival.x-300,arrival.y-300)<2,'Velocity arrival must converge instead of orbiting a close point.');
console.log('Passed: locked-letter exclusion, original interest cutoff, close-target convergence.');
const chase=fish();const target={...locked,locked:false,x:360,scares:0};chase.letters=[target];let consecutive=0,max=0;
for(let i=0;i<3600;i++){chase.time+=1/60;chase.selectTarget();chase.steer(1/60);if(chase.mode==='hunt')consecutive++;else consecutive=0;max=Math.max(max,consecutive);assert(Number.isFinite(chase.x));}
assert(max<=362,'An unproductive same-target chase is released within six seconds.');
for(const [x,y] of [[20,12],[780,12],[20,580],[780,580]]){const empty=fish();empty.x=x;empty.y=y;for(let i=0;i<1800;i++){empty.time+=1/60;empty.selectTarget();empty.steer(1/60);assert(empty.x>=20&&empty.x<=780&&empty.y>=12&&empty.y<=580);}}
console.log('Passed: sustained pursuit release, empty scene, corner bounds.');
