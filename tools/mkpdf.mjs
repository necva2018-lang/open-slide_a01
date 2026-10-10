// 用法：node mkpdf.mjs <截圖資料夾> <頁數> <輸出pdf> <標題>
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs';
const [, , dir, n, out, title = ''] = process.argv;
const doc = await PDFDocument.create();
doc.setTitle(title);
for (let i = 1; i <= +n; i++) {
  const img = await doc.embedPng(fs.readFileSync(`${dir}/p${String(i).padStart(2, '0')}.png`));
  const page = doc.addPage([1440, 810]);
  page.drawImage(img, { x: 0, y: 0, width: 1440, height: 810 });
}
fs.writeFileSync(out, await doc.save());
console.log('pdf pages', n);
