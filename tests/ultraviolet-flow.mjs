import assert from 'node:assert/strict';
const {UltravioletKoi}=await import(`../dist/iterations/${process.env.KOI_STUDY||'ultraviolet-best'}/koi.js`);
const {UltravioletSchool}=await import(`../dist/iterations/${process.env.KOI_STUDY||'ultraviolet-best'}/school.js`);
import {SpatialSchool} from '../dist/iterations/brain/school.js';
import {fish,glyph} from './size-hunt.mjs';
for(const width of [1280,390,320]){
const scale=Math.min(1,width/600),e=fish();e.w=width;e.x=width/2;Object.setPrototypeOf(e,UltravioletKoi.prototype);e.articulate(0);e.speed=108*scale;e.vx=e.speed;e.letters=[glyph(1,e.x+2,300),glyph(2,e.x+90,370),glyph(3,e.x+115,390)];
for(const l of e.letters.slice(1)){l.state='fleeing';l.vx=35;l.vy=10;l.cooldown=2;l.frequency=8;}
const school=Object.create(UltravioletSchool.prototype);Object.assign(school,{engine:e,visible:e.letters,hash:new SpatialSchool(),needsMeasure:false});e.school=school;
const survivors=e.letters.slice(1),before=survivors.map(l=>({x:l.x,y:l.y,vx:l.vx,vy:l.vy}));e.capture();assert.equal(e.eaten,1);
assert.equal(school.needsMeasure,false,'A bite must not trigger a school-wide layout/reset');
for(let i=0;i<2;i++)for(const key of ['x','y','vx','vy'])assert.equal(survivors[i][key],before[i][key]);
let minSpeed=Infinity,moved=0,previous={x:e.x,y:e.y};
for(let i=0;i<85;i++){const old=survivors.map(l=>({x:l.x,y:l.y}));e.step(1/60);minSpeed=Math.min(minSpeed,e.speed);assert(Math.hypot(e.x-previous.x,e.y-previous.y)>.2,'Koi momentum continues through swallow');previous={x:e.x,y:e.y};if(i<30)assert(survivors.some((l,j)=>Math.hypot(l.x-old[j].x,l.y-old[j].y)>.01),'Other minnows remain independently moving');moved+=Math.hypot(e.vx,e.vy)/60;}
assert(minSpeed>=38*scale,'Swallow coasts instead of stopping');assert(moved>55*scale);console.log({width,minBiteSpeed:minSpeed,biteTravel:moved});
}
