/**
 * 學員站「星星評價＋瀏覽次數」後端（Google Apps Script，綁在一份 Google 試算表上）
 *
 * 試算表會自動建立三張工作表：
 *   評分紀錄：每台裝置對每一頁只留一筆（重按會覆蓋），匿名
 *   頁面統計：每份簡報每一頁的評分人數與平均星數（公式自動算）
 *   瀏覽次數：每份簡報被開啟的累積次數
 */

const LOG = '評分紀錄';
const STAT = '頁面統計';
const VIEW = '瀏覽次數';

function doGet() {
  return json_(summary_());
}

function doPost(e) {
  const d = JSON.parse((e.postData && e.postData.contents) || '{}');
  const deck = String(d.deck || '');
  if (!/^\d{2}$/.test(deck)) return json_({ ok: false, error: 'bad deck' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (d.action === 'view') {
      addView_(deck);
      return json_({ ok: true });
    }
    if (d.action === 'rate') {
      const page = Number(d.page);
      const stars = Number(d.stars);
      const device = String(d.device || '').slice(0, 64);
      if (!(page >= 1 && page <= 300) || !(stars >= 1 && stars <= 5) || !device) {
        return json_({ ok: false, error: 'bad input' });
      }
      saveRating_(device, deck, Math.floor(page), Math.round(stars));
      return json_({ ok: true, stat: pageStat_(deck, Math.floor(page)) });
    }
    return json_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  if (name === LOG) {
    sh.appendRow(['識別碼', '時間', '簡報', '頁碼', '星數']);
    sh.getRange('C:C').setNumberFormat('@');
  } else if (name === VIEW) {
    sh.appendRow(['簡報', '瀏覽次數']);
    sh.getRange('A:A').setNumberFormat('@');
  } else if (name === STAT) {
    sheet_(LOG);
    sh.getRange('A1').setFormula(
      "=QUERY('" + LOG + "'!C:E,\"select C, D, count(E), avg(E) where C is not null group by C, D order by C, D label C '簡報', D '頁碼', count(E) '評分人數', avg(E) '平均星數'\",1)",
    );
  }
  sh.setFrozenRows(1);
  return sh;
}

function findRow_(sh, col, value) {
  const hit = sh.getRange(1, col, sh.getLastRow(), 1).createTextFinder(value).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function saveRating_(device, deck, page, stars) {
  const sh = sheet_(LOG);
  sheet_(STAT);
  const key = device + '|' + deck + '|' + page;
  const row = [key, new Date(), deck, page, stars];
  const r = findRow_(sh, 1, key);
  if (r) sh.getRange(r, 1, 1, 5).setValues([row]);
  else sh.appendRow(row);
}

function addView_(deck) {
  const sh = sheet_(VIEW);
  const r = findRow_(sh, 1, deck);
  if (r) sh.getRange(r, 2).setValue(Number(sh.getRange(r, 2).getValue()) + 1);
  else sh.appendRow([deck, 1]);
}

function ratings_() {
  const sh = sheet_(LOG);
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 3, n, 3).getValues() : [];
}

function pageStat_(deck, page) {
  let sum = 0;
  let count = 0;
  ratings_().forEach(function (r) {
    if (String(r[0]) === deck && Number(r[1]) === page) {
      sum += Number(r[2]);
      count++;
    }
  });
  return { avg: count ? sum / count : 0, count: count };
}

function summary_() {
  const acc = {};
  ratings_().forEach(function (r) {
    const deck = String(r[0]);
    const page = String(r[1]);
    acc[deck] = acc[deck] || {};
    const s = (acc[deck][page] = acc[deck][page] || { sum: 0, count: 0 });
    s.sum += Number(r[2]);
    s.count++;
  });
  const pages = {};
  Object.keys(acc).forEach(function (deck) {
    pages[deck] = {};
    Object.keys(acc[deck]).forEach(function (page) {
      const s = acc[deck][page];
      pages[deck][page] = { avg: s.sum / s.count, count: s.count };
    });
  });

  const views = {};
  const vs = sheet_(VIEW);
  const n = vs.getLastRow() - 1;
  if (n > 0) {
    vs.getRange(2, 1, n, 2).getValues().forEach(function (r) {
      views[String(r[0])] = Number(r[1]);
    });
  }
  return { views: views, pages: pages };
}


function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 第一次部署前可以手動執行一次，先建立三張工作表並完成授權 */
function setup() {
  sheet_(LOG);
  sheet_(STAT);
  sheet_(VIEW);
}
