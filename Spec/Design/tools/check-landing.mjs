import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Optional absolute path to puppeteer-core for a separate test installation.
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'preview');
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu'],
});
const report = { checkedAt: new Date().toISOString(), widths: [], interactions: [], errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('requestfailed', request => report.errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  const url = pathToFileURL(resolve(root, 'index.html')).href;
  for (const width of [320, 390, 500, 768, 1440]) {
    await page.setViewport({ width, height: width < 621 ? 844 : 1000, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    // Load below-the-fold illustrations before capturing the complete page.
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(image => {
        image.loading = 'eager';
        return image.decode();
      }));
    });
    const measurements = await page.evaluate(() => ({
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      fontLoaded: document.fonts.check('500 16px Figtree'),
      imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
      heroCtaBottom: document.querySelector('.hero-actions .button').getBoundingClientRect().bottom,
      overflow: [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > innerWidth + 1 && getComputedStyle(el).position !== 'absolute';
      }).map(el => `${el.tagName}.${el.className}`).slice(0, 10),
    }));
    assert.ok(measurements.scrollWidth <= width, `Horizontal page overflow at ${width}px`);
    assert.ok(measurements.fontLoaded, 'Figtree did not load');
    assert.ok(measurements.imagesLoaded, 'An illustration did not load');
    assert.ok(measurements.heroCtaBottom < (width < 621 ? 844 : 1000), `Hero CTA below first viewport at ${width}px`);
    report.widths.push(measurements);
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: resolve(output, `landing-${width}.png`), fullPage: true });
      await page.screenshot({ path: resolve(output, `first-screen-${width}.png`) });
    }
  }

  await page.click('input[name="answer"][value="0"]');
  await page.click('#check-answer');
  assert.equal(await page.$eval('.answer-option.is-wrong', el => el.textContent.includes('am understanding')), true);
  assert.equal(await page.$eval('#answer-feedback', el => !el.hidden && el.textContent.includes('understand')), true);
  report.interactions.push('Wrong answer: correction and explanation shown');
  await page.screenshot({ path: resolve(output, 'exercise-feedback.png'), fullPage: false });
  await page.click('#check-answer');
  assert.equal(await page.$eval('#exercise-count', el => el.textContent), 'Przykład 2 z 3');
  await page.click('input[name="answer"][value="1"]');
  await page.click('#check-answer');
  assert.equal(await page.$eval('#answer-feedback strong', el => el.textContent.startsWith('Dobrze!')), true);
  await page.click('#check-answer');
  await page.click('input[name="answer"][value="2"]');
  await page.click('#check-answer');
  await page.click('#check-answer');
  assert.equal(await page.$eval('#exercise-count', el => el.textContent), 'Przykład 1 z 3');
  report.interactions.push('Correct answer, next question and restart work across all three examples');

  await page.click('.flash-demo');
  assert.equal(await page.$eval('#flash-word', el => el.textContent), 'godny zaufania');
  await page.keyboard.press('Space');
  assert.equal(await page.$eval('#flash-word', el => el.textContent), 'trustworthy');
  report.interactions.push('Flashcard flips by mouse and keyboard');
  await page.click('#topics-toggle');
  assert.equal(await page.$eval('#extra-topics', el => !el.hidden && el.children.length === 10), true);
  await page.click('#topics-toggle');
  assert.equal(await page.$eval('#extra-topics', el => el.hidden), true);
  report.interactions.push('Catalogue expands from 4 to 14 topics and collapses');
  await page.click('.faq-list summary');
  assert.equal(await page.$eval('.faq-list details', el => el.open), true);
  report.interactions.push('FAQ disclosure opens');

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.click('.menu-toggle');
  assert.equal(await page.$eval('#mobile-nav', el => !el.hidden), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('#mobile-nav', el => el.hidden), true);
  assert.equal(await page.$eval('.menu-toggle', el => document.activeElement === el), true);
  report.interactions.push('Mobile menu opens, Escape closes it and restores focus');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('html', el => getComputedStyle(el).scrollBehavior), 'auto');
  report.interactions.push('Reduced motion disables smooth scrolling');
  const invalidAnchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => href !== '#' && !document.getElementById(href.slice(1))));
  assert.deepEqual(invalidAnchors, []);
  assert.deepEqual(report.errors, []);
  report.interactions.push('Local anchor targets exist; no JavaScript or asset-loading errors');
  await writeFile(resolve(output, 'checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
