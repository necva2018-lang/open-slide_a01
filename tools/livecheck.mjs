import { chromium } from 'playwright-core';
const base = 'https://necva2018-lang.github.io/open-slide_a01';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const ids = { '01-slow-death': 26, '02-busy-but-closed': 25, 'six-things-before-opening': 25, '04-studio-vs-shop': 26, '05-hobby-to-income': 26, '06-five-blind-spots': 25, '07-social-five-rules': 26, '08-handmade-trap': 26, '09-bakery-owner': 26, '10-bento-founder': 26 };
const out = [];
let pg = await ctx.newPage();
const bad = [];
pg.on('response', (r) => { if (r.status() >= 400 && !/__design|__comments|favicon|\/s\/[^/]+(\?|$)/.test(r.url())) bad.push(r.status() + ' ' + r.url()); });
await pg.goto(base + '/', { waitUntil: 'networkidle' });
await pg.waitForTimeout(3000);
const cards = await pg.evaluate(() => document.body.innerText);
out.push('home cards: ' + ['開店＝慢性死亡', '230 元的便當', '比起技術', '純手工', '為什麼你的甜點', 'IG 發了', '烘焙興趣變現', '六件我希望', '個人工作室', '生意超好'].map((k) => k + ':' + cards.includes(k)).join(' '));
for (const [id, n] of Object.entries(ids)) {
  const p = await ctx.newPage();
  await p.goto(`${base}/s/${id}/preview?p=${n}&step=99`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  // 預覽路由只在開發模式有；改用正式播放頁
  await p.goto(`${base}/s/${id}?p=${n}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(4000);
  const t = await p.evaluate(() => document.body.innerText.slice(0, 400));
  const ok = /\/ ?\d+|Q&A|\d{2} \/ \d{2}/.test(t) || t.length > 20;
  out.push(`${id} p${n}: ${ok ? 'ok' : 'EMPTY'} | ${t.replace(/\n/g, ' ').slice(0, 70)}`);
  await p.close();
}
// 翻牌卡：開 10 號的第 20 頁，按 F，點第一張
const f = await ctx.newPage();
await f.goto(`${base}/s/10-bento-founder?p=20`, { waitUntil: 'networkidle' });
await f.waitForFunction(() => document.body.innerText.includes('點一下看後果'), null, { timeout: 60000 });
await f.waitForTimeout(1500);
await f.keyboard.press('f');
await f.waitForTimeout(2000);
const box = await f.locator('text=點一下看後果').first().boundingBox();
await f.mouse.click(box.x + 10, box.y + 10);
await f.waitForTimeout(1200);
const flipped = await f.evaluate(() => [...document.querySelectorAll('[style*="rotateX"]')].filter((e) => e.style.transform.includes('180')).length);
out.push('flip: url=' + f.url().replace(base, '') + ' flippedFaces=' + flipped);
await f.screenshot({ path: 'live-flip.png' });
const s = await ctx.newPage();
await s.goto(`${base}/s/09-bakery-owner?p=1`, { waitUntil: 'networkidle' });
await s.waitForTimeout(4000);
await s.screenshot({ path: 'live-09.png' });
out.push('bad responses: ' + (bad.length ? bad.slice(0, 5).join(' ; ') : 'none'));
console.log(out.join('\n'));
await b.close();
