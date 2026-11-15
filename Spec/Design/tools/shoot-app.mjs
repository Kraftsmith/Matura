import puppeteer from 'puppeteer-core';
const [base, outDir] = process.argv.slice(2); // node shoot-app.mjs http://localhost:3001 "C:/.../Spec/Design/screenshots"  (SHOT_PASSWORD in env)
const user = 'design-test';
const pages = [
  ['app-dashboard', `#dashboard`, 1600],
  ['app-module-slownictwo', `#czlowiek/slownictwo`, 2400],
  ['app-module-srodki', `#czlowiek/srodki`, 2400],
  ['app-module-gramatyka', `#czlowiek/gramatyka`, 2400],
  ['app-module-opis', `#czlowiek/opis-foto`, 2000],
  ['app-module-pisanie', `#czlowiek/pisanie`, 2000],
  ['app-module-fiszki', `#czlowiek/fiszki`, 1400],
  ['app-fiszki-hub', `#fiszki`, 1600],
  ['app-profile', `#profile`, 1600],
  ['app-ustawienia', `#ustawienia`, 1200],
  ['app-design-system', `#design-system`, 6000],
];
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setRequestInterception(true);
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('/fonts/') && !u.includes('/app/fonts/')) return r.continue({ url: u.replace('/fonts/', '/app/fonts/') });
  r.continue();
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Sign-in screen first (no session yet).
await page.goto(`${base}/app/#${user}/dashboard`, { waitUntil: 'networkidle0' });
await sleep(2500);
await page.screenshot({ path: `${outDir}/app-signin.png`, fullPage: true });
// Sign in with the password set earlier.
await page.goto(`${base}/app/#login`, { waitUntil: 'networkidle0' });
await page.waitForSelector('input[type=password]', { timeout: 20000 });
await page.type('input[type=email], input[name=email]', 'design-test@example.com');
await page.type('input[type=password]', process.env.SHOT_PASSWORD ?? '');
await page.click('button[type=submit]');
await sleep(5000);
console.log('after reset:', page.url());
for (const [name, hash, h] of pages) {
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${base}/app/${hash}`, { waitUntil: 'networkidle0' }); await page.reload({ waitUntil: 'networkidle0' });
  await sleep(3500);
  await page.screenshot({ path: `${outDir}/${name}.png`, captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: h } });
  console.log('shot', name, page.url());
}
// Phone width for the app.
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(`${base}/app/#${user}/czlowiek/srodki`, { waitUntil: 'networkidle0' });
await sleep(3500);
await page.screenshot({ path: `${outDir}/app-module-mobile.png`, fullPage: true });
await page.goto(`${base}/app/#${user}/dashboard`, { waitUntil: 'networkidle0' });
await sleep(3500);
await page.screenshot({ path: `${outDir}/app-dashboard-mobile.png`, fullPage: true });
await browser.close();
