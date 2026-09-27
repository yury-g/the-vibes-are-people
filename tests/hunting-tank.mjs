import test from 'node:test';
import assert from 'node:assert/strict';
const mod=await import('../dist/iterations/hunting-tank/hunt.js').catch(()=>({}));
const shrimp=await import('../dist/iterations/hunting-tank/cleaners.js').catch(()=>({}));
test('hunters pursue shrimp and letters, never held links',()=>{
 const f={id:2,x:200,y:200,w:800,h:600,heading:0};
 const l={x:300,y:200,vx:0,vy:0,pinned:true};const s={x:218,y:210,vx:0,vy:0};
 mod.targetHunters([f],[l],[s],0);assert.equal(f.prey,s);assert.ok(f.requestedSpeed>82);
 l.pinned=false;mod.targetHunters([f],[l],[],2);assert.equal(f.prey,l);
 l.pinned=true;mod.targetHunters([f],[l],[],3);assert.equal(f.prey,null);
});
test('edge shrimp graze, flee a nearby hunter, and return to glass',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0];for(let i=0;i<240;i++)w.update(1/120,[]);
 assert.ok(w.grazed>0);const start={x:s.x,y:s.y};
 w.update(1/120,[{x:s.x+12,y:s.y+12,vx:0,vy:0}]);assert.equal(s.state,'escape');
 for(let i=0;i<100;i++)w.update(1/120,[]);assert.ok(Math.hypot(s.x-start.x,s.y-start.y)>60);
 let landed=false;for(let i=0;i<3000;i++){w.update(1/120,[]);if(s.patch&&['feeding','perched'].includes(s.state)){landed=true;break;}}assert.ok(landed);
});
test('shrimp stay finite and inside the tank through pursuit and resize',()=>{
 const w=new shrimp.EdgeShrimp(1280,720);
 for(let i=0;i<3000;i++){if(i===1000)w.resize(320,568);w.update(1/60,[{x:w.w*(.5+.45*Math.sin(i*.02)),y:w.h*(.5+.45*Math.cos(i*.02)),vx:0,vy:0}]);for(const s of w.shrimp){assert.ok(Number.isFinite(s.x+s.y+s.angle));assert.ok(s.x>=15&&s.x<=w.w-15&&s.y>=15&&s.y<=w.h-15);}}
});
test('pursuit moves toward prey and preserves connected, contained fish',async()=>{
 const {makeFish,separateFish}=await import('../dist/iterations/shared-pond/world.js');
 for(const [w,h] of [[1280,720],[320,568],[568,320]]){
  const fish=[2,3,4].map(id=>makeFish(id,w,h)),cleaners=new shrimp.EdgeShrimp(w,h);
  const letters=[{x:w*.25,y:h*.3,vx:0,vy:0}];let close=Infinity;
  for(let i=0;i<4800;i++){cleaners.update(1/120,fish);mod.targetHunters(fish,letters,cleaners.shrimp,i/120);mod.avoidSchool(fish,1/120);for(const f of fish)mod.swimHunter(f,1/120);separateFish(fish);
   for(const f of fish){assert.ok(Number.isFinite(f.x+f.y+f.heading));const b=f.solidSkin.bounds;assert.ok(b.left>=5.9&&b.right<=w-5.9&&b.top>=5.9&&b.bottom<=h-5.9);for(let j=1;j<f.body.length;j++)assert.ok(Math.abs(Math.hypot(f.body[j].x-f.body[j-1].x,f.body[j].y-f.body[j-1].y)-f.segmentLength)<.001);if(f.huntKind==='letter')close=Math.min(close,Math.hypot(f.x-letters[0].x,f.y-letters[0].y));}
  }
  assert.ok(close<90,`hunters reach letters at ${w} x ${h}, nearest ${close}`);
 }
});
test('letters remain separate under stronger pursuit and held letters stay put',async()=>{
 const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const letters=Array.from({length:50},(_,i)=>({x:25+i%10*29,y:100+Math.floor(i/10)*45,hx:25+i%10*29,hy:100+Math.floor(i/10)*45,width:20,height:32,vx:0,vy:0,pinned:i===0}));
 for(let i=0;i<900;i++){stepLetters(letters,1/60,{width:320,height:568,time:i/60,hunters:[{x:160+100*Math.sin(i*.03),y:220+120*Math.cos(i*.03)}]});for(let a=0;a<letters.length;a++)for(let b=a+1;b<letters.length;b++)assert.ok(Math.abs(letters[a].x-letters[b].x)>=(letters[a].width+letters[b].width)/2-.01||Math.abs(letters[a].y-letters[b].y)>=(letters[a].height+letters[b].height)/2-.01);}
 assert.equal(letters[0].x,25);assert.equal(letters[0].y,100);
});
test('letters dart from the cursor, including a direct center hit, without pinning',async()=>{
 const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');
 for(const offset of [0,25]){const l={x:160,y:200,hx:160,hy:200,width:20,height:32,vx:0,vy:0};const pointer={x:160-offset,y:200};
 stepLetters([l],1/60,{width:390,height:844,time:1,pointer});assert.ok(l.vx>100);assert.ok(l.x>160);assert.ok(!l.pinned);
 for(let i=0;i<60;i++)stepLetters([l],1/60,{width:390,height:844,time:1+i/60,pointer});assert.ok(l.x>200);
 }
});
test('startled letters recover their correct position promptly when danger leaves',async()=>{
 const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const l={x:270,y:300,hx:160,hy:200,width:25,height:35,vx:120,vy:90};
 for(let i=0;i<120;i++)stepLetters([l],1/60,{width:390,height:844,time:i/60});assert.ok(Math.hypot(l.x-l.hx,l.y-l.hy)<1);assert.equal(l.state,'home');
});
test('letters take priority; distant and already fleeing shrimp are left alone',()=>{
 const f={id:2,x:200,y:200,w:800,h:600,heading:0},letter={x:280,y:200},near={x:220,y:200,state:'feeding'},far={x:400,y:200,state:'feeding'};
 mod.targetHunters([f],[letter],[near,far],0);assert.equal(f.prey,letter);
 mod.targetHunters([f],[],[far],1);assert.equal(f.prey,null);
 near.state='escape';mod.targetHunters([f],[],[near],2);assert.equal(f.prey,null);
 near.state='feeding';mod.targetHunters([f],[],[near],3);assert.equal(f.prey,near);
 mod.targetHunters([f],[],[near],3.1);assert.equal(f.prey,near);
 mod.targetHunters([f],[],[near],3.7);assert.equal(f.prey,null);
 mod.targetHunters([f],[],[near],4);assert.equal(f.prey,null);
});
test('fish have distinct feeding intensity and brake before a head-on encounter',()=>{
 const fishes=[2,3,4].map(id=>({id,x:200,y:200,w:800,h:600,heading:id===3?Math.PI:0,vx:id===3?-90:90,vy:0,center:{x:id===3?310:200,y:200},boundRadius:70}));
 mod.targetHunters(fishes,Array.from({length:3},(_,i)=>({x:260+i*2,y:200})),[],0);assert.equal(new Set(fishes.map(f=>f.requestedSpeed)).size,3);
 mod.avoidSchool(fishes.slice(0,2),.1);assert.ok(fishes[0].schoolBrake<1);assert.ok(fishes[1].schoolBrake<1);assert.ok(fishes[0].avoidY*fishes[1].avoidY<0);
});
test('fresh shrimp can receive brief nearby interest before their escape threshold',()=>{
 const world=new shrimp.EdgeShrimp(800,600),s=world.shrimp[0],f={id:2,x:s.x+30,y:s.y,w:800,h:600,heading:Math.PI};world.update(1/120,[f]);assert.equal(s.state,'feeding');mod.targetHunters([f],[],world.shrimp,0);assert.equal(f.prey,s);
});
test('predictive passing reduces hard contact corrections in a head-on encounter',async()=>{
 const {makeFish,refreshSkin,separateFish}=await import('../dist/iterations/shared-pond/world.js');
 function run(avoid){const fish=[2,3].map((id,i)=>{const f=makeFish(id,1000,700);f.x=i?680:320;f.y=350;f.heading=i?Math.PI:0;f.angles.fill(f.heading);f.speed=110;f.vx=i?-110:110;f.vy=0;f.articulate(0);refreshSkin(f);return f;});let contacts=0;
  for(let i=0;i<720;i++){for(const [j,f]of fish.entries()){f.target={x:j?200:800,y:350};f.requestedSpeed=130;}if(avoid)mod.avoidSchool(fish,1/120);for(const f of fish)mod.swimHunter(f,1/120);contacts+=separateFish(fish);}return contacts;
 }
 const raw=run(false),smooth=run(true);assert.ok(raw>0);assert.ok(smooth<raw,`smooth ${smooth}, raw ${raw}`);
});
test('one koi prefers shrimp while the others favor letters',()=>{
 const letter={x:280,y:200},s={x:310,y:200,state:'feeding'};
 for(const id of [2,3,4]){const f={id,x:200,y:200,w:800,h:600,heading:0};mod.targetHunters([f],[letter],[s],0);assert.equal(f.prey,id===4?s:letter);}
});
test('a mouth contact takes a real nibble, respects cooldown, and never bites a focused link',async()=>{
 const {nibble}=await import('../dist/iterations/hunting-tank/nibbles.js');const f={x:90,y:100,heading:0},l={x:100,y:100,width:28,height:30,inkHeight:24,maskWidth:20,maskHeight:30,inkPixels:[{x:2,y:15},{x:8,y:15}],bites:[]};
 assert.ok(nibble(f,l,1));assert.equal(l.bites.length,1);assert.equal(nibble(f,l,1.1),null);l.pinned=true;assert.equal(nibble(f,l,10),null);l.pinned=false;f.x=20;assert.equal(nibble(f,l,11),null);
});
test('a missed or over-turned pursuit becomes a forward glide instead of an orbit',()=>{
 const f={id:2,x:200,y:200,w:800,h:600,heading:0,prey:{x:175,y:200},chaseTurn:2};mod.targetHunters([f],[f.prey],[],2);assert.equal(f.mode,'glide');assert.equal(f.prey,null);assert.ok(f.target.x>f.x);assert.equal(f.chaseTurn,0);
});
test('a pursuing fish actually catches a fleeing letter through the shared physics',async()=>{
 const {makeFish,refreshSkin,separateFish,unionSkin}=await import('../dist/iterations/shared-pond/world.js');const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const {nibble}=await import('../dist/iterations/hunting-tank/nibbles.js');
 const f=makeFish(2,800,600);f.x=200;f.y=300;f.heading=0;f.angles.fill(0);f.articulate(0);refreshSkin(f);
 const l={x:350,y:300,hx:350,hy:300,width:28,height:36,glyphWidth:20,inkHeight:28,maskWidth:20,maskHeight:36,inkPixels:Array.from({length:180},(_,i)=>({x:i%10*2,y:Math.floor(i/10)*2})),vx:0,vy:0,bites:[]};let caught=false;
 for(let i=0;i<2400;i++){const time=i/120;mod.targetHunters([f],[l],[],time);mod.swimHunter(f,1/120);separateFish([f]);if(nibble(f,f.prey,time)){caught=true;mod.beginPass(f,time);break;}stepLetters([l],1/120,{width:800,height:600,time,hunters:[f],skin:unionSkin([f],true)});}
 assert.ok(caught);assert.ok(l.bites.length);assert.ok(f.glideUntil>0);
});
test('bite damage persists while retaining its link element',async()=>{
 const {updateMask}=await import('../dist/iterations/hunting-tank/nibbles.js');const el={style:{}},l={el,maskWidth:20,maskHeight:30,bites:[{x:4,y:8,r:4}],healAt:12};updateMask(l,3);assert.ok(el.style.maskImage.includes('svg'));updateMask(l,12);assert.ok(el.style.maskImage.includes('svg'));assert.equal(l.el,el);assert.equal(l.bites.length,1);
});
test('a scared shrimp relocates to another wall instead of returning to its old place',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0],origin=s.lastWall;w.startle(s,{x:s.x+10,y:s.y+10});let landed=false;
 for(let i=0;i<4000;i++){w.update(1/120,[]);if(s.state==='feeding'&&s.lastWall!==origin){landed=true;break;}}assert.ok(landed);assert.notEqual(s.lastWall,origin);
});
test('depleted food sends shrimp foraging, and empty patches are not eaten',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0],spent=s.patch;spent.amount=0;w.update(1/120,[]);assert.equal(s.state,'approach');assert.notEqual(s.destination.patch,spent);
 const empty=new shrimp.EdgeShrimp(800,600);for(const p of empty.patches)p.amount=0;empty.update(1/120,[]);assert.equal(empty.grazed,0);assert.ok(empty.shrimp.every(s=>s.state!=='feeding'));
});
test('escaping shrimp can land on a letter and ride its motion before migrating',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0];w.startle(s,{x:s.x+10,y:s.y+10});for(let i=0;i<120;i++)w.update(1/120,[]);
 const l={x:s.x+20,y:s.y+30,width:36,glyphWidth:30,height:40,inkHeight:34,vx:0,vy:0};let rode=false;
 for(let i=0;i<1200;i++){w.update(1/120,[],[l]);if(s.host===l){rode=true;break;}}assert.ok(rode);const x=s.x;l.x+=25;l.y+=12;w.syncRiders([l]);assert.equal(s.x,x+25);assert.equal(s.y,w.refugePose(l,s).y);
 for(let i=0;i<1000;i++)w.update(1/120,[],[l]);assert.equal(s.host,null);
});
test('shrimp intercept and attach to a steadily moving refuge letter',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0],l={x:300,y:300,width:36,glyphWidth:30,inkHeight:34,vx:10,vy:0};s.x=250;s.y=270;w.travelTo(s,{letter:l});let attached=false;
 for(let i=0;i<1200;i++){l.x+=l.vx/120;w.update(1/120,[],[l]);w.syncRiders([l]);if(s.host===l){attached=true;break;}}assert.ok(attached);assert.equal(s.x,l.x);
});
test('riders follow a focused letter and retain attachment when layout particles rebuild',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0],el={},l={el,x:300,y:300,inkHeight:34};s.host=l;s.state='perched';s.rideUntil=30;w.syncRiders([l]);l.x=120;l.y=200;w.syncRiders([l]);assert.equal(s.x,120);
 const next={...l,x:170,y:230};w.remapLetters([next]);assert.equal(s.host,next);assert.equal(s.x,170);assert.equal(s.y,w.refugePose(next,s).y);
});

