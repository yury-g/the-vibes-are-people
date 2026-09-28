import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:390,height:844}});const base=process.env.TEST_URL||'http://127.0.0.1:8879';
const pixels=()=>p.locator('#study').evaluate(c=>c.toDataURL());
try{
 await p.goto(base+'/vocabulary/#flow');await p.locator('#terms button').first().waitFor();
 const before=await pixels();await p.waitForTimeout(350);assert.notEqual(await pixels(),before,'Flow moves without interaction');
 await p.getByRole('button',{name:'Pause loop',exact:true}).click();const paused=await pixels();await p.waitForTimeout(250);assert.equal(await pixels(),paused,'Pause freezes the frame');
 await p.getByRole('button',{name:'Restart loop',exact:true}).click();const zero=await pixels();
 for(const id of ['density','scale','irregularity']){await p.locator('#'+id).fill('80');assert.notEqual(await pixels(),zero,id+' changes the paused pattern');await p.locator('#'+id).fill(id==='irregularity'?'35':'45')}
 assert.equal(await pixels(),zero,'Restoring settings reproduces the frame');
 for(const term of ['Flow','Cohesion','Interference','Branching','Grain','Subdivision']){await p.getByRole('button',{name:term,exact:true}).click();const a=await pixels();await p.getByRole('button',{name:'Play loop',exact:true}).click();await p.waitForTimeout(180);await p.getByRole('button',{name:'Pause loop',exact:true}).click();assert.notEqual(await pixels(),a,term+' moves')}
 await p.getByRole('button',{name:'Flow',exact:true}).click();
 async function advance(duration){await p.locator('#loop-seconds').fill(String(duration));await p.getByRole('button',{name:'Restart loop',exact:true}).click();await p.getByRole('button',{name:'Play loop',exact:true}).click();await p.waitForTimeout(300);await p.getByRole('button',{name:'Pause loop',exact:true}).click();return Number(await p.locator('#study').getAttribute('data-phase'))}
 const fast=await advance(4),slow=await advance(20);assert.ok(fast>slow*2,'Duration changes loop speed');
 await p.emulateMedia({reducedMotion:'reduce'});await p.reload();await p.locator('#terms button').first().waitFor();assert.equal(await p.locator('#play-loop').innerText(),'Play loop');const reduced=await pixels();await p.waitForTimeout(200);assert.equal(await pixels(),reduced);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:'/tmp/vocabulary-loop-mobile.png'});
 console.log('PASS: six live loops, stable pause/reset, three visible controls, loop speed, reduced motion and mobile fit.');
}finally{await b.close()}
