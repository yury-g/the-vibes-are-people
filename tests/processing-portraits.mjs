import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const portraits=JSON.parse(await readFile(new URL('../dist/notes/ingredients/portrait-map.json',import.meta.url)));
const names=['Muriel Cooper','John Maeda','Xin Xin','R. Luke DuBois','Kate Hollenbach','Cassie Tarakajian','Qianqian Ye'];
for(const name of names){
 const p=portraits[name];assert.ok(p,`${name} needs a portrait`);
 assert.equal(p.kind,'photograph',`${name} must use a source photograph`);
 assert.ok(p.page.startsWith('https://')&&p.original.startsWith('https://'));
 assert.ok(p.credit&&p.rights&&p.checked&&p.identityEvidence);
 assert.ok(!p.generator,'No generated portraits for the new people');
 assert.ok((await stat(new URL('../dist'+p.src,import.meta.url))).size>1000);
}
assert.match(portraits['Muriel Cooper'].credit,/Carl Zahn/);
console.log('All 7 new Processing lineage people have local source photographs and provenance.');
