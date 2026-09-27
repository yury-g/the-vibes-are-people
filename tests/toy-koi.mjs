import assert from 'node:assert/strict';
import {Koi} from '../dist/iterations/toy-koi/koi.js';
assert.equal(typeof Koi.prototype.drawWake,'function','Toy koi exposes its movement-driven wake renderer.');
import {Plumage} from '../dist/iterations/toy-koi/plumage.js';
const e={body:Array.from({length:15},(_,i)=>({x:200-i*6.4,y:200,a:0})),phase:0,time:0,speed:56,turn:0};
const p=new Plumage();p.update(0,e);assert.equal(p.parts[0].root,e.body.at(-1),'Tail stays on actual last vertebra.');
const initial=p.angles[0];e.body.forEach(b=>b.a+=1);e.turn=.03;e.phase=.1;e.time=1/60;p.update(1/60,e);
assert(Math.abs(p.angles[0]-initial)<.1,'Tail angle lags a sudden body turn.');
assert(Math.abs(p.bend)>0,'Turn produces membrane bend.');
for(let i=0;i<360;i++){e.time+=1/60;e.phase+=.1;e.turn=0;p.update(1/60,e);}
assert(Math.abs(p.bend)<.001,'Drag settles after a turn.');assert(p.wake.length<=48&&p.wake.length>0,'Actual motion wake is bounded.');
for(const part of p.parts)for(const ray of part.rays){const b=p.bounds(e,part.kind);for(const point of [ray.root,ray.c1,ray.c2,ray.tip])assert(point.x>=b.left&&point.x<=b.right&&point.y>=b.top&&point.y<=b.bottom,'Camera bounds include every membrane control point.');}
const before=JSON.stringify(p);const c=new Proxy({},{set(t,k,v){t[k]=v;return true;},get(t,k){return t[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a));});}});p.draw(c);p.drawWake(c,e.time);assert.equal(JSON.stringify(p),before,'Camera rendering never advances fin or wake state.');
console.log('Passed: attachment, inertial lag/recovery, bounded motion wake, full camera bounds, read-only rendering.');
