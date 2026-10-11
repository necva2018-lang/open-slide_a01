// 講師站建置後處理：把「密碼畫面」與「學員站開放清單」面板注入 dist/index.html。
// 注意：GitHub Pages 是純靜態網站，密碼畫面只能擋一般人，懂技術的人可以繞過。
// 開放哪幾份簡報由 student/public.json（標記檔）決定；面板只顯示狀態並連到 GitHub 編輯頁。
// 改密碼：把新密碼的 SHA-256 填到 HASH
// （node -e "console.log(require('crypto').createHash('sha256').update('新密碼').digest('hex'))"）
import fs from 'node:fs';

const HASH = '0dfaa2548fff16d3e2945fa4685ada1d5c373c28ff08044483b1534ab2350c3d';
const EDIT_URL = 'https://github.com/necva2018-lang/open-slide_a01/edit/main/student/public.json';
const ACTIONS_URL = 'https://github.com/necva2018-lang/open-slide_a01/actions';
const file = new URL('../dist/index.html', import.meta.url);
const slidesDir = new URL('../slides/', import.meta.url);
const publicFile = new URL('../student/public.json', import.meta.url);
let html = fs.readFileSync(file, 'utf8');
// 從建置結果的 script 路徑推回網站前綴（例如 /open-slide_a01/）
const BASE = (html.match(/src="([^"]*)assets\//) || [])[1] || '/';

// 簡報清單（編號＋標題）與目前開放狀態，給面板顯示用
const open = JSON.parse(fs.readFileSync(publicFile, 'utf8')).public.map((x) => String(x).padStart(2, '0'));
const decks = fs
  .readdirSync(slidesDir)
  .filter((d) => /^\d{2}-/.test(d))
  .sort()
  .map((dir) => {
    const src = fs.readFileSync(new URL(`${dir}/index.tsx`, slidesDir), 'utf8');
    const meta = src.slice(src.indexOf('export const meta'));
    const title = (meta.match(/title:\s*'([^']*)'/) || [])[1] || dir;
    const no = dir.slice(0, 2);
    return { no, title: title.replace(/^\d{2}｜/, ''), on: open.includes(no) };
  });

const gate = `<script>(function(){
var H='${HASH}',K='lecturer-pass';
try{localStorage.removeItem('lecturer-key');if(localStorage.getItem(K)===H)return;}catch(e){}
var root=document.documentElement;root.style.visibility='hidden';
function hex(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
function show(){
var w=document.createElement('div');
w.style.cssText='position:fixed;inset:0;z-index:2147483647;visibility:visible;display:grid;place-items:center;background:#f6f3ee;font-family:"Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif';
w.innerHTML='<form style="background:#fff;padding:32px 28px;border-radius:14px;border:1px solid #e2dbd0;width:min(360px,calc(100vw - 32px));box-shadow:0 10px 30px rgba(0,0,0,.08)">'
+'<h1 style="margin:0 0 6px;font-size:22px;color:#1f1b16">講師專區</h1>'
+'<p style="margin:0 0 18px;color:#6d655b;font-size:14px">請輸入密碼</p>'
+'<input type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:10px 12px;font-size:16px;border:1px solid #cfc6b8;border-radius:8px;background:#fff;color:#1f1b16;color-scheme:light">'
+'<p data-err style="min-height:20px;margin:8px 0;color:#b3261e;font-size:13px"></p>'
+'<button style="width:100%;padding:10px;font-size:16px;font-weight:700;border:0;border-radius:8px;background:#b5562b;color:#fff;cursor:pointer">進入</button></form>';
document.body.appendChild(w);
var f=w.querySelector('form'),i=w.querySelector('input'),err=w.querySelector('[data-err]');i.focus();
f.addEventListener('submit',function(e){e.preventDefault();
crypto.subtle.digest('SHA-256',new TextEncoder().encode(i.value)).then(function(b){
if(hex(b)===H){try{localStorage.setItem(K,H)}catch(e){}w.remove();root.style.visibility='';}
else{err.textContent='密碼不正確';i.select();}});});
}
if(document.body)show();else document.addEventListener('DOMContentLoaded',show);
})();</script>`;

