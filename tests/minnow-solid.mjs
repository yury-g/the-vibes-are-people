import assert from 'node:assert/strict';
import {updateSchool} from '../dist/iterations/minnow-motion.js';
import {SpatialSchool} from '../dist/iterations/brain/school.js';
globalThis.scrollY=0;
const empty={bounds:{left:-1000,right:-900,top:-1000,bottom:-900},query:()=>({clearance:Infinity,nx:0,ny:0}),project:(x,y)=>({x,y})};
const glyph=(id,x,y,w=16,h=22)=>({id,x,y,hx:x,hy:y,width:w,height:h,size:h,state:'fleeing',visible:true,vx:0,vy:0,personal:1,phase:0,frequency:8,wing:0,angle:0,cooldown:10,scares:0,burstUntil:99,el:{classList:{add(){},remove(){}}}});
function scene(letters){const e={x:-900,y:-900,w:1000,h:700,time:0,skin:empty};const s={engine:e,visible:letters,hash:new SpatialSchool()};return{e,s,tick(){e.time+=1/60;updateSchool(s,1/60);}};}
// Two fast bodies must never change order by crossing through one another.
const a=glyph(1,300,300),b=glyph(2,340,300);a.vx=460;b.vx=-460;const c=scene([a,b]);
for(let i=0;i<20;i++){c.tick();const overlap=Math.abs(a.x-b.x)<(a.width+b.width)/2-1&&Math.abs(a.y-b.y)<(a.height+b.height)/2-1;assert(!overlap,'Head-on minnows penetrate instead of colliding');}
console.log('Passed: high-speed head-on glyphs do not overlap.');
const {resolveSchool,glyphBox,penetration}=await import('../dist/iterations/minnow-solid.js');
function assertClear(letters,label){for(let i=0;i<letters.length;i++)for(let j=i+1;j<letters.length;j++){if(letters[i].state==='home'&&letters[j].state==='home')continue;const q=penetration(glyphBox(letters[i]),glyphBox(letters[j]));assert(!q||q.depth<.04,`${label}: overlap ${q?.depth}, ${i}/${j}`);}}
for(const [w,h,angle] of [[80,100,.18],[8,14,-.18]]){
 const large=glyph(1,400,300,w,h),small=glyph(2,300,300,8,14);large.angle=angle;large.wing=1;small.wing=1;small.vx=2000;
 const t=scene([large,small]);const starts=new Map(t.s.visible.map(l=>[l,{x:l.x,y:l.y}]));small.x+=130;resolveSchool(t.s,starts,1/60);assertClear(t.s.visible,'Fast small vs rotated finned body');assert(small.x<large.x,'A fast small glyph must not tunnel across the body.');
}
console.log('Passed: mixed-size rotated glyphs and fins, swept fast crossing.');
const crowd=Array.from({length:80},(_,i)=>{const l=glyph(i+1,180+i%10*44,140+Math.floor(i/10)*46,i%13===0?25:12,i%13===0?32:18);l.wing=.7;l.vx=Math.sin(i*2.1)*220;l.vy=Math.cos(i*1.3)*220;return l;});
const dense=scene(crowd);let maxChecks=0;
for(let k=0;k<120;k++){
 const starts=new Map(crowd.map(l=>[l,{x:l.x,y:l.y}]));for(const l of crowd){l.x+=l.vx/60;l.y+=l.vy/60;l.angle=Math.sin(k*.02+l.id)*.18;}
 resolveSchool(dense.s,starts,1/60);assertClear(crowd,'Dense school');maxChecks=Math.max(maxChecks,dense.s.collisionChecks);
}
console.log('Passed: dense moving school nonpenetration; maximum local candidate checks',maxChecks);
// Settled text is an obstacle; a returner must route around it to its vacant slot.
const settled=glyph(10,400,300,55,70);settled.state='home';
const returner=glyph(11,300,300,12,20);Object.assign(returner,{hx:500,hy:300,state:'returning'});
const homeScene=scene([settled,returner]);for(let i=0;i<1500;i++){homeScene.tick();assertClear([settled,returner],'Settled text obstacle');}
assert.equal(returner.state,'home','Blocked returner must eventually route to its own slot');assert.equal(settled.x,400);
const eaten=glyph(12,500,300);eaten.eaten=true;homeScene.s.visible.push(eaten);homeScene.tick();assert.equal(returner.state,'home');
console.log('Passed: settled obstacle, eventual home return, consumed glyph exclusion.');
const returning=Array.from({length:30},(_,i)=>{const l=glyph(100+i,150+i%10*54,120+Math.floor(i/10)*70,16,22);Object.assign(l,{hx:150+i%10*25,hy:440+Math.floor(i/10)*35,state:'returning'});return l;});
const schoolHome=scene(returning);for(let i=0;i<3600;i++){schoolHome.tick();assertClear(returning,'Home-slot recovery');}
assert.equal(returning.filter(l=>l.state==='home').length,30,'A dense displaced school must return to all free native slots');
console.log('Passed: all30 minnows return without permanent piling or gridlock.');
const run={};const kerned=Array.from({length:8},(_,i)=>{const l=glyph(200+i,160+i*28,180,16,22);Object.assign(l,{run,hx:160+i*15.5,hy:300,state:'returning',ink:{left:-7.5,right:7.5,top:-10,bottom:10}});return l;});
const native=scene(kerned);for(let i=0;i<2400;i++)native.tick();assert(kerned.every(l=>l.state==='home'),'Tightly kerned native text must settle');
console.log('Passed: tight native kerning restored with folded fins.');
const {LetterSchool:ActiveSchool}=await import('../dist/iterations/brain/school.js');
const reset=Object.create(ActiveSchool.prototype),resized=glyph(400,700,400);resized.el.getBoundingClientRect=()=>({left:30,top:70,right:46,bottom:92,width:16,height:22});
const textRun={el:{getClientRects:()=>[{}]},glyphs:[resized]};
Object.assign(reset,{engine:{w:390,h:844,ctx:{font:'',measureText:()=>({fontBoundingBoxDescent:4,actualBoundingBoxLeft:0,actualBoundingBoxRight:14,actualBoundingBoxAscent:16,actualBoundingBoxDescent:4})}},runs:new Map([[1,textRun]]),metrics:new Map(),letters:[resized],layoutWidth:1280,layoutHeight:720,paused:false,sync(){}});
globalThis.innerWidth=390;globalThis.innerHeight=844;globalThis.document={querySelector:()=>null,activeElement:null};globalThis.getComputedStyle=()=>({fontSize:'20px',font:'20px Arial',letterSpacing:'normal',textTransform:'none'});
reset.measure();assert.equal(resized.state,'home');assert.equal(resized.x,38);assert.equal(resized.y,81);assert(resized.ink.right>resized.ink.left);
resized.state='fleeing';resized.x=100;reset.settle();assert.equal(resized.x,resized.hx);assert.equal(resized.state,'home');assert.equal(resized.wing,0);
console.log('Passed: active-school resize reanchors slots and pause restores readable native text.');
