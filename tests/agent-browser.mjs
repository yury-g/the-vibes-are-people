import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {reserve,appendEvent} from '../scripts/agents/core.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const p={version:1,person:'Test Contributor',target:{type:'recipe',name:'A new visual method'},kind:'contribution',role:'Artist',claim:'A bounded browser fixture used to verify that accepted new ingredients appear.',sources:['https://example.org/evidence']};
let ledger=reserve({version:1,events:[]},{issue:999,author:'test',proposal:p},'2026-09-28T00:00:00Z');ledger=appendEvent(ledger,{type:'reviewed',issue:999,status:'accepted',confidence:3,at:'2026-09-28T00:00:01Z',reason:'Test fixture',sources:[],reviews:[]});
const base=process.env.TEST_URL;
try{
 await page.route('https://raw.githubusercontent.com/**/dist/agents/ledger.json',r=>r.fulfill({json:ledger}));
 await page.goto(base+'/agents/');await page.getByRole('heading',{name:'Test Contributor → A new visual method'}).waitFor();assert.match(await page.locator('#budget-status').innerText(),/1 \/ 40/);
 await page.goto(base+'/connections/?person=Test%20Contributor#people');await page.getByRole('heading',{name:'Test Contributor',exact:true}).waitFor();assert.equal(await page.locator('.connection-card').count(),1);assert.match(await page.locator('.connection-card').innerText(),/AI reviewed/);
 await page.goto(base+'/notes/ingredients/techniques.html');await page.locator('#agent-additions').getByRole('heading',{name:'A new visual method'}).waitFor();assert.match(await page.locator('#agent-additions').innerText(),/animated study not yet added/);assert.equal(await page.locator('.tile').count(),40);
 await page.waitForFunction(()=>document.querySelectorAll('#eyebeam-roster img').length===8);
 for(const img of await page.locator('#eyebeam-roster img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());assert.ok(await img.evaluate(i=>i.naturalWidth>100))}
 await page.waitForFunction(()=>document.querySelectorAll('#eyebeam-roster .code-projects h4').length===8);
 assert.equal(await page.locator('#eyebeam-roster .code-projects a').filter({hasText:'GitHub repositories'}).count(),8);
 assert.equal(await page.locator('select,details').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'/tmp/vibes-eyebeam-portraits-mobile.png',fullPage:false});
 await page.unroute('https://raw.githubusercontent.com/**/dist/agents/ledger.json');await page.route('https://raw.githubusercontent.com/**/dist/agents/ledger.json',r=>r.abort());await page.goto(base+'/agents/');await page.waitForFunction(()=>document.querySelector('#feed-status').textContent.includes('snapshot'));assert.deepEqual(errors,[]);console.log('Agent page, new person/recipe overlay,8 portraits,8 GitHub links, mobile and fallback pass');
}finally{await browser.close()}
