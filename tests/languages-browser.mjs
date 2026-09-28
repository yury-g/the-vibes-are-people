import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:320,height:740}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL;
try{
 await page.goto(base+'/connections/?layer=languages#languages');await page.waitForSelector('.language-relationship');
 assert.equal(await page.locator('details,select').count(),0);
 assert.equal(await page.locator('.connection-card').count(),18);
 assert.equal(await page.locator('.confidence[data-level="2"]').count(),4);
 assert.match(await page.locator('.inference-reason').first().innerText(),/Inferred from/);
 await page.locator('#include-inferred').uncheck();assert.equal(await page.locator('.confidence[data-level="2"]').count(),0);
 await page.locator('#language-links').getByRole('link',{name:'Java',exact:true}).click();await page.waitForSelector('.connection-card');
 assert.equal(await page.locator('.connection-card').count(),6);
 await page.locator('#include-inferred').uncheck();assert.equal(await page.locator('.connection-card').count(),3);
 assert.equal(await page.locator('.language-relationship').filter({has:page.locator('a[href="/connections/?node=entity-java#people"]')}).locator('meter[value="3"]').count(),3);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('#language-links').getByRole('link',{name:'Ruby on Rails',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#connection-count').textContent==='0 people shown');assert.match(await page.locator('#connection-context').innerText(),/framework/);
 await page.goto(base+'/notes/ingredients/people.html?person=lieberman');await page.waitForSelector('#unmix-content .confidence[data-level="3"]');
 assert.match(await page.locator('#unmix-content').innerText(),/animation tutorial/);
 assert.equal(await page.locator('#unmix-content .confidence[data-level="2"]').count(),0);
 assert.match(await page.locator('#unmix-content .study-language-note').innerText(),/site’s animated study uses JavaScript/);
 assert.equal(await page.locator('dialog').evaluate(e=>e.scrollWidth>e.clientWidth),false);
 await page.locator('#unmix-content .confidence[data-level="3"]').first().scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/language-confidence-mobile.png'});
 await page.goto(base+'/connections/#languages');await page.setViewportSize({width:1300,height:900});await page.waitForSelector('.technology-group');await page.screenshot({path:'/tmp/language-layer-desktop.png'});
 assert.deepEqual(errors,[]);console.log('Language links, confidence filtering, unknowns and responsive UI passed');
}finally{await browser.close()}
