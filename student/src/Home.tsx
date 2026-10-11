import { useLayoutEffect, useRef, useState } from 'react';
import { type DeckModule, decks } from 'virtual:decks';
import type { Summary } from './rating';
import { CANVAS_WIDTH, Canvas, PageProvider } from './runtime';

function stripNo(title: string) {
  return title.replace(/^\d{2}｜/, '');
}

export function openDeck(no: string) {
  // 點卡片是使用者手勢，可以直接要求全螢幕（iPhone 不支援時就以整個視窗播放）
  const el = document.documentElement;
  if (el.requestFullscreen && !document.fullscreenElement) {
    el.requestFullscreen().catch(() => {});
  }
  window.location.hash = `#/${no}/1`;
}

function Thumb({ mod }: { mod?: DeckModule }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const First = mod?.default[0];
  return (
    <div ref={ref} className="thumb">
      {First && w > 0 ? (
        <Canvas design={mod.design} scale={w / CANVAS_WIDTH}>
          <PageProvider index={0} total={mod.default.length}>
            <First />
          </PageProvider>
        </Canvas>
      ) : (
        <span className="thumb-loading">載入中…</span>
      )}
    </div>
  );
}

export function Home({ mods, summary }: { mods: Record<string, DeckModule>; summary: Summary | null }) {
  return (
    <main className="home">
      <header className="home-head">
        <p className="eyebrow">餐飲創業班</p>
        <h1>課程簡報</h1>
        <p className="hint">點選簡報即可全螢幕播放 · 鍵盤 ← → 或手機左右滑動翻頁 · 每頁右下角可以給星星</p>
      </header>
      <ul className="grid">
        {decks.map((d) => {
          const mod = mods[d.no];
          const views = summary?.views[d.no];
          return (
            <li key={d.no} className="card">
              <button type="button" className="card-open" onClick={() => openDeck(d.no)}>
                <Thumb mod={mod} />
                <span className="badge">{d.no}</span>
              </button>
              <div className="card-body">
                <h2>{mod?.meta?.title ? stripNo(mod.meta.title) : '　'}</h2>
                <div className="card-meta">
                  {mod && <span>{mod.default.length} 頁</span>}
                  {views != null && <span>{views.toLocaleString('zh-TW')} 次瀏覽</span>}
                  {d.pdf && (
                    <a className="pdf" href={encodeURI(d.pdf)} download>
                      下載 PDF
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {decks.length === 0 && <p className="empty">目前還沒有公開的簡報。</p>}
    </main>
  );
}
