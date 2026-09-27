import assert from 'node:assert/strict';
import {capability} from '../dist/iterations/brain/size-motion.js';
import {HuntingKoi} from '../dist/iterations/brain/hunting-koi.js';
globalThis.scrollY=0;
const small=capability({size:12}),big=capability({size:64});
for(const key of ['burst','cruise','acceleration','returnSpeed'])assert(big[key]>small[key]*1.5,`${key} follows rendered size`);
assert(capability({size:10000}).burst<=460,'Size scaling bounded');
export function fish(){const e=Object.create(HuntingKoi.prototype);Object.assign(e,{x:300,y:300,w:800,h:600,right:800,bottom:576,heading:0,vx:56,vy:0,speed:56,time:0,phase:0,allType:true,steps:0,bodySince:0,letters:[],tap:{until:0},transitions:[],mode:'wander',spine:Array.from({length:15},(_,i)=>({x:300-i*6.4,y:300}))});e.articulate(0);e.refreshBounds();return e;}
export const glyph=(id,x,y,size=16)=>({id,ch:'a',x,y,hx:x,hy:y,size,width:size*.55,height:size,visible:true,state:'home',scares:0,vx:0,vy:0,personal:1,phase:0,frequency:8,wing:0,angle:0,cooldown:0,el:{classList:{add(){},remove(){}}}});
const e=fish(),a=glyph(1,430,280,64),b=glyph(2,430,320,12);e.letters=[a,b];e.selectTarget();assert.equal(e.prey,a,'Large target initially valuable');
for(let i=0;i<400;i++){e.time+=1/60;e.selectTarget();}
assert(e.failedChases>=1,'Stalled real chase records failure');assert(e.smallUntil>e.time,'Failure prompts temporary smaller preference');assert(e.prey===b||b.restUntil>e.time,'Smaller prey selected after failed large chase');assert(a.restUntil>e.time,'Failed target cannot immediately reset');
const c=fish();c.letters=[glyph(3,340,300)];c.capture();assert.equal(c.eaten||0,0,'No distant catch');c.letters[0].x=302;c.capture();assert.equal(c.eaten,1);assert(c.letters[0].eaten);c.capture();assert.equal(c.eaten,1,'No duplicate');
const back=fish();back.letters=[glyph(4,295,300)];back.capture();assert.equal(back.eaten||0,0,'No capture through head');
console.log('Size capability, actual failure fallback, bounded memory and mouth-only capture pass');
// Real update path: size drives escape impulse and cap, not just metadata.
const {updateSchool}=await import('../dist/iterations/brain/size-motion.js');
function escape(size){const l=glyph(88,500,300,size);l.alertAt=0;const e={x:300,y:300,heading:0,time:1,w:800,h:600,prey:l,skin:{bounds:{left:280,right:320,top:280,bottom:320},query:()=>({clearance:2,nx:1,ny:0}),project:(x,y)=>({x,y,clearance:1})}};const s={engine:e,visible:[l],hash:{build(){},forces:()=>({x:0,y:0}),checks:0}};updateSchool(s,1/60);return Math.hypot(l.vx,l.vy);}
assert(escape(64)>escape(12)*3,'Actual large escape is much faster');
const {SizedSchool}=await import('../dist/iterations/brain/size-school.js');
globalThis.document={createDocumentFragment:()=>({append(){}}),createTextNode:ch=>ch};
const slot={ch:'a',eaten:true,el:{textContent:'a'}},run={glyphs:[slot],slots:[slot],native:{},visual:{replaceChildren(){}}};const school=Object.create(SizedSchool.prototype);school.makeGlyph=(r,ch)=>({ch,el:{textContent:ch}});school.fillRun(run,'');school.fillRun(run,'x');assert.equal(run.glyphs[0],slot);assert(slot.eaten,'Control text changes cannot resurrect caught letters');
console.log('Actual escape ordering and permanent dynamic slots pass');
