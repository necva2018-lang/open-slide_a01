// 翻開所有翻牌卡的背面，檢查文字有沒有超出卡片高度（先前的截圖只看正面，漏掉了背面）
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const targets = [
  ['01-slow-death', [18, 21]],
  ['02-busy-but-closed', [17, 20]],
  ['03-six-things-before-opening', [19]],
  ['04-studio-vs-shop', [21]],
  ['05-hobby-to-income', [21, 22]],
  ['06-five-blind-spots', [19]],
  ['07-social-five-rules', [21]],
  ['08-handmade-trap', [21]],
  ['09-bakery-owner', [20]],
  ['10-bento-founder', [20]],
];
const host = process.argv[2] || 'http://localhost:5173/s';
const suffix = process.argv[3] ?? '/preview';
fs.mkdirSync('back', { recursive: true });
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
let bad = 0;
for (const [id, pages] of targets) {
  for (const p of pages) {
    const pg = await ctx.newPage();
    await pg.goto(`${host}/${id}${suffix}?p=${p}&step=99`);
    await pg.waitForSelector('[data-osd-preview="ready"]', { timeout: 60000 });
    await pg.evaluate(() => document.querySelectorAll('[data-osd-interactive]').forEach((e) => e.click()));
    await pg.waitForTimeout(1500);
    const res = await pg.evaluate(() => {
      const out = [];
      document.querySelectorAll('[data-osd-interactive]').forEach((card) => {
        const faces = [...card.querySelectorAll('div')].filter((d) => d.style.transform === 'rotateX(180deg)' && d.style.background === '');
        const back = [...card.querySelectorAll('div')].find((d) => d.style.transform === 'rotateX(180deg)' && d.style.position === 'absolute');
        if (!back) return;
        const ch = back.getBoundingClientRect().height;
        let over = 0;
        back.querySelectorAll('div').forEach((t) => {
          const r = t.getBoundingClientRect();
          const rr = back.getBoundingClientRect();
          if (r.height > ch + 1 || r.top < rr.top - 1 || r.bottom > rr.bottom + 1) over++;
        });
        out.push({ text: back.innerText.replace(/\n/g, ' ').slice(0, 34), h: Math.round(ch), over });
      });
      return out;
    });
    const wrong = res.filter((r) => r.over > 0);
    bad += wrong.length;
    console.log(`${id} p${p}: ${res.length} cards, overflow=${wrong.length}${wrong.length ? ' ' + JSON.stringify(wrong) : ''}`);
    await pg.screenshot({ path: `back/${id}-p${p}.png` });
    await pg.close();
  }
}
console.log('TOTAL overflow cards:', bad);
await b.close();
