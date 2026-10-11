import { useCallback, useEffect, useRef, useState } from 'react';
import type { DeckModule } from 'virtual:decks';
import { countView, myRating, type PageStat, rate } from './rating';
import { CANVAS_HEIGHT, CANVAS_WIDTH, Canvas, PageProvider, type StepController, StepHost } from './runtime';

function useFitScale() {
  const calc = () => Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const on = () => setScale(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return scale;
}

function goHome() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  window.location.hash = '';
}

function Stars({
  value,
  stat,
  onRate,
}: {
  value: number;
  stat?: PageStat;
  onRate: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= shown ? 'star on' : 'star'}
          aria-label={`給 ${n} 顆星`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onRate(n)}
        >
          ★
        </button>
      ))}
      {stat && stat.count > 0 && (
        <span className="avg">
          {stat.avg.toFixed(1)}（{stat.count}）
        </span>
      )}
    </div>
  );
}

export function Player({
  no,
  mod,
  page,
  stats,
  onStat,
}: {
  no: string;
  mod: DeckModule;
  page: number;
  stats: Record<string, PageStat>;
  onStat: (page: number, stat: PageStat) => void;
}) {
  const pages = mod.default;
  const total = pages.length;
  const index = Math.min(Math.max(page, 1), total) - 1;
  const Page = pages[index];
  const scale = useFitScale();
  const controller = useRef<StepController | null>(null);
  const [dir, setDir] = useState<'forward' | 'backward'>('forward');
  const [mine, setMine] = useState(() => myRating(no, index + 1));
  const [portraitHint, setPortraitHint] = useState(
    () => window.matchMedia('(orientation: portrait) and (max-width: 900px)').matches,
  );

  useEffect(() => {
    countView(no);
  }, [no]);
  useEffect(() => {
    setMine(myRating(no, index + 1));
  }, [no, index]);
  useEffect(() => {
    if (!portraitHint) return;
    const t = setTimeout(() => setPortraitHint(false), 4000);
    return () => clearTimeout(t);
  }, [portraitHint]);

  const goTo = useCallback(
    (p: number, d: 'forward' | 'backward') => {
      if (p < 1 || p > total) return;
      setDir(d);
      window.location.hash = `#/${no}/${p}`;
    },
    [no, total],
  );
  // 先把本頁的分段內容走完，再換頁
  const next = useCallback(() => {
    if (controller.current?.advance()) return;
    goTo(index + 2, 'forward');
  }, [goTo, index]);
  const prev = useCallback(() => {
    if (controller.current?.retreat()) return;
    goTo(index, 'backward');
  }, [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') goTo(1, 'backward');
      else if (e.key === 'End') goTo(total, 'forward');
      else if (e.key === 'Escape' && !document.fullscreenElement) goHome();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, total]);

  // 按 Esc 離開全螢幕時，一併回到首頁
  useEffect(() => {
    let wasFull = !!document.fullscreenElement;
    const on = () => {
      if (wasFull && !document.fullscreenElement) window.location.hash = '';
      wasFull = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  // 手機左右滑動翻頁
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) next();
    else prev();
  };

  const onRate = (n: number) => {
    const p = index + 1;
    setMine(n);
    rate(no, p, n).then((stat) => stat && onStat(p, stat));
  };

  return (
    <div className="stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="frame">
        <Canvas design={mod.design} scale={scale}>
          <PageProvider index={index} total={total}>
            <StepHost key={index} entryDirection={dir} controllerRef={controller}>
              <Page />
            </StepHost>
          </PageProvider>
        </Canvas>
      </div>

      {/* 控制列貼著簡報畫面定位（不是螢幕），放在頁尾上方，不蓋住簡報自己的頁碼 */}
      <div className="overlay" style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}>
        <div className="ctrl bar">
          <button type="button" className="home-btn" onClick={goHome} aria-label="回首頁" title="回首頁">
            ✕
          </button>
          <span className="sep" />
          <button type="button" className="nav" onClick={prev} disabled={index === 0} aria-label="上一頁">
            ‹
          </button>
          <span className="pageno">
            {index + 1} / {total}
          </span>
          <button type="button" className="nav" onClick={next} aria-label="下一頁">
            ›
          </button>
          <span className="sep" />
          <Stars value={mine} stat={stats[String(index + 1)]} onRate={onRate} />
        </div>
      </div>

      {portraitHint && <div className="portrait-hint">手機橫放，看得更清楚</div>}
    </div>
  );
}
