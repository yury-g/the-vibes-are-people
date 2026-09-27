import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ArtKoi,profiles} from '../dist/iterations/art-koi/engine.js';
import {LetterSchool,SpatialSchool} from '../dist/iterations/brain/school.js';
import {glyphBox,penetration} from '../dist/iterations/minnow-solid.js';
globalThis.scrollY=0;
const sprites=JSON.parse(fs.readFileSync(new URL('./art-sprites.json',import.meta.url)));
for(const style of Object.keys(profiles)){
 const e=Object.create(ArtKoi.prototype);Object.assign(e,{profile:profiles[style],sprite:sprites[style],style,w:1280,h:720,right:1280,bottom:700,x:500,y:400,heading:Math.PI,vx:-50,vy:0,speed:50,beat:0,phase:0,time:0,mode:'hunt',spine:Array.from({length:15},(_,i)=>({x:500+i*13,y:400}))});
 const s=Object.create(LetterSchool.prototype);Object.assign(s,{engine:e,hash:new SpatialSchool(),pointer:{x:-1000,y:-1000,until:0},visible:[]});e.school=s;
 s.visible=Array.from({length:20},(_,i)=>({id:i+1,ch:'a',x:360+i*12,y:400,hx:360+i*12,hy:400,vx:0,vy:0,size:16,width:9,height:16,visible:true,state:'home',personal:1,phase:0,frequency:8,wing:0,angle:0,cooldown:0,scares:0,el:{classList:{add(){},remove(){}}}}));
 let maxBend=0;
 for(let tick=0;tick<600;tick++){
  e.time+=1/60;e.beat+=profiles[style].beat/60;e.heading=Math.PI+Math.sin(tick/130)*.6;e.x+=Math.cos(e.heading)*.4;e.y+=Math.sin(e.heading)*.4;e.articulate(1/60);e.updateMinnows(1/60);
  for(const l of s.visible){assert(Number.isFinite(l.x)&&Number.isFinite(l.y));const q=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2);assert(q.clearance>=-.1,`${style} fish penetration ${q.clearance}`);}
  for(let i=0;i<s.visible.length;i++)for(let j=i+1;j<s.visible.length;j++){const a=s.visible[i],b=s.visible[j];if(a.state==='home'&&b.state==='home')continue;const p=penetration(glyphBox(a),glyphBox(b));assert(!p||p.depth<.1,`${style} glyph overlap ${p?.depth}`);}
 }
 console.log(style+': 600 moving mesh steps, full fin/tail collision envelope and solid letters passed');
}