test('wall food starts and regrows at one quarter of its former supply',()=>{
 const w=new shrimp.EdgeShrimp(800,600);assert.ok(w.patches.every(p=>p.amount===.175));w.shrimp=[];w.update(1,[]);assert.ok(Math.abs(w.patches[0].amount-.178)<1e-8);w.update(30,[]);assert.equal(w.patches[0].amount,.25);
});
test('hungry shrimp swim to distinct feeder beads and cling when the chain moves',()=>{
 const w=new shrimp.EdgeShrimp(800,600);w.setFeeder(Array.from({length:6},(_,i)=>({x:660,y:55+i*14,angle:Math.PI/2})));
 for(const p of w.patches)p.amount=0;w.update(1/120,[]);assert.ok(w.shrimp.every(s=>s.destination?.feeder));assert.equal(new Set(w.shrimp.map(s=>s.destination.feeder)).size,6);
 const s=w.shrimp[0];for(let i=0;i<2400&&!s.feederHost;i++){for(const p of w.patches)p.amount=0;w.update(1/120,[]);}assert.ok(s.feederHost);assert.equal(s.state,'feeding');const oldX=s.x;
 w.setFeeder(w.feeder.map(p=>({...p,x:p.x-25})));w.syncRiders([]);assert.equal(s.x,oldX-25);w.startle(s,{x:s.x-2,y:s.y});assert.equal(s.feederHost,null);
});

