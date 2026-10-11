import { useEffect, useMemo, useState } from 'react';
import { type DeckModule, decks, defaultPublic } from 'virtual:decks';
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
  const [summary, setSummary] = useState<Summary | null>(null);
  // 第一次向試算表詢問公開清單之前，先不顯示任何簡報
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    fetchSummary().then((s) => {
      setSummary(s);
      setReady(true);
    });
  }, []);

  // 回首頁時重新抓一次累積數字與公開清單
  useEffect(() => {
    if (!route && ready) fetchSummary().then((s) => s && setSummary(s));
  }, [route, ready]);

  const visible = useMemo(() => {
    const list = summary?.public ?? defaultPublic;
    return decks.filter((d) => list.includes(d.no));
  }, [summary]);

  // 只載入開放中的簡報
  useEffect(() => {
    for (const d of visible) {
      if (!mods[d.no]) d.load().then((m) => setMods((prev) => ({ ...prev, [d.no]: m })));
    }
  }, [visible, mods]);

  const deck = route ? visible.find((d) => d.no === route.no) : undefined;
  // 網址指到未開放的簡報時，回首頁
  useEffect(() => {
    if (ready && route && !deck) window.location.hash = '';
  }, [ready, route, deck]);

  if (!ready) return <div className="loading">載入中…</div>;

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
  return <Home decks={visible} mods={mods} summary={summary} />;
}
