import assert from 'node:assert/strict';
import {makeSkin} from '../dist/iterations/art-koi/skin.js';
const s=makeSkin([{a:{x:0,y:0},b:{x:20,y:0},r:8},{a:{x:20,y:0},b:{x:30,y:0},r:18}]);
assert(s.query(24,15).clearance<0,'fin silhouette participates');
assert(s.query(70,0).clearance>0,'distant glyph remains clear');
for(let x=-8;x<48;x+=4)for(let y=-18;y<18;y+=3){const p=s.project(x,y,4);assert(p.clearance>=0,'projection clears full fish');}
console.log('Art skin: fin envelope and planar projection pass');