test('fish spread out and prefer zero bites, then one, then two',()=>{
 const fresh={x:350,y:200,bites:[]},once={x:250,y:200,bites:[{}]},twice={x:220,y:200,bites:[{},{}]},fishes=[2,3,4].map(id=>({id,x:200,y:200,w:800,h:600,heading:0}));mod.targetHunters(fishes,[twice,once,fresh],[],0);assert.equal(fishes[0].prey,fresh);assert.equal(fishes[1].prey,null);assert.equal(fishes[2].prey,null);fresh.eaten=true;mod.targetHunters(fishes,[twice,once,fresh],[],.1);assert.equal(fishes[0].prey,once);assert.equal(fishes[1].prey,null);once.eaten=true;mod.targetHunters(fishes,[twice,once,fresh],[],.2);assert.equal(fishes[0].prey,twice);
 fresh.settled=true;mod.targetHunters(fishes,[fresh],[],1);assert.ok(fishes.every(f=>f.prey!==fresh));
});
test('successive real bites finish every letter and consumed letters cannot be bitten again',async()=>{
 const {nibble,feedingPoint,updateMask}=await import('../dist/iterations/hunting-tank/nibbles.js');
 const letters=Array.from({length:12},(_,i)=>({x:200+i*40,y:200,width:28,height:36,inkHeight:28,maskWidth:20,maskHeight:36,inkPixels:Array.from({length:180},(_,i)=>({x:i%10*2,y:Math.floor(i/10)*2})),bites:[],el:{style:{}}}));
 for(const l of letters){const f={x:l.x-15,y:l.y,heading:0};for(let i=0;i<30&&!l.eaten;i++){const p=feedingPoint(l,f);f.x=p.x-2;f.y=p.y;assert.ok(nibble(f,l,i*2+1));}assert.ok(l.eaten);updateMask(l,100);assert.equal(l.el.style.opacity,'0');assert.equal(l.el.style.pointerEvents,'none');assert.equal(nibble(f,l,100),null);}
});
test('responsive and day/night glyph rebuilds preserve consumed and bitten states',async()=>{
 const {restoreDamage}=await import('../dist/iterations/hunting-tank/nibbles.js');const old={maskWidth:20,maskHeight:40,bites:[{x:10,y:20,r:5}],eaten:true,scentAt:5};const l={maskWidth:40,maskHeight:80,inkPixels:[{x:20,y:40}]};restoreDamage(l,old);assert.equal(l.eaten,true);assert.equal(l.bites[0].x,20);assert.equal(l.bites[0].r,10);assert.equal(l.remainingInk.length,0);
});

