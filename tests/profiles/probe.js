const params=new URLSearchParams(location.search),route=params.get('route')||'ultraviolet-best';
const modern=route!=='ultraviolet-minimal';
const { [modern?'UltravioletKoi':'Koi']: Type }=await import(`/dist/iterations/${route}/koi.js`);
const duration=Number(params.get('seconds')||60)*1000, warmup=5000;
const frames=[],work=[],parts={},original=Type.prototype.frame;let first=0,last=0,engine,done=false,captured=0,maxMoving=0,scriptedCaptures=0,lastEvent=-1;
const q=(a,p)=>a.length?[...a].sort((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))]:0;
for(const name of ['steer','updateMinnows','draw','updateDiagnostics']){const old=Type.prototype[name];if(!old)continue;Type.prototype[name]=function(...args){const begin=performance.now();const result=old.apply(this,args);(parts[name]??=[]).push(performance.now()-begin);return result;};}
Type.prototype.frame=function(now){engine=this;const begin=performance.now();if(!first)first=now;const elapsed=now-first;
 if(elapsed>=warmup&&last&&now-last<1000&&!document.hidden&&!this.paused)frames.push(now-last);
 last=now;
 if(params.has('stress')){const event=Math.floor(elapsed/1000);if(event!==lastEvent){lastEvent=event;
 if(event%12===6){const l=this.letters.find(l=>!l.eaten&&!l.locked&&l.visible);if(l){const n=this.eaten||0;l.x=this.x+Math.cos(this.heading)*2;l.y=this.y+Math.sin(this.heading)*2;this.capture();scriptedCaptures+=(this.eaten||0)-n;}}
 if(event%12===8){const r=document.querySelector('.lead').getBoundingClientRect();this.tap={x:r.left+r.width*.5,y:r.top+scrollY+r.height*.5,until:this.time+4};}
 if(event===25||event===45)scrollTo(0,document.documentElement.scrollHeight);if(event===27||event===47)scrollTo(0,0);
 }}
 original.call(this,now);if(elapsed>=warmup)work.push(performance.now()-begin);
 captured=Math.max(captured,this.eaten||0);maxMoving=Math.max(maxMoving,this.letters.filter(l=>l.state!=='home'&&!l.eaten).length);
 if(elapsed>=duration+warmup&&!done){done=true;this.setPaused(true);report();}
};
function report(){const total=frames.reduce((a,b)=>a+b,0),misses=frames.filter(x=>x>25).length;const result={route,done,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,userAgent:navigator.userAgent,frames:frames.length,seconds:total/1000,fps:frames.length*1000/total,interval:{p50:q(frames,.5),p95:q(frames,.95),p99:q(frames,.99),max:q(frames,1),over16_7:frames.filter(x=>x>16.7).length,over25:misses,missPercent:100*misses/frames.length,estimatedMissedVsync:frames.reduce((a,x)=>a+Math.max(0,Math.round(x/(1000/60))-1),0)},work:{p50:q(work,.5),p95:q(work,.95),p99:q(work,.99),max:q(work,1)},parts:Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,{p95:q(v,.95),p99:q(v,.99)}])),captured,scriptedCaptures,engineState:engine?{paused:engine.paused,visible:engine.visible,steps:engine.steps,x:engine.x,y:engine.y,heading:engine.heading,registered:engine.letters.length}:null,scenario:params.has('stress')?'scripted mouth captures, taps and scroll':'natural',maxMoving,simTime:engine?.time};document.getElementById('profile-result').textContent=JSON.stringify(result);}
const output=document.createElement('script');output.type='application/json';output.id='profile-result';document.body.append(output);
setInterval(report,1000);document.addEventListener('visibilitychange',()=>last=0);
await import(`/dist/iterations/${route}/app.js`);
