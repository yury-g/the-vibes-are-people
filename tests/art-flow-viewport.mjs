import assert from 'node:assert/strict';
import {resolveSchool,glyphBox,penetration} from '../dist/iterations/tank/solid.js';
import {ArtFlowSchool} from '../dist/iterations/art-flow/school.js';
globalThis.scrollY=0;
const glyph=(x,y,extra={})=>({x,y,hx:x,hy:y,vx:0,vy:0,width:22,height:30,size:26,angle:.18,wing:1,state:'fleeing',visible:true,el:{classList:{add(){},remove(){}}},...extra});
const circle=(x,y,r)=>({bounds:{left:x-r,right:x+r,top:y-r,bottom:y+r},query(px,py,lr=0){const dx=px-x,dy=py-y,d=Math.hypot(dx,dy);return{clearance:d-r-lr,nx:dx/(d||1),ny:dy/(d||1)};},project(px,py,lr=0){const q=this.query(px,py,lr),push=Math.max(0,.2-q.clearance);return{x:px+q.nx*push,y:py+q.ny*push,...this.query(px+q.nx*push,py+q.ny*push,lr)};}});
const fish=circle(43,200,28),l=glyph(24,200),e={w:390,h:844,time:1,skin:fish,solidSkin:fish},s={engine:e,visible:[l]};
resolveSchool(s,new Map([[l,{x:l.x,y:l.y}]]),1/60);
assert(glyphBox(l).left<0,'regression genuinely reproduces inherited fish projection beyond left edge');
// The additive hook must repair the final inherited solver result.
ArtFlowSchool.prototype.keepInViewport?.call(s);
assert(glyphBox(l).left>=0,'moving ink remains inside left edge after contact resolution');
assert(fish.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2).clearance>=0,'edge repair cannot push through fish');
console.log('Inherited viewport regression repaired.');
const empty={query(){return{clearance:Infinity,nx:0,ny:0};}},inside=(l,w,h,top=0)=>{const b=glyphBox(l);assert(b.left>=-.001&&b.right<=w+.001&&b.top>=top-.001&&b.bottom<=top+h+.001,'whole rotated ink and fin silhouette inside viewport');};
for(const [w,h] of [[320,640],[390,844],[1280,720]])for(const edge of ['left','right','top','bottom']){
 const victim=glyph(edge==='left'?-8:edge==='right'?w+8:w/2,edge==='top'?-8:edge==='bottom'?h+8:h/2,{angle:-.215,ink:{left:-20,right:10,top:-33,bottom:8}});
 const box=glyphBox(victim),clampX=Math.max(victim.x-box.left,Math.min(w-(box.right-victim.x),victim.x)),clampY=Math.max(victim.y-box.top,Math.min(h-(box.bottom-victim.y),victim.y));
 const home=glyph(clampX,clampY,{state:'home',wing:0,angle:0}),homeBefore=JSON.stringify(home);
 const school={engine:{w,h,skin:empty},visible:[victim,home]};ArtFlowSchool.prototype.keepInViewport.call(school);
 inside(victim,w,h);assert(!penetration(glyphBox(victim),glyphBox(home)),'correction avoids peer occupying the naive clamped position');assert.equal(JSON.stringify(home),homeBefore,'fixed home glyph never moves');assert.equal(school.viewportContacts.unresolved,0);
}
// Exempt eaten and locked/native type; in-bounds captures/returns are unchanged.
const safe=glyph(150,200,{state:'returning',vx:-45,vy:22}),eaten=glyph(-15,200,{eaten:true}),locked=glyph(-20,210,{locked:true}),home=glyph(-10,200,{state:'home'}),before=JSON.stringify([safe,eaten,locked,home]);
ArtFlowSchool.prototype.keepInViewport.call({engine:{w:390,h:844,skin:empty},visible:[safe,eaten,locked,home]});assert.equal(JSON.stringify([safe,eaten,locked,home]),before,'safe return and native/capture positions are untouched');
// Scroll coordinates, a peer and fish sharing the nearest inward placement.
globalThis.scrollY=900;
const fish2=circle(43,1100,28),victim=glyph(-8,1100,{angle:.2}),peer=glyph(24,1152,{state:'home'}),scrollSchool={engine:{w:390,h:844,skin:fish2,solidSkin:fish2},visible:[victim,peer]};
ArtFlowSchool.prototype.keepInViewport.call(scrollSchool);inside(victim,390,844,900);assert(fish2.query(victim.x,victim.y,Math.hypot(victim.width,victim.height)/2+2).clearance>=0);assert(!penetration(glyphBox(victim),glyphBox(peer)));assert.equal(scrollSchool.viewportContacts.unresolved,0);
console.log('All four edges × three viewports, rotated ink/fins, fish+peer constraints, scroll, fixed homes, locked/eaten and safe return tests passed.');
