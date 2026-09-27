import assert from 'node:assert/strict';
import {UltravioletKoi} from '../dist/iterations/ultraviolet-best/koi.js';
import {UltravioletSchool} from '../dist/iterations/ultraviolet-best/school.js';
import {SpatialSchool} from '../dist/iterations/brain/school.js';
import {fish,glyph} from './size-hunt.mjs';
const e=fish();Object.setPrototypeOf(e,UltravioletKoi.prototype);e.articulate(0);e.vx=108;e.vy=0;e.time=10;
const near=glyph(1,335,321,16),target=glyph(2,480,300,60),far=glyph(3,670,100,16);e.prey=target;e.letters=[near,target,far];
const school=Object.create(UltravioletSchool.prototype);Object.assign(school,{engine:e,visible:e.letters,hash:new SpatialSchool()});e.school=school;
for(let i=0;i<12;i++){e.time+=1/60;e.updateMinnows(1/60);}
assert.equal(near.state,'fleeing','A close approaching fish scares a non-target bystander before contact');
assert.equal(far.state,'home','Distant letters do not flee when another is selected');assert.equal(far.x,far.hx);assert.equal(far.y,far.hy);
assert.equal(target.state,'home','Selection alone cannot trigger remote fleeing');
console.log('Close approach scares bystanders; distant selected and unselected letters remain home.');
