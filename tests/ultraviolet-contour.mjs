import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
for(const file of ['app.js','body.js','turns.js','water.js','geometry.js','skin.js'])assert.equal(readFileSync(`dist/iterations/ultraviolet-contour/${file}`,'utf8'),readFileSync(`dist/history/archive/v23/iterations/ultraviolet-best/${file}`,'utf8'),`${file}: preserve V22 behavior exactly`);
for(const test of ['ultraviolet-integration.mjs','ultraviolet-flow.mjs']){
 const r=spawnSync(process.execPath,[`tests/${test}`],{env:{...process.env,KOI_STUDY:'ultraviolet-contour'},encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);console.log(r.stdout);
}
console.log('Contour renderer stays inside the complete collision silhouette; V22 controller, optical current and input remain identical.');
