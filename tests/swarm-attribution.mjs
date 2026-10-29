import assert from 'node:assert/strict';
import {summarize,missionPrompt,creditManifest,safeURL,validUsername} from '../dist/agents/swarm.js';
const proposal={person:'Ada Example',target:{name:'Flow',type:'recipe'},role:'Author',claim:'Documented specific contribution',sources:['https://example.org/source']};
const ledger={version:1,events:[
 {type:'reserved',issue:1,author:'Maker',proposal,at:'2026-10-01T00:00:00Z'},
 {type:'reviewed',issue:1,status:'accepted',at:'2026-10-01T00:01:00Z'},
 {type:'reserved',issue:2,author:'Other',proposal,at:'2026-10-01T00:02:00Z'},
 {type:'reviewed',issue:2,status:'unresolved',at:'2026-10-01T00:03:00Z'},
 {type:'reserved',issue:3,author:'Maker',proposal,at:'2026-10-01T00:04:00Z'},
 {type:'reviewed',issue:1,status:'unresolved',at:'2026-10-01T00:05:00Z'},
 {type:'reviewed',issue:99,status:'accepted',at:'2026-10-01T00:05:00Z'}]};
const queue=[{number:3,title:'[ingredient] existing',user:{login:'Maker'}},{number:4,title:'[ingredient] next',user:{login:'Maker'}},{number:5,title:'unrelated',user:{login:'Other'}},{number:6,title:'[ingredient] PR',pull_request:{},user:{login:'Other'}}];
const all=summarize(ledger,queue);assert.equal(all.accepted,0);assert.equal(all.unresolved,2);assert.equal(all.reviewing,1);assert.equal(all.queued,1);assert.equal(all.total,4);
assert.equal(summarize(ledger,queue,'maker').total,3);assert.equal(summarize(ledger,queue,'unknown').total,0);
assert.equal(summarize(null,null).total,0);
assert.equal(safeURL('javascript:alert(1)'),false);assert.equal(safeURL('https://user:pass@example.org'),false);assert.equal(safeURL('https://example.org'),true);
assert.equal(validUsername('yury-g'),true);assert.equal(validUsername('bad/name'),false);
const prompt=missionPrompt({topic:'Curl noise',kind:'history',brief:'A flowing study'});assert.match(prompt,/Curl noise/);assert.match(prompt,/five minutes/);assert.match(prompt,/duplicate/i);assert.match(prompt,/training/i);
const provenance=[{name:'Flow',caveat:'Selected contributions only.',contributors:[{name:'Human',role:'Author',detail:'Specific work',url:'https://example.org/paper'},{name:'Unsafe',url:'javascript:alert(1)'}]}];
const manifest=creditManifest('Flow',provenance,ledger);assert.equal(manifest.credits.length,1);assert.equal(manifest.trainingInfluence,'unknown');assert.equal(manifest.credits[0].person,'Human');assert.match(manifest.scope,/not.*proof/i);
ledger.events.push({type:'reviewed',issue:1,status:'accepted',at:'2026-10-01T00:06:00Z'});
assert.equal(creditManifest('Flow',provenance,ledger).credits.length,2);
assert.equal(creditManifest('Missing',provenance,ledger).credits.length,0);
console.log('Swarm status, latest decisions, deduplication, personal totals, missions and credits passed');
const {loadLedger}=await import('../dist/agents/overlay.js');
const originalFetch=globalThis.fetch;
try {
 let calls=0;
 globalThis.fetch=async()=>{calls++;if(calls===1)throw Error('offline');return {ok:true,json:async()=>({version:1,events:[]})}};
 assert.deepEqual(await loadLedger(),{data:{version:1,events:[]},live:false,available:true});
 globalThis.fetch=async()=>({ok:true,json:async()=>({wrong:'schema'})});
 assert.deepEqual(await loadLedger(),{data:{version:1,events:[]},live:false,available:false});
} finally {globalThis.fetch=originalFetch}
console.log('Offline ledger fallback distinguishes empty records from unavailable data');
