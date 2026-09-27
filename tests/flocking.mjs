import assert from 'node:assert/strict';
import {SpatialSchool,LetterSchool} from '../dist/iterations/school.js';
import {bindMotionPreference} from '../dist/iterations/motion.js';
const glyph=(x,y,extra={})=>({x,y,hx:x,hy:y,vx:0,vy:0,size:20,width:12,height:24,visible:true,state:'fleeing',personal:1,phase:.4,frequency:8,wing:0,angle:0,cooldown:0,scares:0,el:{classList:{add(){},remove(){}}},...extra});
const grid=new SpatialSchool();const a=glyph(100,100),near=glyph(103,100);grid.build([a,near]);assert(grid.forces(a).x<0,'Separation moves close neighbours apart.');
const far=glyph(160,100,{vx:70});grid.build([a,far]);assert(grid.forces(a).x>0,'Cohesion/alignment follow nearby school motion.');
const dense=Array.from({length:3000},(_,i)=>glyph(100+i%60,100+Math.floor(i/60)));grid.build(dense);for(const l of dense)grid.forces(l);assert(grid.checks<=dense.length*64,'Neighbour cost stays bounded in a dense cluster.');
globalThis.scrollY=0;
const school=Object.create(LetterSchool.prototype);school.engine={x:950,y:700,w:1200,h:800,time:0};school.hash=new SpatialSchool();school.pointer={x:-1000,y:-1000,until:0};school.visible=[glyph(260,250,{hx:100,hy:100})];
for(let i=0;i<420;i++){school.engine.time+=1/60;school.update(1/60);}
assert.equal(school.visible[0].state,'home','A calm letter returns completely to native text.');assert.equal(school.visible[0].x,100);assert.equal(school.visible[0].y,100);
const calls=[],query={matches:true,addEventListener(type,cb){this.cb=cb;},removeEventListener(type,cb){assert.equal(cb,this.cb);this.cb=null;}};
const unbind=bindMotionPreference(query,v=>calls.push(v));assert.deepEqual(calls,[true],'Reduced motion pauses immediately, before animation starts.');query.cb({matches:false});query.cb({matches:true});assert.deepEqual(calls,[true,false,true]);unbind();assert.equal(query.cb,null);
console.log('Passed: local separation, cohesion/alignment, bounded dense-neighbour work, complete native-text return, initial and changed reduced-motion preferences.');
