import assert from 'node:assert/strict';
import {chooseBehavior} from '../dist/iterations/crayfish/koi.js';
assert.equal(chooseBehavior({threat:.6,tapActive:true,hasPrey:true}),'evade','A real nearby threat takes priority over tapping and prey.');
assert.equal(chooseBehavior({threat:0,tapActive:false,hasPrey:true}),'hunt','Calm koi resumes hunting.');
console.log('Passed: threat priority and normal recovery.');
import {Crayfish,snapPose} from '../dist/iterations/crayfish/crayfish.js';
import {Koi} from '../dist/iterations/crayfish/koi.js';
import {LetterSchool,SpatialSchool} from '../dist/iterations/crayfish/school.js';
globalThis.scrollY=0;
const c=new Crayfish(0,0);Object.assign(c,snapPose(4));const wind=c.threatAt(90,0);Object.assign(c,snapPose(4.46));assert(c.open<.1&&c.snap>.99);assert(c.threatAt(90,0)>wind,'Visible claw closure expands actual threat.');assert.equal(c.threatAt(300,0),0,'Far actors are not frightened.');
const e=Object.create(Koi.prototype),school=Object.create(LetterSchool.prototype);
const glyph=(x,y)=>({ch:'a',x,y,hx:x,hy:y,vx:0,vy:0,size:20,width:12,height:24,visible:true,state:'home',personal:1,phase:.4,frequency:8,wing:0,angle:0,cooldown:0,scares:0,el:{classList:{add(){},remove(){}}}});
const letters=Array.from({length:60},(_,i)=>glyph(60+i%15*22,140+Math.floor(i/15)*40));
Object.assign(e,{x:350,y:350,vx:-56,vy:0,heading:Math.PI,w:600,h:500,right:600,bottom:480,allType:true,letters,school,time:0,steps:0,mode:'wander',tap:{until:0},transitions:[],spine:Array.from({length:15},(_,i)=>({x:350+i*6.4,y:350})),phase:0,fear:0,evades:0,crayLetters:0,crayfish:new Crayfish(245,375)});
Object.assign(school,{engine:e,hash:new SpatialSchool(),pointer:{x:-1000,y:-1000,until:0},visible:letters});
let frightened=0,calm=0,maxFear=0;
for(let i=0;i<7200;i++){e.step(1/60);maxFear=Math.max(maxFear,e.fear);if(e.crayLetters>0)frightened++;if(e.mode==='hunt')calm++;assert(Number.isFinite(e.x)&&Number.isFinite(e.y));assert(e.x>=20&&e.x<=580);assert(e.crayfish.x>=40&&e.crayfish.x<=560);assert(e.crayfish.y>=45&&e.crayfish.y<=455);}
assert(e.evades>=3,`Expected repeat encounters, got ${e.evades}`);assert(frightened>60,'Letters genuinely react to crayfish reach.');assert(calm>3600,'Koi returns to hunting for most of the run.');
console.log({evades:e.evades,snaps:e.crayfish.snaps,calmPercent:Math.round(calm/72),letterThreatSeconds:(frightened/60).toFixed(1),maxFear:maxFear.toFixed(2)});
// Isolate letters from the fish: crayfish alone makes a letter flee away.
Object.assign(e,{x:1000,y:1000,crayfish:new Crayfish(100,100)});Object.assign(e.crayfish,snapPose(4.46));const l=glyph(120,100);school.visible=[l];school.update(1/60);assert.equal(l.state,'fleeing');assert(l.vx>0);
e.crayfish.x=e.crayfish.y=1000;
for(let i=0;i<420;i++)school.update(1/60);
assert.equal(l.state,'home','Letter recovers when the real threat leaves.');
console.log('Passed: repeated bounded encounters, calm intervals, independent letter fear and recovery.');
