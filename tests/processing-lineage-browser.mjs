import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL||'http://127.0.0.1:8891';
async function open(id){await page.goto(base+'/connections/?node='+id+'#people');await page.locator('.connection-card').first().waitFor();}
try{
 await open('entity-processing-foundation');
 assert.match(await page.locator('#connection-context').innerText(),/organization.*Supports open-source/s);
 assert.equal(await page.locator('.connection-card h3').filter({hasText:'Processing Foundation'}).count(),0);
 for(const name of ['Cassie Tarakajian','Xin Xin','Qianqian Ye','Kate Hollenbach','R. Luke DuBois','Taeyoon Choi','Casey Reas','Ben Fry','Daniel Shiffman'])assert.equal(await page.locator('.connection-card h3').getByRole('link',{name,exact:true}).count(),1,name);
 await page.locator('#connection-context').getByRole('link',{name:'Processing',exact:true}).click();
 await page.locator('#connection-context h2').waitFor();
 assert.match(await page.locator('#connection-context').innerText(),/Stewarded by · Processing Foundation/);
 assert.match(await page.locator('#connection-context').innerText(),/Reinterpreted for the web as · p5.js/);
 assert.equal(await page.locator('.connection-card h3').getByRole('link',{name:'R. Luke DuBois',exact:true}).count(),1,'Tool pages include pedagogical roles');
 await page.locator('#connection-context').getByRole('link',{name:'p5.js',exact:true}).click();
 await page.locator('#person-qianqian-ye').waitFor();
 assert.match(await page.locator('#connection-context').innerText(),/Reinterprets · Processing/);
 assert.match(await page.locator('#person-qianqian-ye').innerText(),/accessibility/i);
 await open('person-john-maeda');
 assert.match(await page.locator('#person-john-maeda').innerText(),/Continues research associated with · Muriel Cooper/);
 assert.match(await page.locator('#person-casey-reas').innerText(),/Studied with · John Maeda/);
 assert.equal(await page.locator('#person-casey-reas .inline-source[aria-label*="Studied with"]').count(),1);
 assert.match(await page.locator('#person-john-maeda').innerText(),/Advised · Casey Reas/);
 await open('entity-critical-computation');
 assert.match(await page.locator('#connection-context').innerText(),/Teaches with · p5.js/);
 assert.match(await page.locator('#person-xin-xin').innerText(),/code, critique and design/i);
 await page.setViewportSize({width:320,height:740});
 for(const id of ['entity-processing-foundation','entity-p5-js','person-john-maeda','person-cassie-tarakajian']){
  await open(id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No phone overflow: '+id);
 }
 await page.goto(base+'/notes/ingredients/techniques.html');
 await page.getByRole('link',{name:'Processing Foundation’s tools, teachers and creative-coding lineage'}).waitFor();
 await page.waitForFunction(()=>document.body.dataset.connectionSearch==='ready');
 await page.locator('#people-search').fill('Processing Foundation');
 const count=await page.locator('.tile:visible').count();assert.ok(count>0&&count<40,'Existing recipe search discovers checked foundation links');
 assert.deepEqual(errors,[]);
 console.log('PASS: organization → tool → people, reverse roles, inclusion, recipe discovery and mobile layout');
}finally{await browser.close()}
