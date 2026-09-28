import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL;
try{
 for(const [id,name] of [['mccarthy','Lauren Lee McCarthy'],['brain','Tega Brain'],['kogan','Gene Kogan']]){
  await page.goto(base+'/notes/ingredients/people.html?person='+id);await page.waitForSelector('dialog[open] #unmix-content .portrait');
  assert.equal(await page.locator('#sheet .card').count(),21);assert.equal(await page.locator('#detail-name').innerText(),name);
  assert.equal(await page.locator('#detail-dates').isVisible(),false);
  const img=page.locator('#unmix-content .portrait');await img.evaluate(i=>i.decode());assert.ok(await img.evaluate(i=>i.naturalWidth>0));
  await page.locator('#unmix-content a').filter({hasText:'View recipe ↗'}).first().waitFor();
  await page.locator('[data-step="1"]').click();assert.ok((await page.locator('#unmix-content').innerText()).length>60);
  const a=await page.locator('#detail-canvas').evaluate(c=>c.toDataURL());await page.locator('#scrub').fill('7');const b=await page.locator('#detail-canvas').evaluate(c=>c.toDataURL());assert.notEqual(a,b,'Each study changes over time');
  await page.locator('#close').click();await page.locator('#world-tab').click();assert.equal(await page.locator('.node').count(),21);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 assert.deepEqual(errors,[]);console.log('New People cards, portraits, animation, source links, network and mobile pass');
}finally{await browser.close()}
