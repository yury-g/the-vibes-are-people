import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),out=new URL('dist/research/project/files/',root);
await mkdir(out,{recursive:true});
const files=['research/PORTRAITS.md','research/portrait-coverage.json','research/portrait-prompts.json','research/INGREDIENTS-EXPANSION.md','dist/notes/ingredients/people-profiles.json','dist/notes/ingredients/portrait-map.json','research/LANGUAGES.md','research/language-tools.json','README.md','CONTRIBUTING.md','research/CONNECTIONS.md','research/checked-relationships.json','research/connections-coverage.json','research/eyebeam-connections.json','research/institutional-archive-sources.md','research/eyebeam-expanded-source-map.md','research/eyebeam-application-language.md','dist/connections/data.json','dist/notes/ingredients/technique-provenance.json','scripts/build-connections.mjs','scripts/export-research.mjs'];
const manifest=[];
for(const source of files){const content=await readFile(new URL(source,root)),name=source.split('/').at(-1);await writeFile(new URL(name,out),content);manifest.push({source,file:'files/'+name,bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')})}
await writeFile(new URL('../manifest.json',out),JSON.stringify({repository:'https://github.com/yury-g/the-vibes-are-people',files:manifest},null,2)+'\n');
console.log(`Exported ${files.length} public research files with checksums`);