// 首頁右下角「學員站開放清單」：顯示目前開放狀態，連到 GitHub 編輯標記檔
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = decks
  .map(
    (d) =>
      `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid #eee6da;font-size:14px${d.on ? '' : ';color:#9a9187'}">` +
      `<b style="min-width:24px;color:${d.on ? '#b5562b' : '#b8afa3'}">${d.no}</b><span style="flex:1;line-height:1.4">${esc(d.title)}</span>` +
      `<span style="font-size:12px;font-weight:700;color:${d.on ? '#2e7d32' : '#b8afa3'}">${d.on ? '● 開放' : '○ 未開放'}</span></div>`,
  )
  .join('');
const panelHtml =
  `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><b style="font-size:16px">學員站開放清單</b>` +
  `<button data-x style="border:0;background:none;font-size:18px;cursor:pointer;color:#6d655b">✕</button></div>${rows}` +
  `<div style="margin-top:12px;padding:10px 12px;border-radius:8px;background:#f6f3ee;font-size:12px;line-height:1.7;color:#4a433b">` +
  `<b>要開放或關閉：</b>按下方按鈕到 GitHub，把 <code>"public"</code> 裡的編號加進或刪掉（例：<code>["01", "02", "03"]</code>），` +
  `再按右上角綠色 <b>Commit changes</b>。約 1～2 分鐘後學員站自動更新。</div>` +
  `<div style="display:flex;gap:8px;margin-top:12px">` +
  `<a href="${EDIT_URL}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px;border-radius:8px;background:#b5562b;color:#fff;font-weight:700;font-size:14px;text-decoration:none">編輯開放清單 ↗</a>` +
  `<a href="${BASE}student/" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:9px;border-radius:8px;border:1px solid #b5562b;color:#b5562b;font-weight:700;font-size:14px;text-decoration:none">開啟學員站 ↗</a></div>` +
  `<p style="margin:10px 0 0;font-size:11px;color:#9a9187">更新進度可在 <a href="${ACTIONS_URL}" target="_blank" rel="noopener" style="color:#9a9187">GitHub Actions</a> 查看；這份清單在部署完成、重新整理講師站後才會更新。</p>`;

const panel = `<script>(function(){
var BASE=${JSON.stringify(BASE)},HTML=${JSON.stringify(panelHtml)};
function css(el,s){el.style.cssText=s;return el}
function isHome(){var p=location.pathname;return p===BASE||p+'/'===BASE}
function init(){
var btn=css(document.createElement('button'),'position:fixed;right:20px;bottom:20px;z-index:2147483000;padding:10px 16px;border:0;border-radius:999px;background:#b5562b;color:#fff;font:700 14px "Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer');
btn.textContent='學員站開放清單';
var box=css(document.createElement('div'),'display:none;position:fixed;right:20px;bottom:72px;z-index:2147483000;width:min(400px,calc(100vw - 40px));max-height:calc(100vh - 110px);overflow:auto;padding:16px 18px;border-radius:14px;background:#fff;color:#1f1b16;color-scheme:light;border:1px solid #e2dbd0;box-shadow:0 12px 40px rgba(0,0,0,.25);font-family:"Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif');
box.innerHTML=HTML;
box.querySelector('[data-x]').onclick=function(){box.style.display='none'};
btn.onclick=function(){box.style.display=box.style.display==='none'?'block':'none'};
document.body.appendChild(btn);document.body.appendChild(box);
// 只在講師站首頁顯示，播放簡報時不干擾
setInterval(function(){var h=isHome();btn.style.display=h?'':'none';if(!h)box.style.display='none'},500);
}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();</script>`;

if (html.includes("K='lecturer-pass'")) {
  console.log('講師站注入內容已存在，略過');
} else {
  html = html.replace('<head>', `<head>${gate}`);
  html = html.replace('</head>', '<meta name="robots" content="noindex"></head>');
  html = html.replace('</body>', `${panel}</body>`);
  fs.writeFileSync(file, html);
  console.log(`已加上講師密碼畫面與開放清單面板（開放 ${open.join('、') || '無'}）`);
}