test('poking fish and shrimp interrupts feeding with a bounded escape',async()=>{
 const {pokeTank}=await import('../dist/iterations/hunting-tank/interactions.js');const {makeFish}=await import('../dist/iterations/shared-pond/world.js');const f=makeFish(2,800,600),w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0];s.x=f.center.x;s.y=f.center.y;assert.equal(pokeTank([f],w,f.center.x,f.center.y,10),2);assert.equal(s.state,'escape');mod.targetHunters([f],[{x:f.x+30,y:f.y}],[],10.1);assert.equal(f.mode,'flee');assert.equal(f.prey,null);assert.ok(f.requestedSpeed>160);assert.ok(f.fleeTarget.x>=35&&f.fleeTarget.x<=765);
 mod.targetHunters([f],[],[],12);assert.notEqual(f.mode,'flee');
});
test('distant letters skip detailed skin geometry while nearby contacts remain exact',async()=>{
 const {nearbySkin}=await import('../dist/iterations/hunting-tank/interactions.js');let calls=0;const f={solidSkin:{bounds:{left:100,right:200,top:100,bottom:200},query(){calls++;return{clearance:3,nx:1,ny:0};}}};const skin=nearbySkin([f]);assert.equal(skin.query(600,400,20).clearance,Infinity);assert.equal(calls,0);assert.equal(skin.query(210,150,20).clearance,3);assert.equal(calls,1);
});
test('fish hold their aim on a scrap briefly and refresh immediately after another bite',async()=>{
 const {feedingPoint}=await import('../dist/iterations/hunting-tank/nibbles.js');const a={x:2,y:10},b={x:18,y:10},l={x:100,y:100,maskWidth:20,maskHeight:20,bites:[{}],remainingInk:[a,b]},f={x:90,y:100,time:0};assert.equal(feedingPoint(l,f).x,92);f.x=110;f.time=.05;assert.equal(feedingPoint(l,f).x,92);f.time=.15;assert.equal(feedingPoint(l,f).x,108);l.bites.push({});l.remainingInk=[a];assert.equal(feedingPoint(l,f).x,92);
});

