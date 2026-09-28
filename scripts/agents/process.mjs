import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {parseProposal,reserve,appendEvent,verifyLedger,duplicate,POLICY} from './core.mjs';
import {fetchSource} from './sources.mjs';
import {review,buildCatalog} from './reviewer.mjs';
import {decide} from './core.mjs';
const REPO='yury-g/the-vibes-are-people',file='dist/agents/ledger.json';
if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!==REPO)throw Error('Paid reviews run only in the serialized repository workflow');
if(!process.env.OPENAI_API_KEY||!process.env.GH_TOKEN)throw Error('Reviewer credentials unavailable');
const git=(...args)=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']}).toString();
async function api(path,options={}){const r=await fetch('https://api.github.com/repos/'+REPO+path,{...options,headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json','Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('GitHub HTTP '+r.status);return r.status===204?null:r.json();}
// Latest remote state, never issue/PR code. Workflow concurrency serializes writers.
git('pull','--ff-only','origin','main');
let ledger=JSON.parse(await readFile(file,'utf8'));verifyLedger(ledger);
const graph=JSON.parse(await readFile('dist/connections/data.json','utf8'));
async function persist(next,message){
 verifyLedger(next);await writeFile(file,JSON.stringify(next,null,2)+'\n');git('add','--',file);git('commit','-m',message);git('push','origin','HEAD:main');ledger=next;
}
// Every paid attempt is reserved and pushed before either API call. A crash is
// visible as a reservation without a decision and is NEVER charged again.
async function finish(issue,event){await persist(appendEvent(ledger,{...event,type:'reviewed',issue:issue.number,at:new Date().toISOString()}),'Record ingredient review #'+issue.number);try{await api('/issues/'+issue.number,{method:'PATCH',body:JSON.stringify({state:'closed',state_reason:'completed'})})}catch{console.log('Review saved; issue close will be retried next run')}}
let queue=[];for(let page=1;page<=5;page++){const batch=await api('/issues?state=open&sort=created&direction=asc&per_page=100&page='+page);queue.push(...batch.filter(i=>!i.pull_request&&i.title.startsWith('[ingredient]')));if(batch.length<100)break}
let count=0,processed=0;
for(const issue of queue){
 if(processed++>=12)break;
 if(ledger.events.some(e=>e.issue===issue.number&&e.type==='reviewed')){try{await api('/issues/'+issue.number,{method:'PATCH',body:JSON.stringify({state:'closed',state_reason:'completed'})})}catch{}continue}
 if(ledger.events.some(e=>e.issue===issue.number&&e.type==='reserved')){await finish(issue,{status:'unresolved',confidence:0,reason:'A previous review was interrupted after its budget reservation. No paid retry was made. Submit a new issue to research this again.',reviews:[],sources:[]});continue}
 if(count>=3)break;
 let proposal;try{proposal=parseProposal(issue.body)}catch(e){await finish(issue,{status:'invalid',confidence:0,reason:e.message,reviews:[],sources:[]});continue}
 if(duplicate(proposal,graph,ledger)){await finish(issue,{status:'duplicate',confidence:3,reason:'This person, target and relationship already occur in the catalog. No AI charge.',proposal,reviews:[],sources:[]});continue}
 let next;try{next=reserve(ledger,{issue:issue.number,author:issue.user.login,proposal})}catch(e){console.log('Review waiting: '+e.message);continue}
 await persist(next,'Reserve bounded AI review #'+issue.number);count++;
 let sources=[],reviews=[];
 try{
  for(const url of proposal.sources)sources.push(await fetchSource(url));
  const catalog=buildCatalog(proposal,graph,ledger);
  for(let pass=1;pass<=2;pass++)reviews.push(await review(proposal,sources,catalog,pass));
  const decision=decide(reviews,sources);
  // Persist one <=25-word quote per source in total, not two overlapping copies.
  const evidence=sources.map((s,i)=>{const q=reviews.find(r=>r.sourceIndex===i&&s.text.includes(r.quote)&&r.quote.trim().split(/\s+/).length<=25)?.quote||'';return {url:s.url,sha256:s.sha256,fetchedAt:s.fetchedAt,truncated:s.truncated,excerpt:q}});
  const safeReviews=reviews.map(({quote,...r})=>r);
  const estimatedUSD=reviews.reduce((sum,r)=>sum+((r.usage?.prompt_tokens||0)*POLICY.inputPerMillion+(r.usage?.completion_tokens||0)*POLICY.outputPerMillion)/1e6,0);
  await finish(issue,{...decision,reason:decision.status==='accepted'?'Both AI checks found direct source support. AI review can still be wrong; follow the evidence.':'The AI checks did not both establish direct support. This claim has not entered the catalog.',reviews:safeReviews,sources:evidence,estimatedUSD});
 }catch(e){await finish(issue,{status:'unresolved',confidence:0,reason:String(e.message).slice(0,200),reviews:reviews.map(({quote,...r})=>r),sources:sources.map(({text,...s})=>s)});}
}
console.log('Ingredient queue processed. Monthly cap: $8 reserved; at most two bounded AI calls per reservation.');
