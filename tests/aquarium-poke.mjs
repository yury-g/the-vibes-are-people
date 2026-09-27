import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFish} from '../dist/iterations/shared-pond/world.js';
import {pokeTank} from '../dist/iterations/hunting-tank/interactions.js';
import {targetHunters} from '../dist/iterations/hunting-tank/hunt.js';
test('a poked koi forgets food for one second, then can feed again',()=>{
 const f=makeFish(2,1000,800),food={x:f.x-20,y:f.y,hx:f.x-20,hy:f.y,width:20,height:30};
 const cleaners={shrimp:[]};pokeTank([f],cleaners,f.center.x,f.center.y,1,{fleeDuration:1,squirm:true});
 for(const t of [1.01,1.5,1.99]){targetHunters([f],[food],[],t);assert.equal(f.prey,null);assert.equal(f.mode,'flee');}
 targetHunters([f],[food],[],2.01);assert.equal(f.prey,food,'feeding becomes available after one second');
});