test('forward shrimp swimming follows the head instead of sliding across it',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0];s.x=300;s.y=300;s.angle=Math.PI;s.patch=null;w.travelTo(s,{x:500,y:400,angle:0,patch:{amount:.2},distance:200});
 for(let i=0;i<500;i++){w.update(1/120,[]);if(s.state==='approach'&&s.locomotion==='swim'){const side=-Math.sin(s.angle)*s.vx+Math.cos(s.angle)*s.vy,forward=Math.cos(s.angle)*s.vx+Math.sin(s.angle)*s.vy;assert.ok(Math.abs(side)<1e-6);assert.ok(forward>=-1e-6);}}
});
test('nearby glass food is reached by slow crawling with a displacement-driven gait',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0],p=w.patches.find(p=>p.distance===s.distance+34);assert.ok(p);w.travelTo(s,{...w.dock(w.pose(p.distance)),patch:p,distance:p.distance});assert.equal(s.crawl,true);const before={x:s.x,y:s.y};w.update(.5,[]);assert.equal(s.locomotion,'crawl');assert.ok(Math.hypot(s.x-before.x,s.y-before.y)<=7.1);assert.ok(s.walkPhase>0);
});
test('escape launch is aligned tail-first and has a compact travel distance',()=>{
 const w=new shrimp.EdgeShrimp(800,600),s=w.shrimp[0];s.x=400;s.y=300;s.angle=1;w.startle(s,{x:390,y:300});for(let i=0;i<50;i++){w.update(1/120,[]);if(s.age>.09&&s.state==='escape'){assert.ok(s.vx*Math.cos(s.angle)+s.vy*Math.sin(s.angle)<0);assert.ok(Math.abs(-Math.sin(s.angle)*s.vx+Math.cos(s.angle)*s.vy)<1e-6);}}assert.ok(Math.hypot(s.to.x-s.from.x,s.to.y-s.from.y)<=180);
});

test('hunters prefer slightly farther small lettering as easier prey',()=>{
 const f={id:2,x:200,y:200,w:800,h:600,heading:0},large={x:260,y:200,inkHeight:60},small={x:285,y:200,inkHeight:18};mod.targetHunters([f],[large,small],[],0);assert.equal(f.prey,small);
});
test('small letters react later and less strongly to fish than name letters',async()=>{
 const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const base={x:300,y:300,hx:300,hy:300,width:22,height:28,glyphWidth:14,vx:0,vy:0};const small={...base,inkHeight:18},large={...base,inkHeight:60};const f={x:220,y:300,heading:0};for(const l of [small,large])stepLetters([l],1/60,{width:800,height:600,hunters:[f]});assert.equal(small.threat,'');assert.equal(large.threat,'koi');assert.ok(large.vx>small.vx);
});
test('small letters share shoal drift without losing their separation',async()=>{
 const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const letters=Array.from({length:6},(_,i)=>({group:'science',x:200+i*26,y:300,hx:200+i*26,hy:300,width:18,height:25,glyphWidth:12,inkHeight:18,vx:0,vy:0}));for(let i=0;i<120;i++)stepLetters(letters,1/120,{width:800,height:600,time:i/120});const drift=letters[0].y-letters[0].hy;assert.ok(Math.abs(drift)>.1);for(const l of letters)assert.ok(Math.abs(l.y-l.hy-drift)<.2);for(let i=1;i<letters.length;i++)assert.ok(letters[i].x-letters[i-1].x>=19);
});
test('hunters aim at actual small-letter ink before the first bite',async()=>{
 const {feedingPoint}=await import('../dist/iterations/hunting-tank/nibbles.js');const l={x:100,y:100,maskWidth:12,maskHeight:24,inkHeight:16,bites:[],inkPixels:[{x:2,y:4}]};assert.deepEqual(feedingPoint(l,{x:80,y:100,time:0}),{x:96,y:92});
});
test('a small letter can be bitten, sink, and be finished on the bottom',async()=>{
 const {makeFish,refreshSkin,separateFish}=await import('../dist/iterations/shared-pond/world.js');const {nearbySkin}=await import('../dist/iterations/hunting-tank/interactions.js');const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const {nibble}=await import('../dist/iterations/hunting-tank/nibbles.js');
 const f=makeFish(2,800,600);f.x=200;f.y=300;f.heading=0;f.angles.fill(0);f.articulate(0);refreshSkin(f);
 const l={group:'science',x:350,y:300,hx:350,hy:300,width:22,height:28,glyphWidth:12,inkHeight:16,maskWidth:12,maskHeight:28,inkPixels:Array.from({length:48},(_,i)=>({x:i%6*2,y:6+Math.floor(i/6)*2})),vx:0,vy:0,bites:[]};
 for(let i=0;i<24000&&!l.eaten&&!l.settled;i++){const time=i/120;mod.targetHunters([f],[l],[],time);mod.swimHunter(f,1/120);separateFish([f]);if(nibble(f,f.prey,time))mod.beginPass(f,time);stepLetters([l],1/120,{width:800,height:600,time,hunters:[f],skin:nearbySkin([f])});}
 assert.ok(l.sinking,'small prey must be catchable, not just targetable');if(!l.eaten){assert.ok(l.settled);const {grazeLetter}=await import('../dist/iterations/hunting-tank/nibbles.js');for(let t=300;t<650&&!l.eaten;t+=2)grazeLetter(l,t);}assert.ok(l.eaten);
});

