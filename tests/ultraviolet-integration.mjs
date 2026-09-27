import assert from 'node:assert/strict';
const {UltravioletKoi}=await import(`../dist/iterations/${process.env.KOI_STUDY||'ultraviolet-best'}/koi.js`);
const {UltravioletSchool}=await import(`../dist/iterations/${process.env.KOI_STUDY||'ultraviolet-best'}/school.js`);
const {buildSkin}=await import(`../dist/iterations/${process.env.KOI_STUDY||'ultraviolet-best'}/skin.js`);
import {SpatialSchool} from '../dist/iterations/brain/school.js';
import {glyphBox,penetration} from '../dist/iterations/tank/solid.js';
import {fish,glyph} from './size-hunt.mjs';
function uv(){const e=fish();Object.setPrototypeOf(e,UltravioletKoi.prototype);e.articulate(0);return e;}
// Trace actual rendered paths, including curved membranes, bone strokes, eyes,
// pelvic fins and the moving tail, then query the collision envelope.
function tracer(){let m=[1,0,0,1,0,0],stack=[],last=[0,0];const points=[];const point=(x,y)=>points.push({x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]});return {points,save(){stack.push([...m]);},restore(){m=stack.pop();},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},scale(x,y){m[0]*=x;m[1]*=x;m[2]*=y;m[3]*=y;},rotate(a){const c=Math.cos(a),s=Math.sin(a),[aa,b,cc,d]=m;m[0]=aa*c+cc*s;m[1]=b*c+d*s;m[2]=cc*c-aa*s;m[3]=d*c-b*s;},beginPath(){},closePath(){},fill(){},stroke(){},clip(){},moveTo(x,y){last=[x,y];point(x,y);},lineTo(x,y){this.moveTo(x,y);},quadraticCurveTo(a,b,x,y){const [ox,oy]=last;for(let i=0;i<=20;i++){const t=i/20,u=1-t;point(u*u*ox+2*u*t*a+t*t*x,u*u*oy+2*u*t*b+t*t*y);}last=[x,y];},bezierCurveTo(a,b,c,d,x,y){const [ox,oy]=last;for(let i=0;i<=20;i++){const t=i/20,u=1-t;point(u**3*ox+3*u*u*t*a+3*u*t*t*c+t**3*x,u**3*oy+3*u*u*t*b+3*u*t*t*d+t**3*y);}last=[x,y];},ellipse(x,y,rx,ry,a){for(let i=0;i<40;i++){const t=i*Math.PI/20,dx=Math.cos(t)*rx,dy=Math.sin(t)*ry;point(x+Math.cos(a)*dx-Math.sin(a)*dy,y+Math.sin(a)*dx+Math.cos(a)*dy);}},arc(x,y,r){this.ellipse(x,y,r,r,0);},fillText(){}};}
let maxOutside=-Infinity;
for(const width of [1280,390]){const f=uv();f.w=width;f.articulate(0);f.eyes=[{side:-1,gaze:{x:1.65,y:1.05}},{side:1,gaze:{x:-1.65,y:-1.05}}];
for(let i=0;i<360;i++){f.target={x:250,y:100};f.requestedSpeed=108;f.steer(1/60);f.articulate(1/60);if(i%5)continue;const c=tracer();f.drawFish(c);const skin=buildSkin(f);for(const p of c.points)maxOutside=Math.max(maxOutside,skin.query(p.x,p.y).clearance);}
}
assert(maxOutside<=.1,`Every drawn path enclosed: ${maxOutside}`);
const e=uv();e.letters=Array.from({length:24},(_,i)=>glyph(i+1,120+(i%6)*75,100+Math.floor(i/6)*65,i%7===0?36:14));const s=Object.create(UltravioletSchool.prototype);Object.assign(s,{engine:e,visible:e.letters,hash:new SpatialSchool()});e.school=s;
let returns=0;
for(let i=0;i<2400;i++){e.step(1/60);for(const l of s.visible){const dx=l.x-e.x,dy=l.y-e.y,c=Math.cos(e.heading),sn=Math.sin(e.heading),lane=dx*c+dy*sn>=0&&dx*c+dy*sn<50&&Math.abs(-dx*sn+dy*c)<4;assert(e.skin.query(l.x,l.y,Math.hypot(l.width,l.height)/2+2).clearance>=-.15||lane,'letter clears full UV skin');if(l.state==='returning')returns++;}for(let a=0;a<s.visible.length;a++)for(let b=a+1;b<s.visible.length;b++){const x=s.visible[a],y=s.visible[b];if(x.state==='home'&&y.state==='home')continue;const p=penetration(glyphBox(x),glyphBox(y));assert(!p||p.depth<.15,'flat letters remain solid');}}
assert(returns>0);const mouth=uv();mouth.letters=[glyph(1,302,300)];mouth.capture();assert.equal(mouth.eaten,1);assert.equal(mouth.captureEffects.length,1);mouth.capture();assert.equal(mouth.eaten,1);const side=uv();side.letters=[glyph(2,295,300)];side.capture();assert(!side.eaten);
console.log({maxOutside,returns,caught:e.eaten||0,escaped:e.failedChases||0});console.log('UV rendered silhouette, actual school, planar collisions, returns, mouth-only captures pass.');
// Actual inherited pause pathway with the app's reduced-motion preference binder.
const {bindMotionPreference}=await import('../dist/iterations/brain/motion.js');
let scheduled=0,preferenceChange;
globalThis.requestAnimationFrame=()=>++scheduled;globalThis.cancelAnimationFrame=()=>{};
globalThis.document={hidden:false,body:{classList:{toggle(){}}}};
const reduced=uv();Object.assign(reduced,{visible:true,raf:0,measure(){},draw(){},onFrame(){},updateDiagnostics(){}});
bindMotionPreference({matches:true,addEventListener(_,fn){preferenceChange=fn;}},v=>reduced.setPaused(v));
assert(reduced.paused);assert.equal(reduced.time,0);assert.equal(reduced.steps,0);assert.equal(scheduled,0,'reduced motion never starts the loop');
preferenceChange({matches:false});assert.equal(scheduled,1);preferenceChange({matches:true});assert(reduced.paused);assert.equal(reduced.raf,0);
console.log('Initial and runtime reduced motion use the actual frozen simulation pathway.');
