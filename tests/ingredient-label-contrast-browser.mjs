import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const base=process.env.TEST_URL||'http://127.0.0.1:8879';
async function checkLabels(scope){
 await scope.locator('body[data-provenance="ready"]').waitFor();
 const labels=await scope.locator('.tile-label,.ingredient-name,.label-disclosure').evaluateAll(nodes=>nodes.map(el=>{
  const style=getComputedStyle(el);let ancestor=el,background;
  while(ancestor){const c=getComputedStyle(ancestor).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent'){background=c;break}ancestor=ancestor.parentElement}
  return {text:el.textContent,color:style.color,background,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height};
 }));
 assert.ok(labels.length>100,'Check every contributor, recipe title and disclosure');
 for(const label of labels){
  assert.ok(label.text.trim()&&label.width>0&&label.height>0,'Labels have readable content and layout');
  assert.notEqual(label.color,label.background,`${label.text}: text must contrast with its card`);
 }
 assert.equal(await scope.locator('.ingredient-name').first().evaluate(el=>getComputedStyle(el).color),'rgb(17, 17, 17)');
}
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  await page.goto(base+'/notes/ingredients/techniques.html');await checkLabels(page);
  await page.locator('.tile').first().scrollIntoViewIfNeeded();
  await page.screenshot({path:`/tmp/ingredient-labels-${width}.png`});
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(base);
 await page.getByRole('button',{name:'Ingredients',exact:true}).click();
 await checkLabels(page.frameLocator('#ingredients iframe'));
 await page.goto(base+'/agents/');
 const button=page.locator('#copy-agent');
 assert.equal(await button.evaluate(el=>getComputedStyle(el).color),'rgb(255, 255, 255)');
 assert.equal(await button.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 17, 17)');
 console.log('PASS: names, recipe titles and disclosures remain readable on desktop, mobile and embedded Ingredients; agent button keeps its styling.');
}finally{await browser.close()}
