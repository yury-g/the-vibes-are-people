import assert from 'node:assert/strict';
import {TankKoi} from '../dist/iterations/tank/koi.js';
import {TankSchool} from '../dist/iterations/tank/school.js';
import {SpatialSchool} from '../dist/iterations/brain/school.js';
import {glyphBox,penetration} from '../dist/iterations/tank/solid.js';
import {fish,glyph} from './size-hunt.mjs';
export function tank(){const e=fish();Object.setPrototypeOf(e,TankKoi.prototype);e.letters=Array.from({length:24},(_,i)=>glyph(i+1,120+(i%6)*75,100+Math.floor(i/6)*65,i%7===0?36:14));const s=Object.create(TankSchool.prototype);Object.assign(s,{engine:e,visible:e.letters,hash:new SpatialSchool()});e.school=s;e.articulate(0);return e;}
const e=tank();assert(e.shake());assert(e.letters.every(l=>l.state==='fleeing'),'All visible minnows startle immediately');assert(!e.shake(),'Repeated input throttled');assert(e.water.energy>0);
const starts=new Map(e.letters.map(l=>[l,{x:l.x,y:l.y}])),returns=new Map();let maximum=0,homeCount=0;
for(let i=0;i<2400;i++){e.step(1/60);maximum=Math.max(maximum,e.water.energy);assert(e.x>=24&&e.x<=776&&e.y>=24&&e.y<=576,'Koi stays in bounds');for(const l of e.school.visible){if(l.state==='returning'&&!returns.has(l.id))returns.set(l.id,e.time);const d=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2);const dx=l.x-e.x,dy=l.y-e.y,f=dx*Math.cos(e.heading)+dy*Math.sin(e.heading),side=-dx*Math.sin(e.heading)+dy*Math.cos(e.heading);assert(d.clearance>=-.15||(f>=0&&f<50&&Math.abs(side)<4),'Full fish clearance');if(i===30)assert(Math.hypot(l.x-starts.get(l).x,l.y-starts.get(l).y)>1,'Impulse physically displaces every letter');}
 for(let a=0;a<e.school.visible.length;a++)for(let b=a+1;b<e.school.visible.length;b++){const x=e.school.visible[a],y=e.school.visible[b];if(x.state==='home'&&y.state==='home')continue;const p=penetration(glyphBox(x),glyphBox(y));assert(!p||p.depth<.15,`Flat glyph separation${p?.depth}step${i} ids${x.id}/${y.id}states${x.state}/${y.state}`);}homeCount=Math.max(homeCount,e.letters.filter(l=>l.state==='home').length);}
assert(e.water.energy<.01,'Water energy decays');assert(returns.size>10,'Individual returns occur');assert(new Set([...returns.values()].map(t=>Math.round(t*10))).size>5,'Returns stagger');assert(homeCount>=6,'Letters reach their spots');assert.notEqual(e.mode,'startled','Koi resumes autonomy');
for(let i=0;i<60;i++){e.time+=.5;e.shake();assert(e.water.energy<=1.01,'Repeated shakes bounded');}
e.paused=true;const n=e.shakeCount;assert(!e.shake());assert.equal(e.shakeCount,n,'Pause rejects new physical impulses');
console.log(`Tank impulse, ${returns.size} staggered returns, ${homeCount} home, solids/bounds and repeated-input limits pass`);
