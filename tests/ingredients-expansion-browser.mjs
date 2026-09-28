import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL;
try{
 await page.goto(base+'/notes/ingredients/techniques.html');
 await page.waitForSelector('body[data-provenance="ready"][data-portraits="ready"][data-profiles="ready"]');
 assert.ok(Number(await page.locator('#human-count').innerText())>=105,'Preserve baseline contributors and include accepted additions');
 for(const name of ['Lauren Lee McCarthy','Golan Levin','Tega Brain','Gene Kogan','Zach Lieberman']){
  await page.locator('#people-search').fill(name);
  assert.ok(await page.locator('.tile:visible .ingredient-name').filter({hasText:name}).count());
  await page.locator('.tile:visible').first().click();
  const row=page.locator('#human-ingredients .ingredient-person').filter({has:page.getByRole('heading',{name,exact:true})});
  await row.locator('.ingredient-bio').waitFor();
  await row.getByRole('link',{name:'Eyebeam',exact:true}).first().waitFor();
  assert.ok(await row.locator('meter').count()>0,'Language evidence is embedded');
  assert.ok(await row.getByRole('link',{name:'Artist biography ↗'}).count());
  if(name!=='Gene Kogan')assert.equal(await row.getByRole('link',{name:'Wikipedia biography ↗'}).count(),1);
  if(['Lauren Lee McCarthy','Tega Brain','Gene Kogan'].includes(name)){
   const image=row.locator('img');await image.scrollIntoViewIfNeeded();
   await image.evaluate(img=>img.decode());assert.ok(await image.evaluate(img=>img.naturalWidth>=260));
   assert.ok(await row.getByRole('link',{name:'Reference photo ↗'}).count());
   assert.match(await row.innerText(),/AI-assisted illustration/);
   assert.match(await image.getAttribute('alt'),/AI-assisted portrait illustration/);
  }
  assert.equal(await page.locator('#detail').evaluate(el=>el.scrollWidth>el.clientWidth),false);
  if(name==='Tega Brain')await page.screenshot({path:'/tmp/ingredients-tega-mobile.png'});
  await page.locator('#close').click();
 }
 await page.waitForFunction(()=>document.querySelectorAll('#eyebeam-roster article').length===8);
 assert.equal(await page.locator('#eyebeam-roster article').filter({hasText:'To be assigned'}).count(),2);
 assert.equal(await page.locator('select,details').count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.route('**/people-profiles.json',r=>r.abort());
 await page.goto(base+'/notes/ingredients/techniques.html?person=Gene%20Kogan');
 await page.waitForSelector('body[data-provenance="ready"]');
 assert.equal(await page.locator('.tile:visible').count(),2,'Bio failure does not hide recipes');
 await page.locator('.tile:visible').first().click();assert.match(await page.locator('#human-ingredients').innerText(),/Gene Kogan/);
 assert.deepEqual(errors,[]);console.log('New contributors appear in core recipes, sourced bios/photos, Eyebeam and language overlays; mobile and metadata fallback pass');
}finally{await browser.close()}
