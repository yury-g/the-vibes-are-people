import test from 'node:test';
import assert from 'node:assert/strict';
import * as prey from '../dist/iterations/hunting-tank/prey.js';
import {nibble,grazeLetter} from '../dist/iterations/hunting-tank/nibbles.js';
import {stepLetters} from '../dist/iterations/hunting-tank/physics.js';
import {targetHunters} from '../dist/iterations/hunting-tank/hunt.js';
const glyph=()=>({group:'name',x:300,y:200,hx:300,hy:200,vx:0,vy:0,width:24,height:40,glyphWidth:20,inkHeight:30,maskWidth:24,maskHeight:40,inkPixels:[{x:12,y:20}],bites:[]});
test('only the first five name glyphs survive, even after layout rebuild',()=>{
 const ls=[...'YuryGitman'].map(ch=>({...glyph(),ch}));ls.push({...glyph(),group:'science',ch:'Y'});
 prey.markNameSurvivors(ls);assert.equal(ls.filter(l=>l.uncatchable).map(l=>l.ch).join(''),'YuryG');
 prey.markNameSurvivors(ls);assert.equal(ls.filter(l=>l.uncatchable).length,5);
});
test('protected name cannot be bitten or grazed even at direct contact',()=>{
 const l={...glyph(),uncatchable:true},f={x:300,y:200,heading:0};
 assert.equal(nibble(f,l,10),null);assert.equal(l.bites.length,0);assert.ok(!l.sinking);
 l.settled=true;assert.equal(grazeLetter(l,20,null),false);assert.ok(!l.eaten);
 assert.ok(nibble({...f},{...glyph()},10),'ordinary letters remain edible');
});
test('protected name reacts earlier, accelerates faster, and respects focus',()=>{
 const run=(uncatchable,d)=>{const l={...glyph(),uncatchable};for(let i=0;i<30;i++)stepLetters([l],1/120,{width:800,height:600,time:i/120,hunters:[{x:300-d,y:200,heading:0,prey:l}]});return l;};
 assert.ok(run(true,150).x>run(false,150).x+5);
 assert.ok(run(true,70).vx>run(false,70).vx+40);
 const l={...glyph(),uncatchable:true,pinned:true};stepLetters([l],1/60,{width:800,height:600,hunters:[{x:290,y:200}]});assert.equal(l.x,300);assert.equal(l.vx,0);
});
test('survivors do not monopolize hunting while bitten edible letters remain',()=>{
 const survivor={...glyph(),uncatchable:true},food={...glyph(),x:330,bites:[{x:0,y:0,r:1}]},f={id:2,x:250,y:200,w:800,h:600,heading:0};
 targetHunters([f],[survivor,food],[],0);assert.equal(f.prey,food);
 food.eaten=true;targetHunters([f],[survivor,food],[],1);assert.equal(f.prey,survivor);
});
