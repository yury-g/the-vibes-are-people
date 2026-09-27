import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const base=process.env.TEST_URL||'http://127.0.0.1:8775';
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base);
 assert.equal(await page.getByRole('button',{name:'Play tour',exact:true}).count(),1,'Studio offers a visitor-started tour');
 const people=page.frameLocator('#people iframe'),recipes=page.frameLocator('#ingredients iframe');
 await people.locator('.card').first().waitFor();await recipes.locator('.people-preview').first().waitFor();
 assert.equal(await page.locator('#tour-bar').isVisible(),false);
 await page.clock.install();
 await page.getByRole('button',{name:'Play tour',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='playing');
 assert.match(await page.locator('#tour-position').innerText(),/1 \/ 11/);
 await page.clock.fastForward(13000);await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.step==='1');
 await page.getByRole('button',{name:'Pause tour',exact:true}).click();
 await page.clock.fastForward(60000);assert.equal(await page.locator('#tour-bar').getAttribute('data-step'),'1');
 await page.getByRole('button',{name:'Next stop',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='paused');
 assert.equal(await people.locator('#detail-name').innerText(),'Ken Perlin');
 await page.getByRole('button',{name:'Resume tour',exact:true}).click();
 // A real interaction inside the iframe pauses the driver without interrupting exploration.
 await people.locator('#unmix-open').click();
 assert.equal(await page.locator('#tour-bar').getAttribute('data-state'),'paused');
 await page.clock.fastForward(60000);assert.equal(await page.locator('#tour-bar').getAttribute('data-step'),'2');
 for(let i=3;i<11;i++){
  await page.getByRole('button',{name:'Next stop',exact:true}).click();
  await page.waitForFunction(n=>document.querySelector('#tour-bar').dataset.step===String(n)&&document.querySelector('#tour-bar').dataset.state==='paused',i);
  if(i===3)assert.equal(await people.locator('[data-step="1"]').getAttribute('aria-pressed'),'true');
  if(i===5)assert.equal(await recipes.locator('#detail-title').innerText(),'Domain warping');
  if(i===6)assert.ok(await recipes.locator('#human-ingredients .ingredient-person').count());
  if(i===7)assert.match(await recipes.locator('#detail-title').innerText(),/Reaction/);
  if(i===8)assert.equal(await people.locator('#detail-name').innerText(),'Karl Sims');
  if(i===9)assert.equal(await people.locator('#network').isVisible(),true);
 }
 await page.getByRole('button',{name:'Resume tour',exact:true}).click();await page.clock.fastForward(20000);
 await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='finished');
 await page.getByRole('button',{name:'Explore freely',exact:true}).click();assert.equal(await page.locator('#tour-bar').isVisible(),false);
 await page.setViewportSize({width:320,height:740});
 await page.getByRole('button',{name:'Play tour',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='playing');
 assert.ok(await page.locator('#tour-bar').evaluate(e=>e.getBoundingClientRect().top>=0),'Mobile captions and controls remain in view');
 await page.getByRole('button',{name:'Explore freely',exact:true}).click();
 await page.getByRole('button',{name:'Play tour',exact:true}).click();
 await page.getByRole('button',{name:'Explore freely',exact:true}).click();
 await page.clock.fastForward(60000);assert.equal(await page.locator('#tour-bar').isVisible(),false,'Stopping cancels pending preparation');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await people.locator('.card').first().waitFor();await recipes.locator('.people-preview').first().waitFor();
 await page.getByRole('button',{name:'Play tour',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='playing');
 assert.match(await people.locator('#motion').innerText(),/Play motion/,'Tour respects reduced-motion artwork setting');
 await page.getByRole('button',{name:'Explore freely',exact:true}).click();
 await page.route('**/technique-provenance.json',route=>route.fulfill({status:503,body:'Unavailable'}));
 await page.reload();await page.getByRole('button',{name:'Play tour',exact:true}).click();await page.clock.fastForward(13000);
 await page.waitForFunction(()=>document.querySelector('#tour-bar').dataset.state==='paused');
 assert.match(await page.locator('#tour-caption').innerText(),/still loading/);
 await page.getByRole('button',{name:'Explore freely',exact:true}).click();
 // The deliberately failed provenance request is reported by its existing adapter.
 assert.ok(errors.every(e=>/Provenance unavailable/.test(e)));console.log('PASS: opt-in tour, automatic advance, pause/resume, real-input takeover, all eleven stops, completion, cancellation and mobile.');
}finally{await browser.close()}
