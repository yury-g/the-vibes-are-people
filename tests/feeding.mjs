import assert from 'node:assert/strict';
import {Koi} from '../dist/iterations/feeding/koi.js';
assert.equal(typeof Koi.prototype.capture, 'function', 'Feeding must implement actual mouth contact.');
const fish=Object.create(Koi.prototype);
const classes=new Set();
const letter={ch:'a',x:102,y:100,visible:true,state:'fleeing',run:{panel:false},el:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}}};
Object.assign(fish,{x:100,y:100,heading:0,time:4,biteAt:0,eaten:0,captures:[],letters:[letter]});
fish.capture(); assert.equal(fish.eaten,1);assert.equal(letter.eaten,true);assert(classes.has('consumed'));
fish.capture(); assert.equal(fish.eaten,1,'A letter cannot be eaten twice.');
const remote={...letter,eaten:false,x:140,el:letter.el};fish.letters=[remote];fish.time=10;fish.capture();assert.equal(fish.eaten,1,'No consumption outside mouth proximity.');
const protectedLetter={...remote,x:102,run:{panel:true}};fish.letters=[protectedLetter];fish.capture();assert.equal(fish.eaten,1,'Operational diagnostics remain readable.');
console.log('Passed: mouth contact, no distant consumption, no double capture, diagnostic refuge.');
// Real steering + flock forces + capture over two simulated minutes.
import {LetterSchool,SpatialSchool} from '../dist/iterations/feeding/school.js';
globalThis.scrollY=0;
const hunter=Object.create(Koi.prototype),school=Object.create(LetterSchool.prototype);
const prey=Array.from({length:60},(_,i)=>({ch:'a',x:60+i%15*22,y:140+Math.floor(i/15)*40,hx:60+i%15*22,hy:140+Math.floor(i/15)*40,vx:0,vy:0,size:20,width:12,height:24,visible:true,state:'home',personal:1,phase:.4,frequency:8,wing:0,angle:0,cooldown:0,scares:0,run:{panel:false},el:{classList:{add(){},remove(){}}}}));
Object.assign(hunter,{x:350,y:350,vx:-56,vy:0,heading:Math.PI,w:600,h:500,right:600,bottom:480,allType:true,letters:prey,school,time:0,steps:0,mode:'wander',tap:{until:0},transitions:[],spine:Array.from({length:15},(_,i)=>({x:350+i*6.4,y:350})),phase:0,biteAt:0,eaten:0,captures:[]});
Object.assign(school,{engine:hunter,hash:new SpatialSchool(),pointer:{x:-1000,y:-1000,until:0},visible:prey});
for(let i=0;i<7200;i++)hunter.step(1/60);
assert(hunter.eaten>=1,`Fast, body-avoiding prey must still permit actual mouth captures, got ${hunter.eaten}`);
assert(hunter.eaten<=60,'No duplicate consumption.');
console.log(`Sustained pursuit: ${hunter.eaten}/60 eaten in 120 simulated seconds.`);

// Dynamic button labels reuse permanently consumed slots even after shrinking.
const oldDocument=globalThis.document;
globalThis.document={createDocumentFragment:()=>({append(){}}),createTextNode:ch=>ch};
const eatenSlot={ch:'e',eaten:true,el:{textContent:'e'}};
const run={glyphs:[eatenSlot],slots:[eatenSlot],native:{},visual:{replaceChildren(){}}};
const registry=Object.create(LetterSchool.prototype);registry.makeGlyph=(r,ch)=>({ch,el:{textContent:ch}});
registry.fillRun(run,'');registry.fillRun(run,'r');
assert.equal(run.glyphs[0],eatenSlot);assert.equal(run.glyphs[0].eaten,true,'Label changes cannot revive a consumed slot.');
globalThis.document=oldDocument;
console.log('Passed: dynamic slot identity survives shortening and replacement.');

globalThis.cancelAnimationFrame=()=>{};
hunter.start=()=>{};const eatenBefore=hunter.eaten;
hunter.setVisible(false);hunter.setVisible(true);
assert.equal(hunter.eaten,eatenBefore,'Visibility changes preserve consumption.');
assert.equal(hunter.letters.filter(l=>l.eaten).length,eatenBefore);
console.log('Passed: hide/show retains consumed state.');
