import test from 'node:test';
import assert from 'node:assert/strict';
import {stepWorld,resolveContacts} from '../dist/iterations/inflated-name/physics.js';
const body=(x,y,w=40,h=60)=>({x,y,hx:x,hy:y,w,h,vx:0,vy:0,mass:w*h/2400,phase:x*.01,squash:0,squashV:0});
test('head-on collision separates letters and transfers momentum',()=>{const a=body(100,100),b=body(130,100);a.vx=80;b.vx=-40;resolveContacts([a,b],400,300);assert.ok(b.x-a.x>=40);assert.ok(a.vx<0&&b.vx>0);});
test('crowded buoyant letters stay separate and contained through interaction',()=>{
 const bodies=Array.from({length:10},(_,i)=>body(70+i%5*46,100+Math.floor(i/5)*80));
 for(let i=0;i<2400;i++){
  stepWorld(bodies,1/120,{width:320,height:420,time:i/120,pointer:i<600?{x:160+Math.sin(i*.02)*90,y:170}:null});
  for(const b of bodies){assert.ok(Number.isFinite(b.x+b.y+b.vx+b.vy));assert.ok(b.x>=b.w/2+8-.01&&b.x<=320-b.w/2-8+.01);assert.ok(b.y>=b.h/2+8-.01&&b.y<=420-b.h/2-8+.01);}
  for(let a=0;a<bodies.length;a++)for(let b=a+1;b<bodies.length;b++){const x=bodies[a],y=bodies[b];assert.ok(Math.abs(x.x-y.x)>=(x.w+y.w)/2-.01||Math.abs(x.y-y.y)>=(x.h+y.h)/2-.01);}
 }
});
test('zero elapsed time freezes positions and deformation',()=>{const b=body(100,100);b.vx=60;const before={...b};stepWorld([b],0,{width:500,height:400,time:1});assert.deepEqual(b,before);});
