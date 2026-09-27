import test from 'node:test';
import assert from 'node:assert/strict';
import {stepLetters,separateLetters} from '../dist/iterations/inflated-tank/physics.js';
import {makeFish,separateFish} from '../dist/iterations/shared-pond/world.js';
import {targetHunters,swimHunter,avoidSchool} from '../dist/iterations/hunting-tank/hunt.js';
test('inflated name stays separated and in the tank under actual koi pursuit',()=>{
 for(const [width,height]of [[1000,700],[390,844]]){
 const letters=[...'YuryGitman'].map((ch,i)=>({ch,group:'name',uncatchable:i<5,x:40+i%5*(width-80)/5,y:180+Math.floor(i/5)*85,hx:40+i%5*(width-80)/5,hy:180+Math.floor(i/5)*85,width:width<500?39:70,height:width<500?58:95,glyphWidth:30,inkHeight:40,vx:0,vy:0}));
 const fishes=[2,3,4].map(id=>makeFish(id,width,height));
 for(let i=0;i<900;i++){const time=i/120;targetHunters(fishes,letters,[],time);avoidSchool(fishes,1/120);for(const f of fishes)swimHunter(f,1/120);separateFish(fishes);stepLetters(letters,1/120,{width,height,time,hunters:fishes});
 for(const a of letters){assert.ok(Number.isFinite(a.x+a.y));assert.ok(a.x>=8+a.width/2-.05&&a.x<=width-8-a.width/2+.05);}
 for(let a=0;a<letters.length;a++)for(let b=a+1;b<letters.length;b++)assert.ok(Math.abs(letters[a].x-letters[b].x)>=(letters[a].width+letters[b].width)/2-.05||Math.abs(letters[a].y-letters[b].y)>=(letters[a].height+letters[b].height)/2-.05);
 }
 }
});
test('larger inflated letters resist contact more than smaller ones',()=>{const a={x:100,y:100,width:60,height:60,vx:0,vy:0},b={x:135,y:100,width:30,height:30,vx:0,vy:0};separateLetters([a,b],600,500);assert.ok(100-a.x<b.x-135);});
test('Yury G regroups faster than the remaining name and service letters',()=>{
 const run=(group,uncatchable)=>{const l={group,uncatchable,x:480,y:330,hx:350,hy:250,vx:0,vy:0,width:35,height:48,glyphWidth:25,inkHeight:32};for(let i=0;i<120;i++)stepLetters([l],1/120,{width:1000,height:700,time:i/120});return Math.hypot(l.x-l.hx,l.y-l.hy);};
 const protectedDistance=run('name',true);
 assert.ok(protectedDistance<run('name',false)*.6);
 assert.ok(protectedDistance<run('hardware',false));
});
test('Yury G reforms readable order after scattering without overlapping',()=>{
 const letters=[...'YuryG'].map((ch,i)=>({ch,group:'name',uncatchable:true,x:180+i*70+(i%2?45:-35),y:250+(i%2?65:-55),hx:180+i*70,hy:250,vx:0,vy:0,width:40,height:55,glyphWidth:30,inkHeight:40}));
 for(let i=0;i<360;i++)stepLetters(letters,1/120,{width:1000,height:700,time:i/120});
 for(let i=0;i<letters.length;i++){const l=letters[i];assert.ok(Math.hypot(l.x-l.hx,l.y-l.hy)<3);if(i)assert.ok(l.x-letters[i-1].x>=41);}
});
