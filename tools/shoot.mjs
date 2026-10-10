// 用法：node shoot.mjs <slide-id> <輸出資料夾> <寬> <高> <起頁> <迄頁>
// 先確認 open-slide 開發伺服器已在 http://localhost:5173 執行。
// 逐頁用 /preview 路由截圖（step=99＝全部展開），並檢查文字是否超出版面。
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , id, outDir = 'shot', w = '1920', h = '1080', from = '1', to = '25'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const ctx = await browser.newContext({ viewport: { width: +w, height: +h } });
const report = [];
for (let p = +from; p <= +to; p++) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:5173/s/${id}/preview?p=${p}&step=99`);
  try {
    await page.waitForSelector('[data-osd-preview="ready"]', { timeout: 60000 });
  } catch {
    report.push(`p${p}: NOT READY`);
  }
  const info = await page.evaluate(() => {
    const frame = document.querySelector('[data-osd-preview]');
    const all = [...frame.querySelectorAll('*')];
    const root = all.find((e) => e.style && e.style.width === '1920px') || frame;
    const rr = root.getBoundingClientRect();
    const scale = rr.width / 1920;
    const bad = [];
    for (const e of all) {
      if (e.closest('svg')) continue;
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (e.children.length || !e.textContent.trim()) continue;
      const b = Math.round((r.bottom - rr.top) / scale);
      const rt = Math.round((r.right - rr.left) / scale);
      const l = Math.round((r.left - rr.left) / scale);
      const t = Math.round((r.top - rr.top) / scale);
      const isFooter = t > 990; // 頁尾固定在底部
      if ((!isFooter && b > 985) || rt > 1795 || (l < 135 && !isFooter) || t < 0)
        bad.push(`${e.textContent.trim().slice(0, 16)} b=${b} r=${rt} l=${l}`);
    }
    return bad;
  });
  report.push(`p${p}: ${info.length ? 'BAD ' + info.join(' | ') : 'ok'}`);
  await page.screenshot({ path: path.join(outDir, `p${String(p).padStart(2, '0')}.png`) });
  await page.close();
}
await browser.close();
console.log(report.join('\n'));