test('small lettering sinks on its first bite and is gone by its second',async()=>{
 const {nibble,feedingPoint}=await import('../dist/iterations/hunting-tank/nibbles.js');for(const width of [6,14]){const l={group:'science',x:200,y:200,width:width+8,height:28,glyphWidth:width,inkHeight:18,maskWidth:width,maskHeight:28,inkPixels:Array.from({length:width*9/2},(_,i)=>({x:i%(width/2)*2,y:6+Math.floor(i/(width/2))*2})),bites:[]};const f={x:180,y:200,heading:0};for(let i=0;i<2&&!l.eaten;i++){const p=feedingPoint(l,f);f.x=p.x-2;f.y=p.y;assert.ok(nibble(f,l,i*2+1));}assert.ok(l.eaten);}
});
test('per-fish appetites vary first targets across visits without flickering every frame',()=>{
 const letters=Array.from({length:12},(_,i)=>({x:260+i*8,y:200,hx:260+i*8,hy:200,inkHeight:50})),choices=new Set();for(let seed=1;seed<=20;seed++){const f={id:2,x:200,y:200,w:800,h:600,heading:0,huntSeed:seed};mod.targetHunters([f],letters,[],0);choices.add(letters.indexOf(f.prey));const first=f.prey;mod.targetHunters([f],letters,[],.1);assert.equal(f.prey,first);}assert.ok(choices.size>=4);});

test('chain mount stays fixed while the falling ball accelerates and rebounds',async()=>{
 const {BeadChain}=await import('../dist/iterations/hunting-tank/chain.js');const c=new BeadChain(100,5);c.drop();let rebounded=false,max=0,prior=0;for(let i=0;i<480;i++){c.step(1/120);assert.equal(c.points[0].x,100);assert.equal(c.points[0].y,5);const y=c.points.at(-1).y;max=Math.max(max,y);if(i>65&&y<prior-.02)rebounded=true;prior=y;}assert.ok(max>117);assert.ok(rebounded);c.begin(100,117);c.move(100,150);assert.ok(c.release());
});
test('a bitten large letter keeps visible bite marks while sinking and landing',async()=>{
 const {nibble,updateMask}=await import('../dist/iterations/hunting-tank/nibbles.js');const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const l={group:'name',x:200,y:200,hx:200,hy:200,width:50,height:70,inkHeight:60,maskWidth:40,maskHeight:70,inkPixels:[{x:1,y:35},{x:30,y:20},{x:30,y:60}],bites:[],vx:0,vy:0,el:{style:{}}};assert.ok(nibble({x:180,y:200,heading:0},l,1));assert.ok(l.sinking);assert.equal(l.eaten,false);updateMask(l,1);assert.ok(l.el.style.maskImage.includes('svg'));for(let i=0;i<1800;i++)stepLetters([l],1/120,{width:800,height:600,time:i/120});assert.ok(l.settled);assert.ok(l.y>500);updateMask(l,20);assert.ok(l.el.style.maskImage.includes('svg'));
});
test('shrimp choose bottom letters ahead of algae and feeder food and eat them',()=>{
 const w=new shrimp.EdgeShrimp(800,600),l={x:300,y:560,width:24,height:28,inkHeight:18,maskWidth:12,maskHeight:28,group:'science',bites:[{x:0,y:0,r:1}],inkPixels:[{x:4,y:12},{x:8,y:15}],remainingInk:[{x:4,y:12},{x:8,y:15}],settled:true,sinking:true};const s=w.shrimp[0];w.shrimp=[s];s.x=250;s.y=520;s.patch=null;s.state='perched';w.setFeeder([{x:700,y:100,angle:0}]);w.update(1/120,[],[l]);assert.equal(s.destination.letter,l);assert.ok(s.destination.meal);for(let i=0;i<18000&&!l.eaten;i++)w.update(1/120,[],[l]);assert.ok(l.eaten);
});
test('letters cannot occupy a fish hull after solid collision resolution',async()=>{
 const {makeFish}=await import('../dist/iterations/shared-pond/world.js');const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const {letterFishContact}=await import('../dist/iterations/hunting-tank/solid.js');const f=makeFish(2,800,600),l={x:f.center.x,y:f.center.y,hx:f.center.x,hy:f.center.y,width:30,height:40,glyphWidth:22,inkHeight:30,vx:0,vy:0};assert.ok(letterFishContact(l,f));stepLetters([l],1/120,{width:800,height:600,hunters:[f]});assert.equal(letterFishContact(l,f),null);
});

