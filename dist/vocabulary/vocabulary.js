import {connectionData} from '/connections/connections.js?v=nav-20260928c';
const data=await fetch('data.json').then(r=>r.json()),graph=await connectionData;
const $=s=>document.querySelector(s),el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
const link=(text,url)=>{const a=el('a',text);a.href=url;return a};
let selected=data.terms[0],seed=1,phase=0,loopSeconds=8,lastTime=null,lastPaint=0;const motion=matchMedia('(prefers-reduced-motion: reduce)');let playing=!motion.matches;const values={density:45,scale:45,irregularity:35};
for(const t of data.terms){const b=el('button',t.name);b.type='button';b.dataset.term=t.id;b.onclick=()=>{selected=t;update()};$('#terms').append(b)}
for(const a of data.axes){const label=el('label',`${a.name} · ${a.low} → ${a.high}`),input=el('input');input.type='range';input.min=10;input.max=90;input.value=values[a.id];input.id=a.id;input.setAttribute('aria-label',a.name);input.oninput=()=>{values[a.id]=Number(input.value);update()};label.append(input);$('#axes').append(label)}
$('#variation').onclick=()=>{seed++;phase=0;draw();brief()};$('#reading').oninput=brief;
function update(){for(const b of $('#terms').children)b.setAttribute('aria-pressed',String(b.dataset.term===selected.id));$('#term-name').textContent=selected.name;$('#observation').textContent=selected.observation;$('#mechanism').textContent=selected.mechanism;$('#question').textContent=selected.question;
 const host=$('#lineage');host.replaceChildren();const recipe=graph?.recipes.find(r=>r.name===selected.recipe);host.append(link(selected.recipe+' ↗',recipe?.agentAdded?'/connections/?node='+encodeURIComponent(recipe.id)+'#people':'/notes/ingredients/techniques.html?recipe='+encodeURIComponent(selected.recipe)));
 const credits=recipe?graph.relationships.filter(r=>r.target===recipe.id&&r.kind==='contribution'):[];
 for(const r of credits){const person=graph.people.find(p=>p.id===r.person);if(!person)continue;const p=el('p','');p.append(link(person.name,'/connections/?person='+encodeURIComponent(person.name)+'#people'),document.createTextNode(' · '+r.role+' · '),link('source ↗',r.source));if(r.review==='imported')p.append(el('small','Catalog credit · source recheck pending'));if(r.agentReview)p.append(el('small','AI-reviewed connection · inspect the evidence'));host.append(p)}
 if(!credits.length)host.append(el('p','Contribution research is still in progress.'));draw();brief();}
