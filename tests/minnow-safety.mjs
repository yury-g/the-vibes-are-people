import {glyphBox,penetration} from '../dist/iterations/minnow-solid.js';
import assert from 'node:assert/strict';
import {buildSkin} from '../dist/iterations/fish-skin.js';
import {LetterSchool,SpatialSchool} from '../dist/iterations/brain/school.js';
import {Plumage} from '../dist/iterations/toy-koi/plumage.js';
globalThis.scrollY=0;
const e={x:400,y:300,w:800,h:600,time:0,phase:0,speed:56,turn:0,body:Array.from({length:15},(_,i)=>({x:400-i*6.4,y:300,a:0}))};e.skin=buildSkin(e);
const glyph=(x,y,extra={})=>({id:1,ch:'a',x,y,hx:x,hy:y,vx:0,vy:0,size:16,width:9,height:16,visible:true,state:'home',personal:1,phase:0,frequency:8,wing:0,angle:0,cooldown:0,scares:0,el:{classList:{add(){},remove(){}}},...extra});
const s=Object.create(LetterSchool.prototype);Object.assign(s,{engine:e,hash:new SpatialSchool(),pointer:{x:600,y:300,until:100},visible:[]});
const tick=()=>{e.time+=1/60;s.update(1/60);};
const far=glyph(600,300);s.visible=[far];e.prey=far;for(let i=0;i<120;i++)tick();assert.equal(far.state,'home');assert.equal(far.x,600,'Being selected or hovered does not frighten a distant letter.');
const close=glyph(423,300);s.visible=[close];for(let i=0;i<4;i++)tick();assert.equal(close.state,'fleeing');assert(Math.hypot(close.vx,close.vy)>250,'Close encounter produces a fast dart.');
for(const toy of [false,true]){
 if(toy){e.plumage=new Plumage();e.plumage.update(0,e);e.skin=buildSkin(e);}
 const l=glyph(220,300,{hx:460,hy:300,state:'returning',vx:150});s.visible=[l];let min=Infinity;
 for(let i=0;i<1800;i++){tick();const q=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2);min=Math.min(min,q.clearance);assert(q.clearance>=-.01,`Returning letter crossed ${toy?'oversized fins':'body/tail'}: ${q.clearance}`);}
 assert.equal(l.state,'home',`Letter routes around ${toy?'oversized fins':'fish'} and eventually returns.`);
 console.log({toy,minClearance:min});
}
console.log('Passed: delayed close trigger, no hover fright, sprint, full-body/fin/tail safe return.');
// Dense mixed-size school against moving / turning oversized appendages.
const crowd=Array.from({length:40},(_,i)=>glyph(170+i%8*45,150+Math.floor(i/8)*65,{id:i+1,size:i%9===0?72:16,width:i%9===0?55:9,height:i%9===0?80:16}));s.visible=crowd;
for(let i=0;i<360;i++){
 e.time+=1/60;e.phase+=.1;e.turn=.012;
 for(let j=0;j<e.body.length;j++){const a=i*.006;e.body[j]={x:400-Math.cos(a)*j*6.4,y:300-Math.sin(a)*j*6.4,a};}
 e.plumage.update(1/60,e);e.skin=buildSkin(e);s.update(1/60);
 for(let a=0;a<crowd.length;a++)for(let b=a+1;b<crowd.length;b++){if(crowd[a].state==='home'&&crowd[b].state==='home')continue;const q=penetration(glyphBox(crowd[a]),glyphBox(crowd[b]));assert(!q||q.depth<.05,`Fish + crowd pair overlap ${q?.depth} tick ${i}`);}
 for(const l of crowd){assert(Number.isFinite(l.x)&&Number.isFinite(l.y));const clearance=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2).clearance;assert(clearance>=-.05,`Moving fin penetrated glyph: ${clearance} tick ${i} glyph ${l.id} state ${l.state}`);}
}
console.log('Passed: moving full silhouette, dense mixed-size letters, no penetration/tunneling.');
