import { useEffect, useMemo, useRef, useState } from 'react';
import { type DeckModule, decks, defaultPublic } from 'virtual:decks';
import { Home } from './Home';
import { Player } from './Player';
import { fetchSummary, type Summary } from './rating';

// 網址用 #/01/5 這種形式：不需要伺服器轉址，GitHub Pages 直接可用
function parseHash(): { no: string; page: number } | null {
  const m = window.location.hash.match(/^#\/(\d{2})(?:\/(\d+))?/);
  return m ? { no: m[1], page: Number(m[2] ?? '1') } : null;
}

const CACHE_KEY = 'student-public-list';

// 上次從試算表拿到的開放清單；null＝沒有快取
function readCachedPublic(): string[] | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

function writeCachedPublic(list: string[]) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {}
}

export function App() {
  const [route, setRoute] = useState(parseHash);
  const [mods, setMods] = useState<Record<string, DeckModule>>({});
  const [summary, setSummary] = useState<Summary | null>(null);
  // Apps Script 有時要好幾秒：有快取就先顯示，背景再向試算表更新
  const [cached] = useState(readCachedPublic);
  // fresh：這次開啟已向試算表問過（成功或失敗都算）
  const [fresh, setFresh] = useState(false);

  const refresh = () =>
    fetchSummary().then((s) => {
      if (s) {
        setSummary(s);
        writeCachedPublic(s.public ?? defaultPublic);
      }
      setFresh(true);
    });

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    refresh();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 從播放畫面回到首頁時，重新抓一次累積數字與開放清單
  const prevRoute = useRef(route);
  useEffect(() => {
    if (prevRoute.current && !route) refresh();
    prevRoute.current = route;
  }, [route]);

  const visible = useMemo(() => {
    const list = summary ? (summary.public ?? defaultPublic) : (cached ?? defaultPublic);
    return decks.filter((d) => list.includes(d.no));
  }, [summary, cached]);

  // 只載入開放中的簡報
  useEffect(() => {
    for (const d of visible) {
      if (!mods[d.no]) d.load().then((m) => setMods((prev) => ({ ...prev, [d.no]: m })));
    }
  }, [visible, mods]);

  const deck = route ? visible.find((d) => d.no === route.no) : undefined;

  // 確認過最新清單後，網址仍指到未開放的簡報就回首頁
  useEffect(() => {
    if (fresh && route && !deck) window.location.hash = '';
  }, [fresh, route, deck]);

  // 第一次來（沒有快取）要等試算表回覆，避免先顯示預設清單又跳動
  if (!fresh && cached === null) return <div className="loading">載入中…</div>;
  if (route && !deck) return <div className="loading">載入中…</div>;

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
