import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:320,height:740}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL;
try{
 let graphRequests=0;page.on('request',r=>{if(r.url().endsWith('/connections/data.json'))graphRequests++});
 await page.goto(base+'/notes/ingredients/techniques.html');await page.waitForSelector('body[data-connection-search=ready]');
 assert.equal(graphRequests,1,'Share one graph request');
 await page.locator('#people-search').fill('Eyebeam');assert.equal(await page.locator('.tile:visible').count(),5);
 await page.locator('#people-search').fill('Processing');assert.ok(await page.locator('.tile:visible').count()>0);
 await page.goto(base+'/notes/ingredients/techniques.html?recipe='+encodeURIComponent('Moiré'));
 await page.waitForSelector('dialog[open] #human-ingredients');assert.equal(await page.locator('#detail-title').innerText(),'Moiré');
 await page.waitForSelector('#human-ingredients .people-connections a');
 assert.equal(await page.locator('#human-ingredients .people-connections a[href*="node=recipe-moire"]').count(),0,'No repeated current recipe in overlay');
 const link=page.locator('#human-ingredients a').filter({hasText:'View recipe ↗'}).first();await link.click();
 await page.waitForSelector('dialog[open] #human-ingredients');assert.notEqual(await page.locator('#detail-title').innerText(),'Moiré');
 assert.equal(await page.locator('#detail').evaluate(e=>e.scrollWidth>e.clientWidth),false);
 await page.goto(base+'/notes/ingredients/techniques.html?recipe=Space%20colonization');await page.waitForSelector('dialog[open] #human-ingredients .evidence-status');assert.match(await page.locator('#human-ingredients .ingredient-person').filter({hasText:'Adam Runions'}).innerText(),/source recheck pending/);
 await page.goto(base+'/connections/?node=person-robert-bridson#people');await page.waitForSelector('.evidence-status');assert.match(await page.locator('.evidence-status').first().innerText(),/recheck pending/);
 await page.route('**/connections/data.json',r=>r.abort());await page.goto(base+'/notes/ingredients/techniques.html?person=Perlin');await page.waitForSelector('body[data-provenance=ready]');assert.ok(await page.locator('.tile:visible').count()>0);
 assert.deepEqual(errors,[]);console.log('Verified contributor search, one graph request, exact recipe navigation, smaller overlays, pending evidence labels and offline fallback pass');
}finally{await browser.close()}
