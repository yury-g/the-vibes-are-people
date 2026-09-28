import {readFile,writeFile} from 'node:fs/promises';
const config=JSON.parse(await readFile('research/code-profiles.json','utf8'));
let previous={profiles:[]};try{previous=JSON.parse(await readFile('dist/connections/code-projects.json','utf8'))}catch{}
const out={checked:new Date().toISOString(),profiles:[],archives:config.archives,personArchives:config.personArchives||[],studioAssociations:config.studioAssociations||[]};
for(const p of config.profiles){
 try{
 const r=await fetch(`https://api.github.com/users/${encodeURIComponent(p.account)}/repos?type=owner&sort=pushed&direction=desc&per_page=30`,{headers:{Accept:'application/vnd.github+json',...(process.env.GH_TOKEN?{Authorization:'Bearer '+process.env.GH_TOKEN}:{})},signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);
 const list=await r.json();out.profiles.push({...p,checked:out.checked,projects:list.filter(r=>!r.fork&&!r.archived).slice(0,3).map(r=>({name:r.name,url:r.html_url,description:r.description||'',pushedAt:r.pushed_at,language:r.language,license:r.license?.spdx_id&&r.license.spdx_id!=='NOASSERTION'?r.license.spdx_id:null}))});
 }catch{const old=previous.profiles.find(q=>q.person===p.person);out.profiles.push(old?{...old,refreshUnavailable:true}:{...p,checked:null,projects:[],refreshUnavailable:true})}
}
await writeFile('dist/connections/code-projects.json',JSON.stringify(out,null,2)+'\n');console.log(`Refreshed code projects for ${out.profiles.filter(p=>!p.refreshUnavailable).length}/${out.profiles.length} confirmed accounts`);
