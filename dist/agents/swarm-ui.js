import {ledgerRequest,loadLedger} from './overlay.js';
import {summarize,missionPrompt,creditManifest,MISSIONS,validUsername,REPO} from './swarm.js';
const $=s=>document.querySelector(s);
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const link=(text,url)=>{const e=el('a',text);e.href=url;e.rel='noopener noreferrer';return e};
let ledger={version:1,events:[]},issues=[],queueAvailable=false,queuePartial=false,provenance=[],lastRefresh=0,personContext='';
let recordsAvailable=false;
const labels={accepted:'Accepted',reviewing:'Review reserved',queued:'Queued',unresolved:'Unresolved / invalid'};
const readPreference=()=>{try{return localStorage.getItem('vibes-contributor')||''}catch{return ''}};
const preference=readPreference();if(validUsername(preference))$('#contributor').value=preference;
function totals(host,stats,known=true){host.replaceChildren();for(const key of ['accepted','reviewing','queued','unresolved']){const p=el('p');p.append(el('strong',known&&(key!=='queued'||queueAvailable)?String(stats[key]):'—'),el('span',labels[key]));host.append(p)}}
function personal(){
 const username=$('#contributor').value.trim();$('#personal-records').replaceChildren();
 if(!username){$('#personal-status').textContent='Enter your public username to find your contributions.';$('#personal-totals').replaceChildren();return}
 if(!validUsername(username)){$('#personal-status').textContent='Enter a GitHub username using letters, numbers and hyphens (up to 39 characters).';$('#personal-totals').replaceChildren();return}
 const stats=summarize(ledger,issues,username);totals($('#personal-totals'),stats,recordsAvailable);
 $('#personal-status').textContent=`${stats.total} record${stats.total===1?'':'s'} found for ${username} in the records loaded here.${!queueAvailable?' Queue unavailable; unreserved submissions may be missing.':queuePartial?' The queue is partial; older waiting submissions may be missing.':''}${!recordsAvailable?' Review ledger unavailable.':''} This does not measure private agent activity.`;
 for(const r of stats.records.slice(0,30)){const li=el('li');li.append(link(`#${r.issue} · ${labels[r.state]}`,`${REPO}/issues/${r.issue}`));if(r.proposal)li.append(` · ${r.proposal.person} → ${r.proposal.target.name}`);$('#personal-records').append(li)}
}
function render(){
 const stats=summarize(ledger,issues);totals($('#swarm-totals'),stats,recordsAvailable);
 const wall=$('#evidence-wall');wall.replaceChildren();
 for(const r of stats.records.slice(0,120)){const a=link(String(r.issue),`${REPO}/issues/${r.issue}`);a.className=r.state;const label=`Submission ${r.issue}: ${labels[r.state]}${r.proposal?' · '+r.proposal.person+' → '+r.proposal.target.name:''}`;a.title=label;a.setAttribute('aria-label',label);wall.append(a)}
 if(!stats.records.length)wall.append(el('p',recordsAvailable?'No contribution records in the loaded ledger yet. Start with one research mission.':'Contribution records are unavailable. You can still prepare a mission.'));
 if(stats.records.length>120)wall.append(link('Older records ↗',`${REPO}/issues`));
 personal();updateCredits();
}
async function queue(){
 try{
  const r=await fetch('https://api.github.com/repos/yury-g/the-vibes-are-people/issues?state=open&per_page=100',{signal:AbortSignal.timeout(5000),headers:{Accept:'application/vnd.github+json'}});
  if(!r.ok)throw Error();const data=await r.json();if(!Array.isArray(data))throw Error();
  return {issues:data,available:true,partial:(r.headers.get('link')||'').includes('rel="next"')||data.length===100};
 }catch{return {issues:[],available:false,partial:false}}
}
async function refresh(first=false){
 const button=$('#refresh-swarm');if(Date.now()-lastRefresh<60000){$('#swarm-source').textContent+=' Wait at least a minute between refreshes.';return}
 button.disabled=true;lastRefresh=Date.now();
 const [l,q]=await Promise.all([first?ledgerRequest:loadLedger(),queue()]);
 ledger=l.data;issues=q.issues;queueAvailable=q.available;queuePartial=q.partial;recordsAvailable=l.available!==false;
 const lastEvent=ledger.events.at(-1)?.at;
 $('#swarm-source').textContent=(l.live?'Public ledger loaded from GitHub.':recordsAvailable?'GitHub ledger unavailable: showing the deployed snapshot.':'Review records could not be loaded.')+(lastEvent?' Latest recorded event: '+new Date(lastEvent).toLocaleString()+'.':'')+(q.available?(q.partial?' Queue shows at most 100 open issues; totals may be incomplete.':' Open queue loaded.'):' Open queue unavailable; queued count is unknown.')+' Refresh at most once per minute.';
 render();window.dispatchEvent(new CustomEvent('vibes-ledger-updated',{detail:l}));
 setTimeout(()=>{button.disabled=false},60000);
}
$('#refresh-swarm').onclick=()=>refresh();
$('#track-form').onsubmit=e=>{e.preventDefault();const value=$('#contributor').value.trim();if(validUsername(value)){try{localStorage.setItem('vibes-contributor',value)}catch{}}personal()};
$('#clear-contributor').onclick=()=>{$('#contributor').value='';try{localStorage.removeItem('vibes-contributor')}catch{}personal()};
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function motion(){ $('#evidence-wall').dataset.paused=String(paused);$('#toggle-wall').textContent=paused?'Play tile motion':'Pause tile motion';$('#toggle-wall').setAttribute('aria-pressed',String(paused)); }
$('#toggle-wall').onclick=()=>{paused=!paused;motion()};motion();
function currentTopic(){return $('#mission-topic').value||personContext}
function updateMission(){const kind=$('#mission-kind').value;$('#mission-description').textContent=MISSIONS[kind].description;$('#agent-prompt').value=missionPrompt({topic:currentTopic(),kind,brief:$('#mission-brief').value});$('#copy-status').textContent='';updateCredits()}
function updateCredits(){const topic=$('#mission-topic').value;const manifest=creditManifest(topic,provenance,ledger);$('#download-credits').disabled=!topic||!manifest.credits.length;$('#credit-status').textContent=topic?`${manifest.credits.length} source-linked contribution${manifest.credits.length===1?'':'s'} for ${topic}. Training influence: unknown.`:'Choose a recipe to export its credits.'}
$('#mission-topic').onchange=()=>{personContext='';$('#mission-context').hidden=true;updateMission()};$('#mission-kind').onchange=updateMission;$('#mission-brief').oninput=updateMission;
$('#copy-agent').onclick=async()=>{const t=$('#agent-prompt');try{await navigator.clipboard.writeText(t.value);$('#copy-status').textContent='Copied. Paste into your assistant to start.'}catch{$('.mission-preview').open=true;t.focus();t.select();$('#copy-status').textContent='Select and copy the instructions above.'}};
$('#download-credits').onclick=()=>{const manifest=creditManifest($('#mission-topic').value,provenance,ledger);const url=URL.createObjectURL(new Blob([JSON.stringify(manifest,null,2)+'\n'],{type:'application/json'}));const a=link('',url);a.download='vibes-recipe-credits.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#credit-status').textContent='Downloaded source-linked recipe credits. Keep only contributions applicable to your work.'};
updateMission();
const params=new URL(location.href).searchParams;
try{
 const r=await fetch('/notes/ingredients/technique-provenance.json');if(!r.ok)throw Error();provenance=await r.json();
 for(const record of provenance){const o=el('option',record.name);o.value=record.name;$('#mission-topic').append(o)}
 const topic=(params.get('topic')||'').slice(0,200);
 if(provenance.some(r=>r.name===topic))$('#mission-topic').value=topic;
 else if(topic){personContext=topic;$('#mission-context').hidden=false;$('#mission-context').textContent='Research context: '+topic;}
 updateMission();
}catch{$('#mission-context').hidden=false;$('#mission-context').textContent='Recipe list unavailable. Describe your question below; a general mission is still available.';$('#download-credits').disabled=true}
await refresh(true);
// Include accepted recipes with no animated tile in the selector as well.
for(const r of summarize(ledger).records){const p=r.proposal;if(r.state==='accepted'&&p?.target?.type==='recipe'&&![...$('#mission-topic').options].some(o=>o.value===p.target.name)){const o=el('option',p.target.name);o.value=p.target.name;$('#mission-topic').append(o)}}
if(params.get('context')==='recipe'&&[...$('#mission-topic').options].some(o=>o.value===params.get('topic'))){$('#mission-topic').value=params.get('topic');personContext='';$('#mission-context').hidden=true;updateMission()}