test('a line of letters stays separate from fish bodies and from neighboring letters',async()=>{
 const {makeFish}=await import('../dist/iterations/shared-pond/world.js');const {stepLetters}=await import('../dist/iterations/hunting-tank/physics.js');const {letterFishContact}=await import('../dist/iterations/hunting-tank/solid.js');const f=makeFish(2,800,600),letters=Array.from({length:8},(_,i)=>({x:f.center.x-90+i*25,y:f.center.y,hx:f.center.x-90+i*25,hy:f.center.y,width:22,height:30,glyphWidth:14,inkHeight:20,vx:0,vy:0}));for(let i=0;i<60;i++)stepLetters(letters,1/120,{width:800,height:600,hunters:[f],time:i/120});for(const l of letters)assert.equal(letterFishContact(l,f),null);for(let i=0;i<letters.length;i++)for(let j=i+1;j<letters.length;j++)assert.ok(Math.abs(letters[i].x-letters[j].x)>=22.99||Math.abs(letters[i].y-letters[j].y)>=30.99);
});

test('a shared large-letter feast lasts at least 100 seconds despite six diners',async()=>{
 const {grazeLetter}=await import('../dist/iterations/hunting-tank/nibbles.js');const l={group:'name',settled:true,inkHeight:60,inkPixels:Array.from({length:120},(_,i)=>({x:i%12*2,y:Math.floor(i/12)*2})),bites:[]};l.remainingInk=[...l.inkPixels];for(let t=0;t<100;t++)for(let i=0;i<6;i++)grazeLetter(l,t);assert.ok(!l.eaten);assert.ok(l.remainingInk.length>0);for(let t=100;t<1000&&!l.eaten;t+=2)grazeLetter(l,t);assert.ok(l.eaten);
});
test('nutrient bubbles rise, then reform a clean protected letter at its home',async()=>{
 const {cycleLetters,nutrientPosition}=await import('../dist/iterations/hunting-tank/ecology.js');const l={x:420,y:560,hx:200,hy:150,eaten:true,sinking:true,settled:true,bites:[{x:1,y:1,r:3}],nextGraze:100,feastStarted:1};cycleLetters([l],10);const start=nutrientPosition(l,13),middle=nutrientPosition(l,18);assert.ok(middle.y<start.y);assert.ok(l.eaten);cycleLetters([l],30);assert.equal(l.eaten,false);assert.equal(l.x,200);assert.equal(l.y,150);assert.equal(l.sinking,false);assert.deepEqual(l.bites,[]);assert.ok(l.huntRestUntil>30);assert.equal(l.recycle,null);
});
test('stalled hunters choose a forward pass instead of lingering at a letter',()=>{
 const l={x:260,y:200},f={id:2,x:200,y:200,w:800,h:600,heading:0,prey:l,progressPrey:l,bestDistance:58,progressAt:0};mod.targetHunters([f],[l],[],2);assert.equal(f.mode,'glide');assert.ok(f.target.x>f.x);
});

test('shrimp reserve separate meals and redistribute when a new letter arrives',()=>{
 const w=new shrimp.EdgeShrimp(800,600),letters=Array.from({length:6},(_,i)=>({x:300+i*35,y:400,sinking:true,width:30,height:40,inkHeight:30}));w.letters=letters;
 for(const s of w.shrimp)w.travelTo(s,{letter:w.pickMeal(s),meal:true});assert.equal(new Set(w.shrimp.map(s=>s.destination.letter)).size,6);
 w.letters=[letters[0]];for(const s of w.shrimp)w.travelTo(s,{letter:letters[0],meal:true});w.step(1/120,[],letters);assert.equal(new Set(w.shrimp.map(s=>s.destination?.letter)).size,6);
 assert.equal(w.mealEligible({...letters[0],y:299}),false);assert.equal(w.mealEligible({...letters[0],y:300}),true);
 assert.equal(new Set(w.shrimp.map(s=>s.scale)).size,6);assert.ok(w.shrimp.every(s=>s.scale<.64));
});
test('shrimp board a sinking meal before it reaches the floor',()=>{
 const w=new shrimp.EdgeShrimp(800,900),s=w.shrimp[0],l={x:300,y:460,sinking:true,width:40,height:50,inkHeight:40,vx:0,vy:34,inkPixels:[{x:1,y:1}],bites:[]};w.shrimp=[s];s.x=270;s.y=420;
 for(let i=0;i<1000&&!s.host;i++){l.y+=34/120;w.update(1/120,[],[l]);}assert.equal(s.host,l);assert.ok(l.y<850);assert.ok(s.meal);
});
test('steady shrimp intake finishes and nutrient puffs start at the final diner',async()=>{
 const {grazeLetter}=await import('../dist/iterations/hunting-tank/nibbles.js'),{cycleLetters}=await import('../dist/iterations/hunting-tank/ecology.js');
 const l={group:'name',settled:true,x:300,y:550,hx:100,hy:100,inkHeight:60,inkPixels:Array.from({length:600},(_,i)=>({x:i%30*2,y:Math.floor(i/30)*2})),bites:[]},s={x:280,y:510,angle:0,scale:.5};let previous=600;
 for(let t=0;t<110;t+=1.81){grazeLetter(l,t,s);assert.ok(l.remainingInk.length<previous||l.eaten);previous=l.remainingInk.length;}assert.ok(l.eaten);cycleLetters([l],111);assert.equal(l.recycle.x,272);assert.equal(l.recycle.y,510);
});
test('switching light keeps a moving fish and its hunt in progress',async()=>{
 const {LivingLinkScene}=await import('../dist/iterations/hunting-tank/scene.js');
 const {makeFish}=await import('../dist/iterations/shared-pond/world.js');
 const scene=Object.create(LivingLinkScene.prototype),f=makeFish(2,800,600),prey={x:310,y:240};
 Object.assign(f,{speed:88,acceleration:12,mode:'hunt',prey,target:{x:310,y:240}});
 Object.assign(scene,{w:800,h:600,ratio:1,time:10,night:false,sprites:[null],fishes:[f],resize(){},draw(){}});
 scene.setNight(true);
 assert.equal(scene.fishes[0],f);
 assert.equal(f.speed,88);
 assert.equal(f.acceleration,12);
 assert.equal(f.mode,'hunt');
 assert.equal(f.prey,prey);
});

