import assert from 'node:assert/strict';
import {UltravioletKoi} from '../dist/iterations/ultraviolet-best/koi.js';
import {fish,glyph} from './size-hunt.mjs';
const e=fish();Object.setPrototypeOf(e,UltravioletKoi.prototype);e.w=1280;e.h=720;e.x=900;e.y=400;e.heading=Math.PI;e.articulate(0);
const big=glyph(1,300,200,108),small=glyph(2,810,380,16);e.letters=[big,small];
e.selectTarget();assert.equal(e.prey,big,'Visible large name letters should outweigh nearby small text, beyond old400px range');
const episode={spent:5,best:300,progressAt:0,rested:false};e.time=10;e.fail(big,episode,'no closing progress');assert(e.smallUntil<=14,'Recovery must be brief, not24seconds');
e.time=10.1;e.selectTarget();assert.equal(e.prey,small,'A failed big chase permits a small recovery hunt');
e.time=16;e.selectTarget();assert.equal(e.prey,big,'Large appetite returns after bounded recovery and target rest');
const scores=[16,40,108].map(size=>e.attentionScore(glyph(size,400,300,size)));assert(scores[0]>scores[1]&&scores[1]>scores[2],'Real rendered size remains proportionally attractive');
console.log('Large visible prey, brief failure recovery and renewed big appetite pass.');
// A second failed large target cannot keep extending the recovery window.
e.time=22;e.fail(glyph(7,400,300,80),{spent:5},'stalled');const until=e.smallUntil;e.time=23;e.fail(glyph(8,400,300,90),{spent:5},'stalled');assert.equal(e.smallUntil,until);
// Actual side visibility still applies even to the largest visible letter.
const {sensed}=await import('../dist/iterations/ultraviolet-best/eyes.js');e.heading=0;e.angles=null;e.articulate(0);const left={side:-1};assert.equal(sensed(e,left,glyph(9,e.x+30,e.y+200,110)),null,'cannot see through opposite cheek');
// A real stationary chase cannot consume an unlimited per-target budget.
const stuck=fish();Object.setPrototypeOf(stuck,UltravioletKoi.prototype);stuck.articulate(0);const large=glyph(20,450,270,64),little=glyph(21,440,340,16);stuck.letters=[large,little];let bigTime=0,smallTime=0,retries=0,wasBig=false;
for(let i=0;i<2400;i++){stuck.time+=1/60;stuck.selectTarget();const big=stuck.prey===large;if(big){bigTime+=1/60;if(!wasBig)retries++;}if(stuck.prey===little)smallTime+=1/60;wasBig=big;}
assert(stuck.failedChases>1&&smallTime>0&&retries>1);assert(bigTime>smallTime,'Brief recovery must not dominate the whole observation');console.log({bigTime,smallTime,retries,failed:stuck.failedChases});
