// Reader cover-state regression gate (SSOT §20.3 + §28.2).
//
// The reader has two kinds of sheet: the unnumbered cover and the numbered student pages.
// The page selector must always show the sheet that is actually displayed. While the cover is
// displayed the selector shows a cover state (not "עמוד 1"), so choosing page 1 is a real value
// change and always navigates. This gate drives a real Chromium page at desktop and phone sizes.
//
// Why selection is modelled by hand: a native <select> fires `change` only when the chosen value
// differs from the current one. Playwright's selectOption() dispatches `change` even when the value
// is unchanged, which hides exactly this bug, so chooseLikeUser() follows the native rule instead.
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const CANONICAL_PAGE_COUNT = 43; // SSOT §2.4 / §20.3
const HARD_TIMEOUT_MS = 240000;
const root = process.cwd();
const failures = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); };

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  const file = path.resolve(root, pathname === '/' ? 'index.html' : pathname.replace(/^\//, ''));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(buf);
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;

const watchdog = setTimeout(() => {
  console.error(`READER COVER REGRESSION QA: hard timeout after ${HARD_TIMEOUT_MS}ms`);
  process.exit(2);
}, HARD_TIMEOUT_MS);

// What the reader shows right now. `displayed` is measured independently of reader-jump.js:
// it is the sheet under a point just below the sticky bar.
const readState = (page) => page.evaluate(() => {
  const bar = document.querySelector('.reader').getBoundingClientRect();
  const sel = document.getElementById('page-selector');
  const pages = [...document.querySelectorAll('#book .page')];
  const cover = document.querySelector('#book .cover-sheet');
  const hit = document.elementFromPoint(innerWidth / 2, Math.min(innerHeight - 1, bar.bottom + 40))?.closest('.cover-sheet, .page');
  const displayed = !hit ? null : hit === cover ? 'cover' : String(pages.indexOf(hit) + 1);
  const opt = sel.selectedOptions[0];
  return {
    scrollY: Math.round(scrollY),
    barBottom: Math.round(bar.bottom),
    displayed,
    displayedTop: hit ? Math.round(hit.getBoundingClientRect().top - bar.bottom) : null,
    value: sel.value,
    text: opt ? opt.textContent.trim() : '',
    selectedDisabled: !!opt?.disabled,
    hash: location.hash,
    coverHeight: cover ? Math.round(cover.getBoundingClientRect().height) : 0,
    pageCount: pages.length,
    pageOptions: [...sel.options].filter((o) => !o.disabled).map((o) => `${o.value}|${o.textContent.trim()}`),
    coverOptions: [...sel.options].filter((o) => /שער/.test(o.textContent)).map((o) => ({ value: o.value, disabled: o.disabled }))
  };
});

const chooseLikeUser = (page, value) => page.evaluate((v) => {
  const s = document.getElementById('page-selector');
  s.focus();
  const option = [...s.options].find((o) => o.value === v);
  if (!option || option.disabled) return { fired: false, why: 'option missing or disabled' };
  const before = s.value;
  s.value = v;
  if (s.value === before) return { fired: false, why: `value already "${v}": a native <select> fires no change event` };
  s.dispatchEvent(new Event('input', { bubbles: true }));
  s.dispatchEvent(new Event('change', { bubbles: true }));
  return { fired: true };
}, String(value));

// A real scroll (no synthetic events): instant, so smooth scrolling cannot blur the result.
const scrollToY = (page, y) => page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
const scrollToPageTop = (page, n) => page.evaluate((i) => {
  const bar = document.querySelector('.reader').getBoundingClientRect();
  const target = document.querySelectorAll('#book .page')[i - 1];
  window.scrollTo({ top: Math.round(target.getBoundingClientRect().top + scrollY - bar.height - 4), behavior: 'instant' });
}, n);

async function settle(page) {
  await page.waitForFunction(() => !document.getElementById('book').classList.contains('reader-fading'), null, { timeout: 4000 }).catch(() => {});
  await page.waitForFunction(() => new Promise((r) => { const y = scrollY; setTimeout(() => r(y === scrollY), 150); }), null, { timeout: 6000 });
  // reader-jump.js re-syncs one fade period after the fade-in, then on the next animation frame.
  await page.waitForTimeout(300);
}

async function waitForReader(page) {
  await page.waitForFunction((n) => document.querySelectorAll('#book .page').length === n && document.getElementById('page-selector').options.length >= n, CANONICAL_PAGE_COUNT, { timeout: 15000 });
  await settle(page);
}

function expectCover(s, where) {
  ok(s.displayed === 'cover', `${where}: the cover must be the displayed sheet (displayed=${s.displayed})`);
  ok(/שער/.test(s.text) && !/עמוד\s*\d/.test(s.text) && !/^\d+$/.test(s.value), `${where}: while the cover is displayed the selector must show the cover state, not a page (shows "${s.text}", value=${s.value})`);
  ok(!/page=/.test(s.hash), `${where}: the URL must not carry #page= while the cover is displayed (hash=${s.hash})`);
}

function expectPage(s, n, where) {
  ok(s.displayed === String(n), `${where}: page ${n} must be the displayed sheet (displayed=${s.displayed})`);
  ok(s.value === String(n) && s.text === `עמוד ${n} מתוך ${CANONICAL_PAGE_COUNT}`, `${where}: selector must read "עמוד ${n} מתוך ${CANONICAL_PAGE_COUNT}" (value=${s.value}, text="${s.text}")`);
  ok(s.hash === `#page=${n}`, `${where}: URL must carry #page=${n} (hash=${s.hash})`);
  ok(s.displayedTop !== null && s.displayedTop >= -4 && s.displayedTop <= 40, `${where}: page ${n} must start just below the sticky bar (offset ${s.displayedTop}px)`);
}

async function scenario(browser, { label, width, height, mobile }) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: !!mobile, hasTouch: !!mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  try {
    // 1. Open the reader: the cover is displayed and the selector shows the cover state.
    await page.goto(url, { waitUntil: 'load' });
    await waitForReader(page);
    let s = await readState(page);
    ok(s.pageCount === CANONICAL_PAGE_COUNT, `${label}: expected ${CANONICAL_PAGE_COUNT} student pages, got ${s.pageCount}`);
    const expectedOptions = Array.from({ length: CANONICAL_PAGE_COUNT }, (_, i) => `${i + 1}|עמוד ${i + 1} מתוך ${CANONICAL_PAGE_COUNT}`);
    ok(JSON.stringify(s.pageOptions) === JSON.stringify(expectedOptions), `${label}: selectable options must be exactly pages 1..${CANONICAL_PAGE_COUNT} ("עמוד X מתוך N"); the cover is not a page option`);
    ok(s.coverOptions.length === 1 && s.coverOptions[0].disabled, `${label}: the selector needs exactly one cover-state entry, and it must not be selectable (got ${JSON.stringify(s.coverOptions)})`);
    expectCover(s, `${label} open`);
    const coverY = s.scrollY;
    // SSOT §28.3: the cover has the same width/scale as the pages and never overflows sideways;
    // SSOT §20.2: on a touch device the page selector is at least 44px tall.
    const geo = await page.evaluate(() => {
      const c = document.querySelector('.cover-sheet').getBoundingClientRect();
      const p = document.querySelector('#book .page').getBoundingClientRect();
      const sel = document.querySelector('.reader select').getBoundingClientRect();
      return { vw: document.documentElement.clientWidth, cl: c.left, cr: c.right, cw: c.width, pw: p.width, selH: sel.height };
    });
    ok(Math.abs(geo.cw - geo.pw) <= 1, `${label}: cover width ${geo.cw} differs from page width ${geo.pw} (§28.3)`);
    ok(geo.cl >= -1 && geo.cr <= geo.vw + 1, `${label}: cover overflows the viewport sideways (${geo.cl}..${geo.cr} of ${geo.vw}) (§28.3)`);
    if (mobile) ok(geo.selH >= 44, `${label}: page selector is ${geo.selH}px tall; touch controls need ≥44px (§20.2)`);

    // 2. From the cover, choose page 1: this must navigate.
    const pick1 = await chooseLikeUser(page, 1);
    ok(pick1.fired, `${label}: choosing page 1 from the cover must be a selector change (${pick1.why || ''})`);
    await settle(page);
    s = await readState(page);
    expectPage(s, 1, `${label} cover → page 1`);
    ok(s.scrollY - coverY > s.coverHeight * 0.8, `${label}: choosing page 1 from the cover did not scroll past the cover (scrollY ${coverY} → ${s.scrollY})`);
    notes.push(`${label}: cover→page 1 scrollY ${coverY}→${s.scrollY}, page-1 offset ${s.displayedTop}px`);

    // 3. Another page, then back to page 1.
    const pick17 = await chooseLikeUser(page, 17);
    ok(pick17.fired, `${label}: choosing page 17 must be a selector change`);
    await settle(page);
    s = await readState(page);
    expectPage(s, 17, `${label} page 1 → page 17`);
    const y17 = s.scrollY;
    const back1 = await chooseLikeUser(page, 1);
    ok(back1.fired, `${label}: choosing page 1 from page 17 must be a selector change`);
    await settle(page);
    s = await readState(page);
    expectPage(s, 1, `${label} page 17 → page 1`);
    ok(s.scrollY < y17, `${label}: returning to page 1 did not scroll back (scrollY ${y17} → ${s.scrollY})`);

    // 4. Reload on page 1 keeps page 1.
    await page.reload({ waitUntil: 'load' });
    await waitForReader(page);
    expectPage(await readState(page), 1, `${label} reload on page 1`);

    // 5. Manual scroll to the top returns to the cover state; reload there stays on the cover.
    await scrollToY(page, 0);
    await settle(page);
    expectCover(await readState(page), `${label} manual scroll to top`);
    await page.reload({ waitUntil: 'load' });
    await waitForReader(page);
    expectCover(await readState(page), `${label} reload on cover`);

    // 6. A keyboard choice from the cover reaches page 1 as well (real key input, no scripted events).
    if (process.platform !== 'darwin') {
      await page.focus('#page-selector');
      await page.keyboard.press('ArrowDown');
      await settle(page);
      expectPage(await readState(page), 1, `${label} keyboard ArrowDown from cover`);
      await scrollToY(page, 0);
      await settle(page);
    }

    // 7. Deep link in a fresh load lands on the page and the selector matches.
    await page.goto('about:blank');
    await page.goto(`${url}?view=scroll#page=29`, { waitUntil: 'load' });
    await waitForReader(page);
    expectPage(await readState(page), 29, `${label} deep link #page=29`);
    // Same-document deep link (hash typed into the address bar).
    await page.evaluate(() => { location.hash = '#page=8'; });
    await settle(page);
    expectPage(await readState(page), 8, `${label} in-page deep link #page=8`);
    // Deep link to page 1 lands on page 1, not on the cover.
    await page.goto('about:blank');
    await page.goto(`${url}#page=1`, { waitUntil: 'load' });
    await waitForReader(page);
    expectPage(await readState(page), 1, `${label} deep link #page=1`);

    // 8. Manual scrolling keeps the selector on the displayed sheet.
    await scrollToPageTop(page, 12);
    await settle(page);
    expectPage(await readState(page), 12, `${label} manual scroll to page 12`);
    await scrollToY(page, Math.round(s.coverHeight * 0.3));
    await settle(page);
    expectCover(await readState(page), `${label} manual scroll into the cover`);
    if (!mobile) {
      await page.mouse.move(width / 2, height / 2);
      await page.mouse.wheel(0, Math.round(s.coverHeight * 2.4));
      await settle(page);
      const w = await readState(page);
      ok(/^\d+$/.test(w.value) && w.hash === `#page=${w.value}`, `${label}: after a wheel scroll the selector and URL must name a page (value=${w.value}, hash=${w.hash})`);
      const visible = await page.evaluate((n) => { const r = document.querySelectorAll('#book .page')[n - 1].getBoundingClientRect(); const bar = document.querySelector('.reader').getBoundingClientRect(); return r.top < innerHeight && r.bottom > bar.bottom; }, Number(w.value));
      ok(visible, `${label}: after a wheel scroll the selected page ${w.value} is not on screen`);
    }
    ok(errors.length === 0, `${label}: console/page errors: ${errors.join(' | ')}`);
  } finally {
    await context.close();
  }
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  await scenario(browser, { label: 'desktop 1440x1200', width: 1440, height: 1200 });
  await scenario(browser, { label: 'mobile 390x844', width: 390, height: 844, mobile: true });
} catch (error) {
  failures.push(`unexpected error: ${error?.stack || error}`);
} finally {
  if (browser) await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
  clearTimeout(watchdog);
}

if (failures.length) {
  console.error(`READER COVER REGRESSION QA FAIL (${failures.length})`);
  failures.forEach((f, i) => console.error(`${i + 1}. ${f}`));
  process.exit(1);
}
notes.forEach((n) => console.log(`  ${n}`));
console.log(`READER COVER REGRESSION QA PASS: cover state shown on open; page 1 (and every page) reachable from the cover; return to page 1; reload; deep links (#page=N, in-page, #page=1); manual scroll and wheel keep the selector on the displayed sheet; desktop + 390x844 mobile; no console errors.`);
