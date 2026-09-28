export const nodes=g=>[...g.people,...g.entities,...g.recipes];
export const relations=(g,id)=>g.relationships.filter(r=>r.person===id||r.target===id);
export function overlaps(g){
 return [...g.entities,...g.recipes].map(node=>({...node,people:[...new Set(g.relationships.filter(r=>r.target===node.id&&!['inferred','tentative'].includes(r.review)).map(r=>r.person))]})).filter(n=>n.people.length>1).sort((a,b)=>b.people.length-a.people.length||a.name.localeCompare(b.name));
}
export function gaps(g){
 const has=(p,test)=>relations(g,p.id).some(test);
 return [
 {id:'languages',label:'People without a documented language or tool link',people:g.people.filter(p=>!has(p,r=>r.kind==='language/tool'&&r.confidence===3)).map(p=>p.id)},
 {id:'language-inferences',label:'People with language associations awaiting direct evidence',people:g.people.filter(p=>has(p,r=>r.kind==='language/tool'&&r.confidence<3)).map(p=>p.id)},
 {id:'affiliations',label:'People without a checked institutional or education link',people:g.people.filter(p=>!has(p,r=>r.review==='checked'&&['residency','education','teaching','service'].includes(r.kind))).map(p=>p.id)},
 {id:'placement',label:'People awaiting a recipe placement',people:g.people.filter(p=>p.placement==='To be assigned').map(p=>p.id)},
 {id:'review',label:'People with credits or paths still awaiting a source recheck',people:g.people.filter(p=>has(p,r=>r.review==='imported')).map(p=>p.id)}
 ];
}