function brief(){const word=(v,a,b)=>v<35?a:v>65?b:'moderate';$('#brief').textContent=`Explore ${selected.name.toLowerCase()}: ${selected.observation}\nUse ${word(values.density,'sparse','dense')} density (${values.density}/100), ${word(values.scale,'fine','coarse')} scale (${values.scale}/100), and ${word(values.irregularity,'regular','irregular')} spacing (${values.irregularity}/100).\nMechanism to investigate: ${selected.mechanism}\nLoop: ${loopSeconds} seconds; seed ${seed}.\nTrace the contributions linked to ${selected.recipe}: https://thevibesarepeople.com/vocabulary/#${selected.id}\n${$('#reading').value.trim()?'Intended reading (context supplied by the maker): '+$('#reading').value.trim():'Keep interpretation open; compare what different viewers read in the image.'}\nDevelop an original study; credit specific methods and contributions without assuming a sole inventor or copying an artist’s work.`}
function draw(){const time=phase*Math.PI*2;$('#study').dataset.phase=phase.toFixed(6);const c=$('#study'),x=c.getContext('2d'),w=c.width,h=c.height,d=values.density/100,s=values.scale/100,j=values.irregularity/100;let state=seed;const rnd=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296};x.fillStyle='#f5f5f2';x.fillRect(0,0,w,h);x.strokeStyle='#111';x.fillStyle='#111';x.lineWidth=1;
 if(selected.id==='flow'){
  for(let n=0;n<20+d*100;n++){
   let a=rnd()*w,b=rnd()*h;const offset=rnd(),progress=(phase+offset)%1,points=[];
   for(let k=0;k<220;k++){points.push([a,b]);const angle=Math.sin((a+b*j)/(30+s*120))+Math.cos(b/(45+s*90))*.6;a+=Math.cos(angle)*2.5;b+=Math.sin(angle)*2.5}
   const head=Math.floor(progress*219),tail=Math.max(0,head-38);x.globalAlpha=Math.min(1,progress*8,(1-progress)*8);x.beginPath();for(let k=tail;k<=head;k++){const p=points[k];k===tail?x.moveTo(...p):x.lineTo(...p)}x.stroke();
  }x.globalAlpha=1;
 }
 if(selected.id==='cohesion'){for(let n=0;n<40+d*260;n++){const group=n%4,angle=rnd()*Math.PI*2,r=Math.sqrt(rnd())*(30+s*80),cx=100+group*165+Math.sin(time+group)*18,cy=220+Math.sin(group+time)*70,a=cx+Math.cos(angle+time)*r,b=cy+Math.sin(angle+time)*r;x.save();x.translate(a,b);x.rotate(group*.5+(rnd()-.5)*j*3);x.beginPath();x.moveTo(-4,-2);x.lineTo(5,0);x.lineTo(-4,2);x.stroke();x.restore()}}
 if(selected.id==='interference'){const gap=4+(1-d)*20;for(const rotation of [0,.04+s*.3+Math.sin(time)*(.03+j*.08)]){x.save();x.translate(w/2,h/2);x.rotate(rotation);for(let a=-w;a<w;a+=gap){x.beginPath();x.moveTo(a+(rnd()-.5)*j*6,-h);x.lineTo(a,h);x.stroke()}x.restore()}}
 if(selected.id==='branching'){const branch=(a,b,len,angle,depth)=>{if(!depth)return;const tx=a+Math.sin(angle)*len,ty=b-Math.cos(angle)*len;x.beginPath();x.moveTo(a,b);x.lineTo(tx,ty);x.stroke();for(const dir of [-1,1])branch(tx,ty,len*(.62+s*.13),angle+dir*(.25+s*.3+Math.sin(time)*.08)+(rnd()-.5)*j*.6,depth-1)};branch(w/2,h-20,80+s*50,0,Math.round(4+d*5))}
 if(selected.id==='grain'){const step=4+(1-d)*12;for(let a=12;a<w-12;a+=step)for(let b=12;b<h-12;b+=step){const radius=(.3+s*2.5)*(Math.sin(a/80+time)*.4+.6);x.beginPath();x.arc(a+(rnd()-.5)*j*step,b+(rnd()-.5)*j*step,radius,0,Math.PI*2);x.fill()}}
 if(selected.id==='subdivision'){const split=(a,b,ww,hh,depth)=>{if(!depth){x.strokeRect(a+2,b+2,ww-4,hh-4);return}const f=.5+(rnd()-.5)*j*.7+Math.sin(time+depth)*.05;if(ww>hh*(.7+s)){split(a,b,ww*f,hh,depth-1);split(a+ww*f,b,ww*(1-f),hh,depth-1)}else{split(a,b,ww,hh*f,depth-1);split(a,b+hh*f,ww,hh*(1-f),depth-1)}};split(15,15,w-30,h-30,Math.round(2+d*6))}
}
$('#copy-brief').onclick=async()=>{try{await navigator.clipboard.writeText($('#brief').textContent);$('#copy-status').textContent='Copied'}catch{$('#copy-status').textContent='Select and copy the brief above'}};
function reflectPlayback(){const b=$('#play-loop');b.textContent=playing?'Pause loop':'Play loop';b.setAttribute('aria-pressed',String(playing));$('#loop-status').textContent=playing?'Playing':'Paused'}
$('#play-loop').onclick=()=>{playing=!playing;lastTime=null;reflectPlayback()};
$('#restart-loop').onclick=()=>{phase=0;lastTime=null;draw()};
$('#loop-seconds').oninput=event=>{loopSeconds=Number(event.target.value);$('#loop-duration').textContent=loopSeconds;brief()};
motion.addEventListener('change',event=>{if(event.matches){playing=false;reflectPlayback()}});
document.addEventListener('visibilitychange',()=>{lastTime=null});
function tick(now){if(lastTime!==null&&playing&&!document.hidden&&studyVisible){phase=(phase+Math.min(now-lastTime,100)/1000/loopSeconds)%1;if(now-lastPaint>=1000/30){draw();lastPaint=now}}lastTime=now;requestAnimationFrame(tick)}
let studyVisible=true;new IntersectionObserver(entries=>{studyVisible=entries[0].isIntersecting;lastTime=null}).observe($('#study'));
reflectPlayback();requestAnimationFrame(tick);
const initial=data.terms.find(t=>t.id===location.hash.slice(1));if(initial)selected=initial;update();
