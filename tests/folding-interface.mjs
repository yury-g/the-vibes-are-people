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
 assert.equal(await page.getByRole('button',{name:'Together',exact:true}).count(),1,'Public navigation names the views, not A/B testing');
 const people=page.frameLocator('#people iframe'), ingredients=page.frameLocator('#ingredients iframe');
 await people.locator('.card').first().waitFor();await ingredients.locator('.tile').first().waitFor();
 assert.equal(await people.locator('.card').count(),18);assert.equal(await ingredients.locator('.tile').count(),40);
 await people.locator('.card').nth(7).click();
 await ingredients.locator('#people-search').fill('Perlin');
 const visible=await ingredients.locator('.tile:visible').count();assert.ok(visible>0&&visible<40);
 await ingredients.locator('body').evaluate(()=>window.scrollTo(0,600));
 const scrollBefore=await ingredients.locator('body').evaluate(()=>window.scrollY);
 const frameUrls=page.frames().map(f=>f.url());let navigations=0;page.on('framenavigated',()=>navigations++);
 await page.getByRole('button',{name:'People',exact:true}).click();
 await page.waitForTimeout(500);
 assert.equal(await page.locator('#ingredients .page-content').getAttribute('inert'),'');
 assert.equal(await page.locator('#ingredients').evaluate(e=>e.getBoundingClientRect().width),44);
 assert.equal(await people.locator('#detail').evaluate(e=>e.open),true);
 await page.getByRole('button',{name:'Unfold Ingredients',exact:true}).click();await page.waitForTimeout(500);
 assert.equal(await ingredients.locator('#people-search').inputValue(),'Perlin');
 assert.equal(await ingredients.locator('body').evaluate(()=>window.scrollY),scrollBefore,'Folding and unfolding preserves the scroll position');
 assert.equal(await ingredients.locator('.tile:visible').count(),visible);
 await page.getByRole('button',{name:'Ingredients',exact:true}).click();await page.waitForTimeout(500);
 assert.equal(await page.locator('#people .page-content').getAttribute('inert'),'');
 await page.getByRole('button',{name:'Together',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);
 assert.equal(await people.locator('#detail').evaluate(e=>e.open),true);
 assert.equal(navigations,0,'Folding never reloads a view');assert.deepEqual(page.frames().map(f=>f.url()),frameUrls);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.book').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 await page.setViewportSize({width:320,height:740});
 for(const name of ['People','Ingredients','Together']){
  await page.getByRole('button',{name,exact:true}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No phone overflow');
 }
 for(const route of ['/notes/ingredients/','/notes/ingredients/compare.html']){
  await page.goto(base+route);assert.equal(await page.getByRole('button',{name:'Together',exact:true}).count(),1);
 }
 assert.deepEqual(errors,[]);console.log('PASS: folding preserves both frames, filters and open studies; keyboard, narrow screens, reduced motion and legacy links work.');
}finally{await browser.close()}
