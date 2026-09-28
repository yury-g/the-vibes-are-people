import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

// Exercise the shipped HTML through its controls and downloads. No test API.
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:8879';
const browser = await chromium.launch({channel: 'chrome', headless: true});
const directory = await mkdtemp(join(tmpdir(), 'vibes-art-studio-'));
const page = await browser.newPage({viewport: {width: 1360, height: 1000}, acceptDownloads: true});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let checks = 0;
function passed(message) { checks++; console.log(`PASS ${message}`); }
async function pixels(p = page) {
  return createHash('sha256').update(await p.locator('#artwork').evaluate(canvas => canvas.toDataURL())).digest('hex');
}
async function download(name, extension, p = page) {
  // Chromium drops bursts above ten downloads/second. Keep real file downloads
  // below that browser limit while testing repeated recipe rejection.
  await delay(150);
  const event = p.waitForEvent('download');
  await p.getByRole('button', {name, exact: true}).click();
  const file = await event;
  assert.equal(await file.failure(), null);
  assert.ok(file.suggestedFilename().endsWith(extension));
  const path = join(directory, `${Date.now()}-${file.suggestedFilename()}`);
  await file.saveAs(path);
  return {path, bytes: await readFile(path)};
}
async function recipe(p = page) {
  return JSON.parse((await download('Download recipe', '.json', p)).bytes.toString());
}
async function slider(id, value, p = page) {
  await p.locator(`#${id}`).evaluate((input, next) => {
    input.value = String(next);
    input.dispatchEvent(new Event('input', {bubbles: true}));
  }, value);
}
async function importRecipe(value, p = page) {
  await p.locator('#recipe-file').setInputFiles({
    name: 'test.recipe.json', mimeType: 'application/json',
    buffer: Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value))
  });
  await p.waitForFunction(() => document.querySelector('#status').dataset.kind !== 'loading');
}
try {
  const response = await page.goto(`${base}/skills/vibes-algorithmic-art/assets/studio.html`);
  assert.ok(response.ok(), 'the runnable studio must be served');
  await page.waitForSelector('#artwork');
  const original = await pixels();
  const ink = await page.locator('#artwork').evaluate(canvas => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let marked = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] < 245) marked++;
    return marked / (data.length / 4);
  });
  assert.ok(ink > .01 && ink < .8, `default must render visible paths, got ink ratio ${ink}`);
  const initial = await recipe();
  assert.equal(initial.schema, 'vibes-algorithmic-art/recipe');
  assert.equal(initial.version, 1);
  assert.equal(initial.algorithm, 'interpolated-direction-field-v1');
  assert.equal(initial.frame, null);
  assert.equal(initial.render, 'static');
  assert.deepEqual(initial.canvas, {width: 1200, height: 900, pixelRatio: 1, background: '#ffffff'});
  passed('default renders visible artwork and exports an explicit versioned static recipe');

  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', {name: 'Regenerate', exact: true}).click();
    assert.equal(await pixels(), original, 'same state must produce identical pixels');
  }
  passed('same seed and parameters regenerate identical pixels');

  for (const id of ['density', 'fieldScale', 'turning']) {
    await page.getByRole('button', {name: 'Reset', exact: true}).click();
    const bounds = await page.locator(`#${id}`).evaluate(input => [Number(input.min), Number(input.max)]);
    await slider(id, bounds[0]);
    const low = await pixels();
    await slider(id, bounds[1]);
    const high = await pixels();
    assert.notEqual(low, high, `${id} must visibly affect the drawing`);
    assert.notEqual(high, original, `${id} must change the default drawing`);
    const state = await recipe();
    assert.equal(state.parameters[id], bounds[1]);
    passed(`${id} control changes pixels and exported state`);
  }
  await page.getByRole('button', {name: 'Reset', exact: true}).click();
  assert.equal(await pixels(), original, 'Reset must restore the original image');
  assert.deepEqual(await recipe(), initial);
  passed('reset restores all defaults and their exact pixels');

  await page.getByRole('button', {name: 'New seed', exact: true}).click();
  assert.notEqual(Number(await page.locator('#seed').inputValue()), initial.seed);
  assert.notEqual(await pixels(), original);
  for (const seed of [0, 4294967295]) {
    await page.locator('#seed').fill(String(seed));
    await page.getByRole('button', {name: 'Regenerate', exact: true}).click();
    const image = await pixels();
    await page.getByRole('button', {name: 'Regenerate', exact: true}).click();
    assert.equal(await pixels(), image);
    assert.equal((await recipe()).seed, seed);
    assert.notEqual(image, original);
  }
  passed('new seed changes artwork; zero and maximum uint32 seeds are reproducible');

  await page.locator('#seed').fill('731');
  await page.getByRole('button', {name: 'Regenerate', exact: true}).click();
  await slider('density', 450);
  await slider('fieldScale', 96);
  await slider('turning', 75);
  const editedImage = await pixels();
  const editedRecipe = await recipe();
  const png = await download('Download PNG', '.png');
  assert.deepEqual([...png.bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.bytes.readUInt32BE(16), 1200);
  assert.equal(png.bytes.readUInt32BE(20), 900);
  passed('PNG export has a valid signature and full canvas dimensions');

  await page.getByRole('button', {name: 'Reset', exact: true}).click();
  await importRecipe(editedRecipe);
  assert.equal(await pixels(), editedImage);
  assert.deepEqual(await recipe(), editedRecipe);
  passed('JSON import restores edited controls, state, and exact pixels');

  const invalid = [
    Buffer.from('{broken json'), null, [],
    {...editedRecipe, schema: 'other'}, {...editedRecipe, version: 2},
    {...editedRecipe, algorithm: 'unimplemented'}, {...editedRecipe, frame: 1},
    {...editedRecipe, render: 'animated'}, {...editedRecipe, seed: '731'},
    {...editedRecipe, seed: -1}, {...editedRecipe, seed: 4294967296},
    {...editedRecipe, seed: 3.5},
    {...editedRecipe, parameters: {...editedRecipe.parameters, density: -1}},
    {...editedRecipe, parameters: {...editedRecipe.parameters, fieldScale: 1e9}},
    {...editedRecipe, parameters: {...editedRecipe.parameters, turning: null}},
    {...editedRecipe, parameters: {...editedRecipe.parameters, surprise: 5}},
    {...editedRecipe, canvas: {...editedRecipe.canvas, width: 100000}},
    {...editedRecipe, canvas: {...editedRecipe.canvas, pixelRatio: 2}},
    {...editedRecipe, injection: '</script><script>window.injected=true</script>'},
    Buffer.from(JSON.stringify(editedRecipe) + ' '.repeat(17000))
  ];
  for (const candidate of invalid) {
    await importRecipe(candidate);
    assert.equal(await page.locator('#status').getAttribute('data-kind'), 'error');
    assert.equal(await pixels(), editedImage, 'invalid import must preserve the drawing');
    assert.deepEqual(await recipe(), editedRecipe, 'invalid import must preserve the recipe');
  }
  assert.equal(await page.evaluate(() => window.injected), undefined);
  passed(`${invalid.length} malformed, incompatible, out-of-range, injection, and oversized imports rejected without mutation`);

  for (const seed of ['', '-1', '1.5', '4294967296']) {
    await page.locator('#seed').fill(seed);
    await page.getByRole('button', {name: 'Regenerate', exact: true}).click();
    assert.equal(await page.locator('#status').getAttribute('data-kind'), 'error');
    assert.equal(await pixels(), editedImage);
  }
  await importRecipe(editedRecipe);
  passed('invalid seed entry preserves the last valid artwork');

  const html = await download('Download HTML', '.html');
  const context = await browser.newContext({offline: true, acceptDownloads: true, viewport: {width: 1100, height: 850}});
  const offline = await context.newPage();
  const requests = [];
  offline.on('pageerror', error => errors.push(error.message));
  offline.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  await offline.goto(pathToFileURL(html.path).href);
  await offline.waitForSelector('#artwork');
  assert.equal(await pixels(offline), editedImage, 'downloaded HTML must rebuild saved pixels offline');
  assert.deepEqual(await recipe(offline), editedRecipe);
  await slider('turning', 20, offline);
  assert.notEqual(await pixels(offline), editedImage, 'downloaded HTML must remain editable');
  const twice = await download('Download HTML', '.html', offline);
  const second = await context.newPage();
  await second.goto(pathToFileURL(twice.path).href);
  assert.equal(await pixels(second), await pixels(offline), 'an offline copy must export its own current state');
  assert.deepEqual(requests, [], 'offline studio must not request runtime network dependencies');
  await context.close();
  passed('exported HTML opens from file offline with identical pixels and supports editing/re-export');

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({width, height: 844});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `no horizontal overflow at ${width}px`);
    const bounds = await page.locator('#artwork').boundingBox();
    assert.ok(bounds.width > 200 && bounds.x >= 0 && bounds.x + bounds.width <= width);
  }
  assert.deepEqual(errors, []);
  passed('320px, 390px, and 768px layouts fit; no JavaScript errors');
  console.log(`${checks} art studio checks passed.`);
} finally {
  await browser.close();
  await rm(directory, {recursive: true, force: true});
}
