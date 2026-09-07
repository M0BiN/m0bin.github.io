// Run: PLAYWRIGHT_MODULE=/path/to/playwright node scripts/smoke.cjs
// Uses an existing Playwright installation; the website itself has no dependencies.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
(async () => {
  const server = http.createServer((request, response) => {
    const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end(); return;
    }
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
    const url = `http://127.0.0.1:${server.address().port}`;
    const errors = [];
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
      await page.goto(url, { waitUntil: 'networkidle' });
      const moreScreens = page.locator('.more-screens');
      assert.equal(await moreScreens.getAttribute('open'), null, 'AI gallery leads the page');
      await moreScreens.locator('summary').click();
      assert.equal(await moreScreens.getAttribute('open'), '');
      await page.locator('img[src]').evaluateAll(images => Promise.all(images.map(image => { image.loading = "eager"; return image.decode(); })));
      assert.equal(await page.locator('h1').innerText(), 'Mobin Tirafkan');
      assert.ok(await page.getByText('Dima · Smart Banking Assistant for Bank Mellat').isVisible());
      assert.ok(await page.getByText('LLMs for structured data', { exact: true }).isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: page overflow`);
      assert.equal(await page.getByRole('link', { name: 'selfmeter.ir · Official website' }).getAttribute('href'), 'https://selfmeter.ir/');
      assert.equal(await page.locator('.product-heading img').count(), 2);
      for (const image of await page.locator('.gallery img').all()) {
        assert.deepEqual(await image.evaluate(el => [el.naturalWidth, el.naturalHeight]), [780, 1560]);
        assert.ok((await image.getAttribute('src')).includes('/dark/'));
        const box = await image.boundingBox();
        assert.ok(box.width >= 215 && Math.abs(box.height / box.width - 2) < .01, 'large, uncropped phone screenshots');
      }
      if (width < 700) {
        const gallery = page.locator('.ai-gallery');
        await gallery.evaluate(el => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
        await page.waitForTimeout(100);
        assert.ok(await gallery.evaluate(el => el.scrollLeft > el.clientWidth), 'native mobile gallery scrolls');
        await gallery.evaluate(el => el.scrollTo({ left: 0, behavior: 'instant' }));
      }
      for (const link of await page.locator('a[href^="#"]').all()) {
        const href = await link.getAttribute('href');
        if (href !== '#') assert.equal(await page.locator(href).count(), 1, href);
      }
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Escape');
      for (const shot of await page.locator('.screenshot-link').all()) {
        await shot.focus();
        await page.keyboard.press('Enter');
        assert.ok(await page.locator('dialog').isVisible());
        await page.locator('#viewer-image').evaluate(image => image.decode());
        assert.equal(await page.locator('#viewer-image').getAttribute('alt'), await shot.locator('img').getAttribute('alt'));
        await page.evaluate(() => document.querySelector('.download').focus());
        assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), 'background remains inert while the native dialog is open');
        await page.keyboard.press('Tab');
        assert.ok(await page.evaluate(() => document.activeElement === document.body || document.querySelector('dialog').contains(document.activeElement)), 'Tab cannot focus background controls');
        await page.keyboard.press('Escape');
        assert.ok(!(await page.locator('dialog').isVisible()));
        assert.ok(await shot.evaluate(link => document.activeElement === link), 'focus returns to image link');
      }
      const shot = page.locator('.screenshot-link').first();
      await shot.click();
      const count = await page.locator('.screenshot-link').count();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('#image-counter').innerText(), `${count} / ${count}`, 'previous wraps to last image');
      await page.getByRole('button', { name: 'Next →', exact: true }).click();
      assert.equal(await page.locator('#image-counter').innerText(), `1 / ${count}`, 'next wraps to first image');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#image-counter').innerText(), `2 / ${count}`);
      await page.getByRole('button', { name: '← Previous', exact: true }).click();
      assert.equal(await page.locator('#image-counter').innerText(), `1 / ${count}`);
      await page.getByRole('button', { name: 'Close screenshot' }).click();
      assert.ok(!(await page.locator('dialog').isVisible()));
      await moreScreens.locator('summary').click();
      assert.equal(await moreScreens.getAttribute('open'), null);
      assert.equal(await page.getByRole('link', { name: 'More about Dima · Cafe Bazaar' }).getAttribute('href'), 'https://cafebazaar.ir/app/com.bmelat.mobile?l=en');
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('link', { name: /Download resume/ }).click();
      const download = await downloadEvent;
      const pdf = fs.readFileSync(await download.path());
      assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
      assert.equal(await download.failure(), null);
      if (process.env.SCREENSHOT_DIR && [390, 1440].includes(width)) {
        fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
        await page.evaluate(() => { document.activeElement.blur(); document.querySelectorAll('.gallery').forEach(el => el.scrollTo({left: 0, behavior: 'instant'})); window.scrollTo(0, 0); });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `resume-${width}.png`), fullPage: true });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `resume-${width}-top.png`) });
        await page.locator('#selfmeter').screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `selfmeter-${width}.png`) });
      }
      await page.close();
      console.log(`${width}px: content, assets, layout, keyboard gallery, focus, and PDF download passed`);
    }
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await page.goto(url);
    await page.locator('.screenshot-link').first().click();
    assert.ok(page.url().endsWith('/website/homepage.png'), 'images work without JavaScript');
    assert.deepEqual(errors, []);
    console.log('No-JavaScript image fallback passed; no browser errors.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
