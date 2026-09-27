const params=new URLSearchParams(location.search),route=document.body.dataset.style+(params.has('baseline')?'':'-flow');
const {[params.has('baseline')?'ArtKoi':'ArtFlowKoi']:Type}=await import('/dist/iterations/'+(params.has('baseline')?'art-koi':'art-flow')+'/engine.js');
const {glyphBox}=await import('/dist/iterations/tank/solid.js');
let maxOutside=0,viewportRepairs=0,unresolved=0;
const duration=Number(params.get('seconds')||60)*1000, warmup=5000;
const frames=[],work=[],parts={},original=Type.prototype.frame;let first=0,last=0,engine,done=false,captured=0,maxMoving=0,scriptedCaptures=0,lastEvent=-1;
const q=(a,p)=>a.length?[...a].sort((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))]:0;
for(const name of ['steer','updateMinnows','draw','updateDiagnostics']){const old=Type.prototype[name];if(!old)continue;Type.prototype[name]=function(...args){const begin=performance.now();const result=old.apply(this,args);(parts[name]??=[]).push(performance.now()-begin);return result;};}
Type.prototype.frame=function(now){engine=this;const begin=performance.now();if(!first)first=now;const elapsed=now-first;
 if(elapsed>=warmup&&last&&now-last<1000&&!document.hidden&&!this.paused)frames.push(now-last);
 last=now;
 if(params.has('stress')){const event=Math.floor(elapsed/1000);if(event!==lastEvent){lastEvent=event;
 if(event%12===6&&this.capture){const l=this.letters.find(l=>!l.eaten&&!l.locked&&l.visible);if(l){const n=this.eaten||0;l.x=this.x+Math.cos(this.heading)*2;l.y=this.y+Math.sin(this.heading)*2;this.capture();scriptedCaptures+=(this.eaten||0)-n;}}
 if(event%12===8){const r=document.querySelector('.lead').getBoundingClientRect();this.tap={x:r.left+r.width*.5,y:r.top+scrollY+r.height*.5,until:this.time+4};}
 if(event===25||event===45)scrollTo(0,document.documentElement.scrollHeight);if(event===27||event===47)scrollTo(0,0);
 }}
 original.call(this,now);if(elapsed>=warmup)work.push(performance.now()-begin);
 if(elapsed>=warmup&&!this.paused){viewportRepairs+=this.school?.viewportContacts?.repaired||0;unresolved+=this.school?.viewportContacts?.unresolved||0;for(const l of this.letters){if(l.eaten||l.locked||l.state==='home'||!l.visible)continue;const b=glyphBox(l);maxOutside=Math.max(maxOutside,-b.left,b.right-this.w,scrollY-b.top,b.bottom-scrollY-this.h);}}
 captured=Math.max(captured,this.eaten||0);maxMoving=Math.max(maxMoving,this.letters.filter(l=>l.state!=='home'&&!l.eaten).length);
 if(elapsed>=duration+warmup&&!done){done=true;this.setPaused(true);report();finish();}
};
function report(){const total=frames.reduce((a,b)=>a+b,0),misses=frames.filter(x=>x>25).length;const result={route,done,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,userAgent:navigator.userAgent,frames:frames.length,seconds:total/1000,fps:frames.length*1000/total,interval:{p50:q(frames,.5),p95:q(frames,.95),p99:q(frames,.99),max:q(frames,1),over16_7:frames.filter(x=>x>16.7).length,over25:misses,missPercent:100*misses/frames.length,estimatedMissedVsync:frames.reduce((a,x)=>a+Math.max(0,Math.round(x/(1000/60))-1),0)},work:{p50:q(work,.5),p95:q(work,.95),p99:q(work,.99),max:q(work,1)},parts:Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,{p95:q(v,.95),p99:q(v,.99)}])),captured,scriptedCaptures,maxOutside,viewportRepairs,unresolved,engineState:engine?{paused:engine.paused,visible:engine.visible,steps:engine.steps,x:engine.x,y:engine.y,heading:engine.heading,registered:engine.letters.length}:null,scenario:params.has('baseline')?'original art study; taps and scroll (no capture system)':params.has('stress')?'scripted mouth captures, taps and scroll':'natural',maxMoving,simTime:engine?.time};document.getElementById('profile-result').textContent=JSON.stringify(result);}
const output=document.createElement('script');output.type='application/json';output.id='profile-result';document.body.append(output);
setInterval(report,1000);document.addEventListener('visibilitychange',()=>last=0);
function finish(){
 const result=JSON.parse(document.getElementById('profile-result').textContent),key='art-profiles-'+(params.get('suite')||'desktop');
 const results=JSON.parse(sessionStorage.getItem(key)||'[]');results.push(result);sessionStorage.setItem(key,JSON.stringify(results));
 const all=document.createElement('script');all.type='application/json';all.id='suite-result';all.textContent=JSON.stringify(results);document.body.append(all);
 const styles=['soft-rubber','scribble','marker','riso','sketchbook'],i=styles.indexOf(document.body.dataset.style);
 if(params.has('sequence')&&!params.has('baseline')&&i<styles.length-1)setTimeout(()=>location.href='/tests/art-profiles/'+styles[i+1]+'.html?'+params.toString(),100);
 if(params.has('sequence')&&!params.has('baseline')&&!params.has('skipBaseline')&&i===styles.length-1)setTimeout(()=>location.href='/tests/art-profiles/original.html?'+params.toString()+'&baseline',100);
}
await import('/dist/iterations/'+(params.has('baseline')?'art-koi':'art-flow')+'/app.js');
