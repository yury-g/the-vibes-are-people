import {ledgerRequest} from './overlay.js';
const el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
const a=(text,url)=>{const e=el('a',text);e.href=url;e.rel='noopener noreferrer';return e};
document.querySelector('#copy-agent').onclick=async()=>{const t=document.querySelector('#agent-prompt');try{await navigator.clipboard.writeText(t.value);document.querySelector('#copy-status').textContent='Copied'}catch{t.select();document.querySelector('#copy-status').textContent='Select and copy the instruction above'}};
const {data,live}=await ledgerRequest,month=new Date().toISOString().slice(0,7);
const reservations=data.events.filter(e=>e.type==='reserved'&&e.at.startsWith(month));
document.querySelector('#budget-status').textContent=`${reservations.length} / 40 attempts reserved this month · $${(reservations.length*.2).toFixed(2)} / $8.00 reserved.`;
document.querySelector('#feed-status').textContent=live?'Latest public GitHub records. Updates may take a few minutes to appear.':'GitHub could not be reached. Showing the last deployed snapshot.';
const host=document.querySelector('#agent-activity');const issues=[...new Set(data.events.map(e=>e.issue))].reverse().slice(0,40);
for(const id of issues){const r=data.events.find(e=>e.issue===id&&e.type==='reserved'),d=data.events.findLast(e=>e.issue===id&&e.type==='reviewed'),p=r?.proposal||d?.proposal;const card=el('article','');card.append(el('span',d?.status||'Review reserved'));card.firstChild.className='agent-status';card.append(el('h3',p?`${p.person} → ${p.target.name}`:`Submission #${id}`));if(p)card.append(el('p',p.claim));card.append(el('p',d?.reason||'Waiting for review completion. The budget reservation is already recorded.'),a('Submission #'+id,'https://github.com/yury-g/the-vibes-are-people/issues/'+id));if(d?.status==='accepted')card.append(' · ',a('View in catalog','/connections/?person='+encodeURIComponent(p.person)+'#people'));
for(const s of d?.sources||[]){if(!/^https:\/\//.test(s.url))continue;card.append(el('p',''),a('Source ↗',s.url));if(s.excerpt)card.append(el('blockquote',s.excerpt))}for(const review of d?.reviews||[])card.append(el('p',`AI check · evidence ${review.confidence}/3: ${review.reason}`));host.append(card)}
if(!issues.length)host.append(el('p','No submissions reviewed yet. Be the first to add a sourced connection.'));
