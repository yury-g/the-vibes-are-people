import test from 'node:test';import assert from 'node:assert/strict';
import {feedingPoint,nibble} from '../dist/iterations/hunting-tank/nibbles.js';
import {letterFishContact} from '../dist/iterations/hunting-tank/solid.js';
import {FeedingShrimp} from '../dist/iterations/hunting-tank/feeding.js';
import {makeFish} from '../dist/iterations/shared-pond/world.js';
test('large unbitten letters are aimed at ink, and a visible gap cannot be bitten',()=>{const l={group:'name',x:120,y:100,width:60,height:60,maskWidth:60,maskHeight:60,inkHeight:40,inkPixels:[{x:50,y:30}],bites:[]};assert.equal(feedingPoint(l,{x:100,y:100,time:0}).x,140);assert.equal(nibble({x:132,y:100,heading:0},l,1),null);assert.ok(nibble({x:137,y:100,heading:0},l,1));});
test('hunter can enter transparent letter bounds but cannot enter its ink',()=>{
 const skin={bounds:{left:90,right:110,top:90,bottom:110},query(x,y,r=0){const d=Math.hypot(x-100,y-100)||1;return{clearance:d-10-r,nx:(x-100)/d,ny:(y-100)/d};}};
 const l={x:120,y:100,width:60,height:60,glyphWidth:60,inkHeight:60,maskWidth:60,maskHeight:60,inkPixels:[{x:50,y:30}],bites:[]};const f={prey:l,solidSkin:skin,envelope:[{x:90,y:90},{x:110,y:90},{x:110,y:110},{x:90,y:110}]};
 assert.equal(letterFishContact(l,f),null);l.inkPixels=[{x:17,y:30}];assert.ok(letterFishContact(l,f)?.depth>0);
});
test('touching actual fish tail triggers the same shrimp leap and cooldown',()=>{
 const w=new FeedingShrimp(800,700),f=makeFish(2,800,700),s=w.shrimp[0];
 const tail=f.body.at(-1);Object.assign(s,{x:tail.x,y:tail.y,patch:null,state:'feeding',cooldown:0});w.time=1;
 assert.ok(Math.hypot(s.x-f.x,s.y-f.y)>42,'tail is outside head detection');w.step(1/120,[f],[]);assert.equal(s.state,'escape');assert.ok(s.to&&s.from);const from=s.from;w.step(1/120,[f],[]);assert.equal(s.from,from,'contact does not restart the leap');
});
