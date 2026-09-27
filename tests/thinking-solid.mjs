import assert from 'node:assert/strict';
import {ThinkingKoi} from '../dist/iterations/brain/thinking-koi.js';
import {LetterSchool,SpatialSchool} from '../dist/iterations/brain/school.js';
import {glyphBox,penetration} from '../dist/iterations/minnow-solid.js';
globalThis.scrollY=0;
for(const corner of [[0,0],[1,0],[0,1],[1,1]]){
 const x=corner[0]?710:90,y=corner[1]?510:90,heading=Math.atan2(corner[1]?1:-1,corner[0]?1:-1),e=Object.create(ThinkingKoi.prototype);
 Object.assign(e,{x,y,w:800,h:600,right:800,bottom:576,heading,vx:Math.cos(heading)*56,vy:Math.sin(heading)*56,speed:56,time:0,phase:0,allType:true,steps:0,bodySince:0,tap:{x:0,y:0,until:0},transitions:[],mode:'wander',spine:Array.from({length:15},(_,i)=>({x:x-Math.cos(heading)*i*6.4,y:y-Math.sin(heading)*i*6.4}))});
 e.letters=Array.from({length:20},(_,i)=>{const lx=45+(i%5)*32,ly=45+Math.floor(i/5)*32,x=corner[0]?800-lx:lx,y=corner[1]?600-ly:ly;return{id:i+1,ch:'a',x,y,hx:x,hy:y,vx:0,vy:0,size:16,width:9,height:16,visible:true,state:'home',personal:1,phase:0,frequency:8,wing:0,angle:0,cooldown:0,scares:0,el:{classList:{add(){},remove(){}}}};});
 const s=Object.create(LetterSchool.prototype);Object.assign(s,{engine:e,hash:new SpatialSchool(),pointer:{x:-1000,y:-1000,until:0},visible:e.letters});e.school=s;e.articulate(0);
 for(let i=0;i<600;i++){e.step(1/60);for(const l of e.letters){const q=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2);assert(q.clearance>=-.1,`Full fish penetration ${corner}: ${q.clearance}`);}for(let a=0;a<e.letters.length;a++)for(let b=a+1;b<e.letters.length;b++){const x=e.letters[a],y=e.letters[b];if(x.state==='home'&&y.state==='home')continue;const p=penetration(glyphBox(x),glyphBox(y));assert(!p||p.depth<.1,`Letter overlap ${corner}: ${p?.depth}`);}}
 console.log(`Corner ${corner}: moving thinking koi and20 minnows remain planar and solid`);
}
