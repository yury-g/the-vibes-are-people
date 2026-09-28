const data=fetch('https://raw.githubusercontent.com/yury-g/the-vibes-are-people/main/dist/connections/code-projects.json',{signal:AbortSignal.timeout(4000),cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).catch(()=>fetch('/connections/code-projects.json').then(r=>r.ok?r.json():null).catch(()=>null));
const el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
const link=(text,url)=>{const e=el('a',text);e.href=url;e.target='_blank';e.rel='noopener noreferrer';return e};
export function attachCodeProjects(host,name,{compact=false}={}){
 const box=el('section','');box.className='code-projects';host.append(box);
 data.then(d=>{if(!d)return;const p=d.profiles.find(p=>p.person===name);box.append(el('h4','Code & projects'));
 if(!p){const archives=(d.personArchives||[]).filter(a=>a.person===name);for(const a of archives){box.append(link(a.name+' ↗',a.url),el('p',a.description),el('small',a.recentEvidence||'Historical reference; recent activity not verified.'),el('small',a.licenseNote))}for(const a of (d.studioAssociations||[]).filter(a=>a.person===name))box.append(link(a.studio+' · studio archive ↗',a.archive),el('small',a.limitation),link('Association evidence ↗',a.source));if(!archives.length&&!(d.studioAssociations||[]).some(a=>a.person===name))box.append(link('Help locate a verified code archive ↗','/agents/'));return}
 box.append(link('GitHub repositories ↗','https://github.com/'+p.account+'?tab=repositories'),document.createTextNode(' · '),link('Account evidence ↗',p.source));
 for(const r of p.projects.slice(0,compact?1:3)){const item=el('p','');item.append(link(r.name+' ↗',r.url));if(r.description)item.append(el('span',r.description));item.append(el('small',`Repository push ${r.pushedAt.slice(0,10)}${r.language?' · '+r.language:''} · ${r.license?'License: '+r.license:'License not identified'}`));box.append(item)}
 box.append(el('small',p.checked?`Snapshot ${p.checked.slice(0,10)}${p.refreshUnavailable?' · refresh unavailable':''}. Repository activity does not establish who authored a change.`:'Repository details unavailable. Follow the account link.'));
 });return box;
}
if(document.querySelector('#code-archives'))data.then(d=>{if(!d)return;const host=document.querySelector('#code-archives');for(const r of d.archives){const p=el('p','');p.append(link(r.name+' ↗',r.url),document.createTextNode(' · '+r.description));host.append(p)}});
