import {createHash} from 'node:crypto';
export const POLICY={monthlyUSD:8,reservationUSD:.2,maxMonthly:40,model:'gpt-4.1-mini-2025-04-14',maxRequestBytes:65000,maxOutputTokens:1200,pricingValidBefore:'2026-12-01',inputPerMillion:.4,outputPerMillion:1.6};
export const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
export const normalize=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}+#]/gu,'');
const text=(s,min,max)=>typeof s==='string'&&s.trim()===s&&s.length>=min&&s.length<=max&&!/[<>\x00-\x1f\x7f]/.test(s);
export function publicURL(s){const u=new URL(s);if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||!u.hostname.includes('.')||u.hostname.endsWith('.local')||u.hostname.endsWith('.internal')||/^\d+\./.test(u.hostname)||u.hostname.includes(':'))throw Error('Source must be a public HTTPS hostname');return u;}
export function validateProposal(p){
 if(!p||typeof p!=='object'||Object.keys(p).sort().join(',')!=='claim,kind,person,role,sources,target,version'||p.version!==1)throw Error('Use the version 1 proposal schema');
 if(!text(p.person,2,100)||!text(p.role,2,100)||!text(p.claim,20,1200))throw Error('Invalid person, role or claim');
 if(!p.target||Object.keys(p.target).sort().join(',')!=='name,type'||!text(p.target.name,1,100)||!normalize(p.target.name)||!['recipe','institution','language','tool'].includes(p.target.type))throw Error('Invalid target');
 if(!['contribution','residency','teaching','education','funding','exhibition','language/tool'].includes(p.kind))throw Error('Invalid relationship kind');
 if((p.target.type==='recipe')!==(p.kind==='contribution')||(['language','tool'].includes(p.target.type))!==(p.kind==='language/tool'))throw Error('Relationship kind does not match target type');
 if(!Array.isArray(p.sources)||p.sources.length<1||p.sources.length>2||new Set(p.sources).size!==p.sources.length)throw Error('Use one or two distinct sources');
 for(const s of p.sources){if(!text(s,10,800))throw Error('Invalid source');publicURL(s)}
 return p;
}
export function parseProposal(body){if(typeof body!=='string'||Buffer.byteLength(body)>8000)throw Error('Proposal exceeds 8 KB');const match=body.match(/```json\s*([\s\S]*?)```/);return validateProposal(JSON.parse(match?match[1]:body));}
export function appendEvent(ledger,event){const e={...event,previous:ledger.events.at(-1)?.hash||null};return {...ledger,events:[...ledger.events,{...e,hash:hash(e)}]};}
export function verifyLedger(l){if(l.version!==1||!Array.isArray(l.events))throw Error('Invalid ledger');let prev=null;for(const e of l.events){const {hash:h,...rest}=e;if(e.previous!==prev||hash(rest)!==h)throw Error('Ledger hash mismatch');prev=h}return true;}
export function reserve(l,{issue,author,proposal},at=new Date().toISOString()){
 verifyLedger(l);if(at.slice(0,10)>=POLICY.pricingValidBefore)throw Error('Pricing policy expired; no paid reviews until refreshed');
 if(l.events.some(e=>e.issue===issue&&e.type==='reserved'))throw Error('This issue already has a reservation; never retry paid calls');
 const used=l.events.filter(e=>e.type==='reserved'&&e.at.slice(0,7)===at.slice(0,7));
 if(used.length>=POLICY.maxMonthly)throw Error('Monthly budget exhausted');
 if(used.filter(e=>e.author===author&&e.at.slice(0,10)===at.slice(0,10)).length>=2)throw Error('Daily contributor allowance exhausted');
 return appendEvent(l,{type:'reserved',at,issue,author,proposal,proposalHash:hash(proposal),reservedUSD:POLICY.reservationUSD,model:POLICY.model});
}
export function decide(reviews,sources){
 const valid=r=>r&&r.supported===true&&r.inScope===true&&r.identityCertain===true&&r.duplicate===false&&r.confidence===3&&typeof r.quote==='string'&&r.quote.trim().split(/\s+/).length<=25&&r.quote.trim().length>=12&&sources[r.sourceIndex]?.text.includes(r.quote.trim());
 return {status:reviews.length===2&&reviews.every(valid)?'accepted':'unresolved',confidence:reviews.length===2?Math.min(...reviews.map(r=>Number.isInteger(r.confidence)?r.confidence:0)):0};
}
export function duplicate(p,graph,ledger){
 const records=graph.relationships.map(r=>({person:graph.people.find(x=>x.id===r.person)?.name,target:[...graph.recipes,...graph.entities].find(x=>x.id===r.target)?.name,kind:r.kind}));
 for(const e of ledger.events.filter(e=>e.type==='reviewed'&&e.status==='accepted')){const q=ledger.events.find(r=>r.type==='reserved'&&r.issue===e.issue)?.proposal;if(q)records.push({person:q.person,target:q.target.name,kind:q.kind})}
 return records.some(r=>r.person&&r.target&&normalize(r.person)===normalize(p.person)&&normalize(r.target)===normalize(p.target.name)&&r.kind===p.kind);
}
