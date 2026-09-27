import assert from 'node:assert/strict';
import {navigate} from '../dist/iterations/brain/navigation.js';
globalThis.scrollY=0;
for(const [x,y] of [[25,25],[775,25],[25,575],[775,575],[400,25],[25,300],[775,300],[400,575]]){
 const e={x:x<400?90:710,y:y<300?90:510,vx:0,vy:56,heading:Math.PI/2,speed:56,phase:0,mode:'hunt',target:{x,y},requestedSpeed:56,navBounds:{left:24,right:776,top:24,bottom:576}};let closest=1e9,turns=0,old=e.heading;
 for(let i=0;i<720;i++){navigate(e,1/60);closest=Math.min(closest,Math.hypot(e.x-x,e.y-y));turns+=Math.abs(Math.atan2(Math.sin(e.heading-old),Math.cos(e.heading-old)));old=e.heading;assert(e.x>=24&&e.x<=776&&e.y>=24&&e.y<=576);}
 assert(closest<8,`Must reach edge target ${x},${y}: ${closest}`);assert(turns<Math.PI*3,`Must not orbit: ${turns}`);
}
console.log('Four corners and four edges: converge within8px without repeated orbits');
