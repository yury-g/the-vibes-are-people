import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:320,height:740}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL;
try{
 await page.goto(base+'/connections/');await page.waitForSelector('.connection-card');
 assert.equal(await page.locator('.connection-card').count(),120);
 assert.equal(await page.locator('details,select').count(),0);
 await page.locator('#connection-search').fill('UCLA');assert.equal(await page.locator('.connection-card').count(),1);
 assert.match(await page.locator('.connection-card').innerText(),/MFA/);assert.equal(await page.locator('.inline-source').first().getAttribute('target'),'_blank');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('#overlap-links').getByRole('link',{name:'Eyebeam',exact:true}).click();await page.waitForSelector('.connection-card');assert.equal(await page.locator('.connection-card').count(),8);
 await page.locator('#gap-links').getByRole('link',{name:/awaiting a recipe placement/}).click();await page.waitForSelector('.connection-card');assert.equal(await page.locator('.connection-card').count(),2);
 await page.goto(base+'/notes/ingredients/people.html?person=levin');await page.waitForSelector('dialog[open] #unmix-content .people-connections .connection-lines');
 const section=page.locator('dialog[open] #unmix-content .people-connections');assert.match(await section.innerText(),/Carnegie Mellon/);assert.equal(await section.locator('details').count(),0);
 await section.getByRole('link',{name:'Eyebeam',exact:true}).click();await page.waitForSelector('.connection-card');assert.equal(await page.locator('.connection-card').count(),8);
 await page.screenshot({path:'/tmp/connections-inline-mobile.png',fullPage:false});
 await page.route('**/connections/data.json',r=>r.abort());
 await page.goto(base+'/notes/ingredients/techniques.html');await page.waitForSelector('body[data-provenance="ready"]');await page.locator('.tile').first().click();await page.waitForSelector('.people-connections a');assert.equal(await page.locator('.tile').count(),40);
 assert.deepEqual(errors,[]);console.log('Inline connections, overlaps, gaps, mobile and fallback passed');
}finally{await browser.close()}
