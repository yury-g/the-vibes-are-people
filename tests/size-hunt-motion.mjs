import assert from 'node:assert/strict';
import {fish,glyph} from './size-hunt.mjs';
import {SizedSchool} from '../dist/iterations/brain/size-school.js';
import {SpatialSchool} from '../dist/iterations/brain/school.js';
import {glyphBox,penetration} from '../dist/iterations/minnow-solid.js';
for(const corner of [[0,0],[1,0],[0,1],[1,1]]){
 const e=fish();e.x=corner[0]?650:150;e.y=corner[1]?450:150;e.heading=Math.atan2(corner[1]?1:-1,corner[0]?1:-1);e.spine.forEach((p,i)=>{p.x=e.x-Math.cos(e.heading)*i*6.4;p.y=e.y-Math.sin(e.heading)*i*6.4});
 e.letters=Array.from({length:24},(_,i)=>{const size=i%6===0?54:12,x=45+(i%6)*50,y=45+Math.floor(i/6)*60;return glyph(i+1,corner[0]?800-x:x,corner[1]?600-y:y,size)});
 const s=Object.create(SizedSchool.prototype);Object.assign(s,{engine:e,hash:new SpatialSchool(),visible:e.letters});e.school=s;e.articulate(0);
 let far=0;for(let i=0;i<3600;i++){
  e.step(1/60);if(Math.hypot(e.x-(corner[0]?776:24),e.y-(corner[1]?576:24))>200)far++;
  assert(e.x>=24&&e.x<=776&&e.y>=24&&e.y<=576,'Water bounds');
  for(const l of s.visible){const q=e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2),dx=l.x-e.x,dy=l.y-e.y,forward=dx*Math.cos(e.heading)+dy*Math.sin(e.heading),lateral=-dx*Math.sin(e.heading)+dy*Math.cos(e.heading);const mouth=forward>=0&&forward<50&&Math.abs(lateral)<4;assert(q.clearance>=-.15||mouth,`Solid fish except narrow mouth ${q.clearance} step${i} id${l.id} state${l.state} xy${l.x},${l.y} forward${forward} lateral${lateral}`);}
  for(let a=0;a<s.visible.length;a++)for(let b=a+1;b<s.visible.length;b++){const x=s.visible[a],y=s.visible[b];if(x.state==='home'&&y.state==='home')continue;const p=penetration(glyphBox(x),glyphBox(y));assert(!p||p.depth<.15,`Glyph penetration ${p?.depth} step ${i} ids ${x.id}/${y.id} size ${x.size}/${y.size} states ${x.state}/${y.state} at ${x.x},${x.y} / ${y.x},${y.y}`);}
 }
 const small=e.letters.filter(l=>l.eaten&&l.size<28).length,big=e.letters.filter(l=>l.eaten&&l.size>=28).length;
 assert(small>=1,`Small letters catchable ${corner}: ${small}`);assert(big<4,'Most large letters survive');assert(far>1000,'No corner trap');
 console.log(`Corner ${corner}: ${small} small/${big} large caught; ${e.failedChases||0} failed chases; solids pass`);
}
