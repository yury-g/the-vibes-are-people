export const LEDGER_URL='https://raw.githubusercontent.com/yury-g/the-vibes-are-people/main/dist/agents/ledger.json';
const norm=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}+#]/gu,'');
const safeURL=s=>{try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}};
export function acceptedClaims(ledger){
 if(ledger?.version!==1||!Array.isArray(ledger.events))return [];
 return ledger.events.filter(e=>e.type==='reviewed'&&e.status==='accepted').flatMap(e=>{
 const reservation=ledger.events.find(r=>r.type==='reserved'&&r.issue===e.issue),p=reservation?.proposal;
 if(!p||typeof p.person!=='string'||typeof p.target?.name!=='string'||typeof p.claim!=='string'||!['recipe','institution','language','tool'].includes(p.target.type)||!Array.isArray(p.sources)||!p.sources.every(safeURL))return [];
 return [{...p,issue:e.issue,at:e.at,confidence:e.confidence,review:e}];
 });
}
export function mergeLedger(base,ledger){
 const g=structuredClone(base);for(const p of acceptedClaims(ledger)){
 let person=g.people.find(n=>norm(n.name)===norm(p.person));if(!person){person={id:'person-agent-'+norm(p.person),name:p.person,study:null,placement:p.target.type==='recipe'?'In Ingredients':'To be assigned'};g.people.push(person)}
 const list=p.target.type==='recipe'?g.recipes:g.entities;let target=list.find(n=>norm(n.name)===norm(p.target.name));if(!target){target={id:(p.target.type==='recipe'?'recipe':'entity')+'-agent-'+norm(p.target.name),name:p.target.name,agentAdded:true};if(['language','tool'].includes(p.target.type))target.category=p.target.type==='language'?'Language':'Tool';list.push(target)}
 if(g.relationships.some(r=>r.person===person.id&&r.target===target.id&&r.kind===p.kind))continue;
 if(p.target.type==='recipe')person.placement='In Ingredients';
 const r={person:person.id,target:target.id,kind:p.kind,role:p.role,detail:p.claim,source:p.sources[0],sourceLabel:'Agent-submitted source',dates:null,checked:p.at.slice(0,10),review:'checked',agentReview:true,issue:p.issue};
 if(p.kind==='language/tool')Object.assign(r,{confidence:3,context:p.claim,rationale:'Two AI source checks; inspect evidence.',evidence:p.sources.map(url=>({label:'Source',url}))});g.relationships.push(r);
 }return g;
}
export async function loadLedger(){
 try{const r=await fetch(LEDGER_URL,{signal:AbortSignal.timeout(4000),cache:'no-cache'});if(!r.ok)throw Error();const data=await r.json();if(data.version!==1||!Array.isArray(data.events))throw Error();return {data,live:true}}
 catch{try{const r=await fetch('/agents/ledger.json');if(!r.ok)throw Error();return {data:await r.json(),live:false}}catch{return {data:{version:1,events:[]},live:false}}}
}
export const ledgerRequest=typeof window!=='undefined'?loadLedger():null;
