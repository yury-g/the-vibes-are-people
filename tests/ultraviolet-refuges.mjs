import assert from 'node:assert/strict';
import {articulate,swim} from '../dist/iterations/ultraviolet-best/body.js';
import {setRefuges,refugeSegments,refugeWallSkin,refugeLetterRoute,actualRefugeClearance,placeAfterRefugeLayout} from '../dist/iterations/ultraviolet-best/refuges.js';
import {buildSkin} from '../dist/iterations/ultraviolet-best/skin.js';
import {MAX_TURN} from '../dist/iterations/ultraviolet-best/turns.js';
import {preyScore} from '../dist/iterations/ultraviolet-best/appetite.js';
const blank={bounds:{left:0,right:1,top:0,bottom:1},query:()=>({clearance:Infinity,nx:0,ny:0})};
const r={left:100,right:300,top:100,bottom:300,slotGap:24},e={};setRefuges(e,[r]);assert.equal(refugeSegments([r]).length,8);const wall=refugeWallSkin(e,blank);
assert(wall.query(200,100,8).clearance>0,'small circle fits visible top slot');assert(wall.query(200,100,14).clearance<0,'large circle cannot fit slot');assert(wall.query(150,100,2).clearance<0,'solid side stops letters');assert(refugeLetterRoute(e,{x:200,y:85,hx:200,hy:150,width:8,height:10,size:10}).y>0);
for(const [w,h,rect,start] of [[1600,1200,{left:750,right:1000,top:450,bottom:650},[380,600]],[1280,900,{left:750,right:1100,top:260,bottom:630},[380,450]],[390,844,{left:230,right:365,top:420,bottom:700},[170,180]],[390,844,{left:145,right:367,top:650,bottom:1600},[200,1050]]]){
 const f={w,h,x:start[0],y:start[1],heading:0,speed:56,requestedSpeed:108,vx:56,vy:0,phase:0,time:0,navBounds:{left:45,right:w-45,top:start[1]>h?745:45,bottom:(start[1]>h?700:0)+h-45}};articulate(f,0);setRefuges(f,[rect]);let min=Infinity,maxTurn=0,above=false,below=false;
 for(let i=0;i<7200;i++){f.target={x:i%1800<900?w-70:70,y:(start[1]>h?700:0)+(i%3600<1800?h-100:100)};const x=f.x,y=f.y,yaw=f.yaw||0;swim(f,1/60);articulate(f,1/60);f.time+=1/60;const box=buildSkin(f).bounds;const d=Math.min(actualRefugeClearance(f),box.left,w-box.right,box.top-(f.navBounds.top-45),f.navBounds.bottom+45-box.bottom);min=Math.min(min,d);maxTurn=Math.max(maxTurn,f.turnLedger.used);assert(d>=0,JSON.stringify({w,i,d,x:f.x,y:f.y,ledger:f.turnLedger}));assert(Math.abs(f.yaw-yaw)<=3/60+1e-8);if(i>0)assert(Math.hypot(f.x-x,f.y-y)<=Math.max(f.speed,108)/60+1e-6);assert(f.turnLedger.used<=MAX_TURN+1e-8);above||=f.y<rect.top;below||=f.y>rect.bottom;}
 assert.equal(f.refugeContacts||0,0,'ordinary navigation needs no contact holds');if(w===1600)assert(above&&below,'desktop routes above and below the module');console.log({w,min,maxTurns:maxTurn/(2*Math.PI),above,below,contacts:f.refugeContacts||0});
 const prey={x:(rect.left+rect.right)/2,y:(rect.top+rect.bottom)/2,visible:true,size:20};assert.equal(preyScore(f,prey),Infinity);
}
console.log('Slotted wall letter fit, full koi obstacle envelope and sustained turn-budget motion pass.');
// Exercise the real synchronized letter solver and a peer at the doorway.
const {UltravioletKoi}=await import('../dist/iterations/ultraviolet-best/koi.js');
const {UltravioletSchool}=await import('../dist/iterations/ultraviolet-best/school.js');
const {SpatialSchool}=await import('../dist/iterations/brain/school.js');
const {fish,glyph}=await import('./size-hunt.mjs');
const f=fish();Object.setPrototypeOf(f,UltravioletKoi.prototype);f.w=800;f.h=600;f.x=600;f.y=480;f.articulate(0);setRefuges(f,[r]);const small=glyph(101,200,125,12),large=glyph(102,250,125,30),peer=glyph(103,212,70,12);for(const l of [small,large]){l.hy=65;l.state='returning';}f.letters=[small,large,peer];const school=Object.create(UltravioletSchool.prototype);Object.assign(school,{engine:f,visible:f.letters,hash:new SpatialSchool()});f.school=school;
for(let i=0;i<900;i++){f.time+=1/60;f.updateMinnows(1/60);}
assert(small.y<100,'small actual glyph traverses doorway');assert(large.y>100,'large glyph remains inside');console.log({smallY:small.y,largeY:large.y});

// A deliberately unsteerable next step is held, never clipped into a module.
const guard={w:800,h:600,x:260,y:200,heading:0,speed:600,requestedSpeed:108,vx:600,vy:0,phase:0,navBounds:{left:45,right:755,top:45,bottom:555}};articulate(guard,0);setRefuges(guard,[{left:280,right:600,top:100,bottom:400}]);guard.refugeLayoutChanged=false;const old={x:guard.x,y:guard.y,phase:guard.phase,body:JSON.stringify(guard.body)};swim(guard,1/60);articulate(guard,1/60);assert(guard.refugeContacts>0);assert(actualRefugeClearance(guard)>=0);assert.equal(guard.turnLedger,undefined);assert.equal(guard.x,old.x);assert.equal(guard.y,old.y);assert.equal(guard.phase,old.phase);assert.equal(JSON.stringify(guard.body),old.body);
