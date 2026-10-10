// 用法：node fliptest.mjs <slide-id> <頁碼> <卡片提示文字>
// 進播放模式（按 F），點第一張翻牌卡，確認頁碼沒換、背面出現。
import { chromium } from 'playwright-core';
const [, , id, p, hint] = process.argv;
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.goto(`http://localhost:5173/s/${id}?p=${p}`);
await page.waitForFunction((h) => document.body.innerText.includes(h), hint, { timeout: 90000 });
await page.waitForTimeout(1500);
await page.keyboard.press('f');
await page.waitForTimeout(2000);
const loc = page.locator(`text=${hint}`);
const n = await loc.count();
const box = await loc.first().boundingBox();
await page.mouse.click(box.x + 10, box.y + 10);
await page.waitForTimeout(1200);
const after = page.url();
const rot = await page.evaluate(() => [...document.querySelectorAll('[style*="rotateX"]')].map((e) => e.style.transform).filter((t) => t.includes('180')).length);
console.log(JSON.stringify({ id, cards: n, urlAfterClick: after, flippedFaces: rot }));
await browser.close();
