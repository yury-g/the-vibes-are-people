import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const runtime = process.env.PLAYWRIGHT_PATH || 'playwright';
const {chromium} = createRequire(import.meta.url)(runtime);
const base = process.env.TEST_URL || 'http://127.0.0.1:8879';
const browser = await chromium.launch({channel: 'chrome', headless: true});
const page = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
const errors = []; page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(base + '/taxonomy/');
  await page.waitForSelector('.method');
  assert.equal(await page.locator('.method').count(), 5);
  assert.equal(await page.locator('.method:visible').count(), 5);
  assert.equal(await page.locator('.method canvas').count(), 5);
  assert.equal(await page.locator('select, details').count(), 0);
  assert.equal(await page.locator('.credits [data-review="imported"]').count(), 5);
  assert.equal(await page.locator('.credits [data-review="checked"]').count(), 1);
  assert.match(await page.locator('#gaussian-blur').innerText(), /Mathematical eponym/);
  assert.match(await page.locator('#gaussian-blur').innerText(), /does not credit Gauss with inventing/);

  // Numerical properties catch mislabeling a generic texture/filter as a named method.
  const checks = await page.evaluate(async () => {
    const {gradientNoise, gaussianKernel, gaussianBlur, orderedDither, rewriteLSystem} = await import('/taxonomy/demos.js');
    const kernel = gaussianKernel(2), uniform = gaussianBlur(new Float32Array(49).fill(.37), 7, 7, 2);
    const impulse = new Float32Array(225); impulse[112] = 1;
    const smooth = gaussianBlur(impulse, 15, 15, 1);
    const input = Float32Array.from([0, .3, .7, 1]);
    const dither = orderedDither(new Float32Array(64).fill(.5), 8, 8);
    const word = rewriteLSystem(4); let balance = 0, valid = true;
    for (const c of word) { if (c === '[') balance++; if (c === ']') balance--; if (balance < 0) valid = false; }
    return {
      kernelSum: kernel.reduce((a, b) => a + b, 0), kernelSymmetric: kernel.every((v, i) => Math.abs(v - kernel[kernel.length - i - 1]) < 1e-12),
      uniformPreserved: [...uniform].every(v => Math.abs(v - .37) < 1e-6),
      zeroSigmaIdentity: [...gaussianBlur(input, 2, 2, 0)].every((v, i) => v === input[i]),
      impulseConservesMass: Math.abs(smooth.reduce((a, b) => a + b, 0) - 1) < 1e-6,
      impulseSymmetric: Math.abs(smooth[111] - smooth[113]) < 1e-8 && Math.abs(smooth[97] - smooth[113]) < 1e-8,
      impulsePeak: smooth[112] > smooth[113] && smooth[113] > smooth[114],
      gradientLatticeZero: gradientNoise(3, 5) === 0,
      gradientContinuous: Math.abs(gradientNoise(3 - 1e-7, 2.31) - gradientNoise(3 + 1e-7, 2.31)) < 1e-5,
      gradientNonconstant: gradientNoise(.3, .8) !== gradientNoise(.8, .3),
      binaryDither: [...dither].every(v => v === 0 || v === 1), ditherHalfCoverage: dither.reduce((a, b) => a + b, 0) === 32,
      lSystemSegments: [...word].filter(c => c === 'F').length, balancedBranches: valid && balance === 0
    };
  });
  assert.ok(Math.abs(checks.kernelSum - 1) < 1e-12);
  assert.equal(checks.lSystemSegments, 625);
  for (const [key, value] of Object.entries(checks)) if (typeof value === 'boolean') assert.equal(value, true, key);

  // Each control changes its actual rendered output and exposes the new value.
  for (const id of ['perlin-noise', 'gaussian-blur', 'l-systems', 'moire', 'ordered-dithering']) {
    const canvas = page.locator(`#${id} canvas`), input = page.locator(`#${id}-parameter`);
    const before = await canvas.evaluate(c => c.toDataURL());
    await input.fill(await input.getAttribute('max'));
    assert.notEqual(await canvas.evaluate(c => c.toDataURL()), before, id + ' updates');
    assert.ok(await input.getAttribute('aria-valuetext'));
  }
  await page.getByRole('button', {name: 'Filter', exact: true}).click();
  assert.equal(await page.locator('.method:visible').count(), 1);
  assert.equal(await page.locator('.method:visible').getAttribute('id'), 'gaussian-blur');
  await page.getByRole('button', {name: 'All methods', exact: true}).click();
  await page.locator('#method-search').fill('Bayer');
  assert.equal(await page.locator('.method:visible').getAttribute('id'), 'ordered-dithering');
  await page.locator('#method-search').fill('Moire');
  assert.equal(await page.locator('.method:visible').getAttribute('id'), 'moire');
  await page.locator('#method-search').fill('not-a-real-method');
  assert.equal(await page.locator('.method:visible').count(), 0);
  await page.getByRole('button', {name: 'show all five'}).click();
  assert.equal(await page.locator('.method:visible').count(), 5);
  assert.equal(await page.locator('#method-search').evaluate(e => e === document.activeElement), true);

  // Keyboard input and reduced-motion opt-in play/pause.
  const slider = page.locator('#perlin-noise-parameter'); await slider.focus();
  const startValue = await slider.inputValue(); await page.keyboard.press('ArrowLeft');
  assert.equal(Number(await slider.inputValue()), Number(startValue) - 1);
  const motion = page.getByRole('button', {name: 'Play grid motion', exact: true});
  assert.equal(await motion.getAttribute('aria-pressed'), 'false');
  const moire = page.locator('#moire canvas'); await moire.scrollIntoViewIfNeeded();
  const paused = await moire.evaluate(c => c.toDataURL()); await page.waitForTimeout(150);
  assert.equal(await moire.evaluate(c => c.toDataURL()), paused);
  await motion.click(); await page.waitForTimeout(300);
  assert.notEqual(await moire.evaluate(c => c.toDataURL()), paused);
  await page.getByRole('button', {name: 'Pause grid motion', exact: true}).click();
  const stopped = await moire.evaluate(c => c.toDataURL()); await page.waitForTimeout(150);
  assert.equal(await moire.evaluate(c => c.toDataURL()), stopped);
  assert.equal(await page.getByRole('button', {name: 'Play collection study', exact: true}).getAttribute('aria-pressed'), 'false');
  const collection = page.locator('.collection-study canvas'); await collection.scrollIntoViewIfNeeded();
  const collectionStart = await collection.evaluate(c => c.toDataURL());
  await page.getByRole('button', {name: 'Play collection study', exact: true}).click(); await page.waitForTimeout(300);
  assert.notEqual(await collection.evaluate(c => c.toDataURL()), collectionStart);
  await page.getByRole('button', {name: 'Pause collection study', exact: true}).click();

  // Internal destinations are real routes, and the taxonomy does not invent graph people.
  for (const href of await page.locator('main a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute('href')))])) {
    const response = await page.request.get(base + href); assert.equal(response.ok(), true, href);
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({path: '/tmp/vibes-taxonomy-mobile.png', fullPage: true});
  await page.setViewportSize({width: 1365, height: 1000});
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({path: '/tmp/vibes-taxonomy-desktop.png'});
  await page.locator('#gaussian-blur').scrollIntoViewIfNeeded();
  await page.screenshot({path: '/tmp/vibes-taxonomy-desktop-methods.png'});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.goto(base + '/taxonomy/#l-systems'); await page.waitForSelector('#l-systems');
  assert.ok(await page.locator('#l-systems').evaluate(e => Math.abs(e.getBoundingClientRect().top) < 60));
  assert.deepEqual(errors, []);
  console.log('PASS: five named methods, numerical invariants, working controls, source-status preservation, filters, keyboard interaction, reduced-motion play/pause, internal routes, fragment navigation, mobile and desktop layout.');
} finally { await browser.close(); }
