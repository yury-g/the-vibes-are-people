import assert from 'node:assert/strict';
import {ThinkingKoi} from '../dist/iterations/brain/thinking-koi.js';
globalThis.scrollY=0;
function fish(x=300,y=300,heading=0){const e=Object.create(ThinkingKoi.prototype);Object.assign(e,{x,y,w:800,h:600,right:800,bottom:576,heading,vx:Math.cos(heading)*56,vy:Math.sin(heading)*56,speed:56,time:0,phase:0,allType:true,steps:0,bodySince:0,letters:[],tap:{x:0,y:0,until:0},transitions:[],mode:'wander',spine:Array.from({length:15},(_,i)=>({x:x-Math.cos(heading)*i*6.4,y:y-Math.sin(heading)*i*6.4}))});e.articulate(0);e.refreshBounds();return e;}
const glyph=(id,x,y)=>({id,ch:String(id),x,y,vx:0,vy:0,visible:true,scares:0,state:'home'});
for(const [x,y] of [[25,25],[775,25],[25,575],[775,575]]){
 const e=fish(x<400?90:710,y<300?90:510,Math.atan2(y-300,x-400));e.letters=[glyph(1,x,y)];let closest=1e6,inward=false;
 for(let i=0;i<1200;i++){e.time+=1/60;e.selectTarget();e.steer(1/60);e.articulate(1/60);closest=Math.min(closest,Math.hypot(e.x-x,e.y-y));if(e.time>6&&Math.hypot(e.x-x,e.y-y)>180)inward=true;}
 assert(closest<20,`Actual controller failed to approach ${x},${y}: ${closest}`);assert(inward,'Stale corner pursuit must release to inward patrol');
}
const e=fish();e.panelEdge=510;e.letters=[glyph(1,550,280),glyph(2,390,340)];e.selectTarget();assert.notEqual(e.prey?.id,1,'Occluded panel target cannot steer body');assert(e.eyes.some(eye=>eye.target?.id===1),'An eye may notice a letter the body cannot reach');
let switches=0,last=null;const steady=fish();steady.letters=[glyph(1,450,270),glyph(2,450,330)];for(let i=0;i<120;i++){steady.time+=1/60;steady.selectTarget();if(last&&steady.prey!==last)switches++;last=steady.prey;assert(steady.eyes.some(eye=>eye.target===steady.prey));}assert(switches===0,'Equal competing eye targets must not make body thrash');
console.log('Actual controller: all corners approached and escaped; panel targets excluded; body choice stable between independent eyes');

const flicker=fish(),fl= glyph(9,470,250);flicker.letters=[fl];for(let i=0;i<520;i++){flicker.time+=1/60;fl.visible=i%10!==0;flicker.selectTarget();}assert(fl.restUntil>flicker.time,'Intermittent loss of sight cannot reset pursuit budget');
console.log('Repeated reacquisition retains cumulative pursuit budget');