test('display intervals advance motion evenly at 60, 120 and 144 Hz',async()=>{
 const {motionSteps}=await import('../dist/iterations/hunting-tank/timing.js');
 for(const hz of [60,120,144]){let position=0;for(let frame=0;frame<hz;frame++){const elapsed=1/hz*(frame%2?.97:1.03),before=position,{count,dt}=motionSteps(elapsed);assert.ok(dt<=1/120+1e-10);for(let i=0;i<count;i++)position+=180*dt;assert.ok(Math.abs(position-before-180*elapsed)<1e-9,'no repeated frame or accumulated jump');}assert.ok(Math.abs(position-180)<1e-8);}
 assert.deepEqual(motionSteps(0),{count:0,dt:0});assert.deepEqual(motionSteps(Infinity),{count:0,dt:0});assert.equal(motionSteps(2).count,6);
});

test('ordinary speed changes ease acceleration while pokes retain a fast burst',()=>{
 const f={speed:100,mode:'hunt'},fast={speed:100,mode:'flee'};let previous=0;
 for(let i=0;i<120;i++){mod.advanceSpeed(f,i<60?160:64,1/120);assert.ok(Math.abs(f.acceleration-previous)<=150/120+1e-8);previous=f.acceleration;assert.ok(f.speed>60&&f.speed<165);if(i<60)mod.advanceSpeed(fast,210,1/120);}
 assert.ok(fast.speed>150);for(let i=0;i<600;i++)mod.advanceSpeed(f,64,1/120);assert.ok(Math.abs(f.speed-64)<.1);
});

test('individual rhythms stay stable and passing choices are reciprocal but varied',async()=>{
 const {personality,individual,passingSide,preferredTurn}=await import('../dist/iterations/hunting-tank/personality.js');const traits=Array.from({length:12},(_,i)=>personality(i+1));assert.equal(new Set(traits.map(t=>t.hand)).size,2);assert.equal(new Set(traits.map(t=>t.tempo)).size,12);const f={id:2,huntSeed:123};assert.equal(individual(f),individual(f));assert.deepEqual(personality(123),individual(f));const sides=[];for(const [a,b] of [[2,3],[2,4],[3,4]]){assert.equal(passingSide({id:a},{id:b}),passingSide({id:b},{id:a}));sides.push(passingSide({id:a},{id:b}));}assert.equal(new Set(sides).size,2);assert.ok(preferredTurn(Math.PI,-1)<0);assert.ok(preferredTurn(-Math.PI,1)>0);
});

test('a meal has one diner and attached shrimp face both ways with legs toward the meal',()=>{
 const w=new shrimp.EdgeShrimp(800,600),l={x:300,y:500,width:30,inkHeight:30,sinking:true};w.letters=[l];w.travelTo(w.shrimp[0],{letter:l,meal:true});assert.equal(w.pickMeal(w.shrimp[1]),undefined);const a=w.refugePose(l,w.shrimp[0]),b=w.refugePose(l,w.shrimp[1]);assert.equal(a.angle,0);assert.equal(b.angle,Math.PI);assert.equal(b.surfaceFlip,-1);
});
test('shrimp bodies separate even when stacked at a meal',()=>{
 const w=new shrimp.EdgeShrimp(800,600);for(const s of w.shrimp){s.x=400;s.y=400;s.patch=null;s.host={};s.meal=true;}w.separateBodies();for(let i=0;i<w.shrimp.length;i++)for(let j=i+1;j<w.shrimp.length;j++){const a=w.shrimp[i],b=w.shrimp[j];assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=30*(a.scale+b.scale)+3-.1);}assert.equal(w.shrimp.filter(s=>s.host).length,1);
});
