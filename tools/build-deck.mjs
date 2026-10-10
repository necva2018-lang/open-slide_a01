// 用法：node build-deck.mjs <slide-id> <色票名稱> <簡報標題> <章節json檔> <頁面內容檔>
// 組合 kit-head（共用元件）＋ kit-parts（共用頁面零件）＋ 各簡報自己的頁面，輸出到 my-deck/slides/<id>/index.tsx
import fs from 'node:fs';
const [, , id, paletteName, title, chaptersFile, pagesFile] = process.argv;
const palettes = JSON.parse(fs.readFileSync('palettes.json', 'utf8'));
const pal = palettes[paletteName];
if (!pal) throw new Error('找不到色票：' + paletteName);
const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf8'));
let head = fs.readFileSync('kit-head.tsx.txt', 'utf8');
for (const [k, v] of Object.entries(pal)) head = head.replaceAll(`__${k}__`, v);
head = head.replaceAll('__TITLE__', title).replaceAll('__ID__', id);
head = head.replace(
  '__CHAPTERS__',
  chapters.map((c) => `  { name: '${c.name}', from: ${c.from}, to: ${c.to} },`).join('\n') + '\n];',
);
const parts = fs.readFileSync('kit-parts.tsx.txt', 'utf8');
const pages = fs.readFileSync(pagesFile, 'utf8').replaceAll('__CREATED__', new Date().toISOString()).replaceAll('__TITLE__', title).replaceAll('__ID__', id);
const dir = `../slides/${id}`;
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(`${dir}/index.tsx`, head + parts + '\n' + pages);
console.log('wrote', `${dir}/index.tsx`);
