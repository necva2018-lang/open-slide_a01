// 星星評價與瀏覽次數：送到 Google Apps Script，學員自己的評分另存在瀏覽器
import { RATING_ENDPOINT } from './config';

export type PageStat = { avg: number; count: number };
export type Summary = {
  views: Record<string, number>;
  pages: Record<string, Record<string, PageStat>>;
};

function store(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function deviceId(): string {
  const s = store();
  let id = s?.getItem('student-device-id') ?? null;
  if (!id) {
    id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    s?.setItem('student-device-id', id);
  }
  return id;
}

export function myRating(deck: string, page: number): number {
  return Number(store()?.getItem(`rating:${deck}:${page}`) ?? 0);
}

async function post(body: Record<string, unknown>) {
  if (!RATING_ENDPOINT) return null;
  // 用 text/plain 送出，避免跨網域預檢（Apps Script 不支援 OPTIONS）
  const res = await fetch(RATING_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function rate(deck: string, page: number, stars: number): Promise<PageStat | null> {
  store()?.setItem(`rating:${deck}:${page}`, String(stars));
  try {
    const r = (await post({ action: 'rate', device: deviceId(), deck, page, stars })) as {
      stat?: PageStat;
    } | null;
    return r?.stat ?? null;
  } catch {
    return null;
  }
}

// 同一個分頁視窗裡重複開同一份簡報只算一次
export function countView(deck: string) {
  let ss: Storage | null = null;
  try {
    ss = window.sessionStorage;
  } catch {}
  const key = `viewed:${deck}`;
  if (ss?.getItem(key)) return;
  ss?.setItem(key, '1');
  post({ action: 'view', deck }).catch(() => {});
}

export async function fetchSummary(): Promise<Summary | null> {
  if (!RATING_ENDPOINT) return null;
  // 最多等 20 秒，連不上就當作沒有資料
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${RATING_ENDPOINT}?action=summary`, { signal: ctrl.signal });
    return (await res.json()) as Summary;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
