// 學員站打包設定：只打包 public.json 標記為開放的簡報（不含講者備註），輸出到 dist/student/
// 沒開放的簡報完全不會打包進學員站
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const slidesDir = path.join(repo, 'slides');
const pdfDir = path.join(repo, 'pdf');

type Deck = { no: string; dir: string; pdf: string | null };

function readDecks(): Deck[] {
  const { public: list } = JSON.parse(fs.readFileSync(path.join(here, 'public.json'), 'utf8')) as {
    public: string[];
  };
  const dirs = fs.readdirSync(slidesDir);
  const pdfs = fs.existsSync(pdfDir) ? fs.readdirSync(pdfDir) : [];
  return [...new Set(list.map((x) => String(x).padStart(2, '0')))].sort().map((no) => {
    const dir = dirs.find((d) => d.startsWith(`${no}-`));
    if (!dir) throw new Error(`public.json 列了 ${no}，但 slides/ 找不到 ${no}-* 資料夾`);
    return { no, dir, pdf: pdfs.find((f) => f.startsWith(`${no}_`) && f.endsWith('.pdf')) ?? null };
  });
}

const J = JSON.stringify;

function studentDecks(): Plugin {
  const decks = readDecks();
  return {
    name: 'student-decks',
    resolveId(id) {
      if (id === 'virtual:decks' || id.startsWith('virtual:deck/')) return `\0${id}`;
      // @open-slide/core 會引用編輯器用的虛擬模組，學員站用空的替身
      if (id === 'virtual:open-slide/slides' || id === 'virtual:open-slide/config') return `\0${id}`;
    },
    load(id) {
      if (id === '\0virtual:decks') {
        const items = decks.map(
          (d) =>
            `{ no: ${J(d.no)}, pdf: ${J(d.pdf ? `pdf/${d.pdf}` : null)}, load: () => import(${J(`virtual:deck/${d.no}`)}) }`,
        );
        return `export const decks = [${items.join(',\n')}];`;
      }
      if (id.startsWith('\0virtual:deck/')) {
        const no = id.slice('\0virtual:deck/'.length);
        const d = decks.find((x) => x.no === no);
        if (!d) throw new Error(`未開放的簡報：${no}`);
        const file = path.join(slidesDir, d.dir, 'index.tsx').replace(/\\/g, '/');
        // 只轉出頁面、配色、標題；講者備註（notes）不轉出，打包時會被剔除
        return `export { default, design, meta } from ${J(file)};`;
      }
      if (id === '\0virtual:open-slide/slides') {
        return 'export const slideIds = []; export const slideThemes = {}; export const slideCreatedAt = {}; export const loadSlide = () => Promise.reject(new Error("n/a"));';
      }
      if (id === '\0virtual:open-slide/config') return 'export default {};';
    },
    generateBundle() {
      for (const d of decks) {
        if (!d.pdf) continue;
        this.emitFile({
          type: 'asset',
          fileName: `pdf/${d.pdf}`,
          source: fs.readFileSync(path.join(pdfDir, d.pdf)),
        });
      }
    },
  };
}

export default defineConfig({
  root: here,
  base: './',
  plugins: [react(), studentDecks()],
  // 簡報檔在學員站資料夾外面，避免 React 被當成兩份打包
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    outDir: path.join(repo, 'dist', 'student'),
    emptyOutDir: true,
  },
});
