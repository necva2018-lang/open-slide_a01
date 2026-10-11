import { useEffect, useRef, useState } from 'react';
import { type DeckModule, decks } from 'virtual:decks';
import { Home } from './Home';
import { Player } from './Player';
import { fetchSummary, type Summary } from './rating';

// 網址用 #/01/5 這種形式：不需要伺服器轉址，GitHub Pages 直接可用
function parseHash(): { no: string; page: number } | null {
  const m = window.location.hash.match(/^#\/(\d{2})(?:\/(\d+))?/);
  return m ? { no: m[1], page: Number(m[2] ?? '1') } : null;
}

export function App() {
  const [route, setRoute] = useState(parseHash);
  const [mods, setMods] = useState<Record<string, DeckModule>>({});
  // 評分與瀏覽次數在背景讀取，不擋畫面
  const [summary, setSummary] = useState<Summary | null>(null);

  const refresh = () => fetchSummary().then((s) => s && setSummary(s));

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    for (const d of decks) d.load().then((m) => setMods((prev) => ({ ...prev, [d.no]: m })));
    refresh();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 從播放畫面回到首頁時，重新抓一次累積數字
  const prevRoute = useRef(route);
  useEffect(() => {
    if (prevRoute.current && !route) refresh();
    prevRoute.current = route;
  }, [route]);

  const deck = route ? decks.find((d) => d.no === route.no) : undefined;

  // 網址指到未開放的簡報就回首頁
  useEffect(() => {
    if (route && !deck) window.location.hash = '';
  }, [route, deck]);

  if (route && deck) {
    const mod = mods[deck.no];
    if (!mod) return <div className="loading">載入中…</div>;
    return (
      <Player
        no={deck.no}
        mod={mod}
        page={route.page}
        stats={summary?.pages[deck.no] ?? {}}
        onStat={(page, stat) =>
          setSummary((s) => {
            const base = s ?? { views: {}, pages: {} };
            return {
              ...base,
              pages: { ...base.pages, [deck.no]: { ...base.pages[deck.no], [page]: stat } },
            };
          })
        }
      />
    );
  }
  return <Home decks={decks} mods={mods} summary={summary} />;
}
