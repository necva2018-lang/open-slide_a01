// 講師站建置後處理：把「密碼畫面」與「學員站開放設定」面板注入 dist/index.html。
// 注意：GitHub Pages 是純靜態網站，密碼畫面只能擋一般人，懂技術的人可以繞過。
// 開放設定則由 Google Apps Script 端驗證密碼，學員無法自行修改。
// 改密碼：把新密碼的 SHA-256 填到 HASH，並同步改 student/apps-script.gs 的 ADMIN_HASH
// （node -e "console.log(require('crypto').createHash('sha256').update('新密碼').digest('hex'))"）
import fs from 'node:fs';

const HASH = '0dfaa2548fff16d3e2945fa4685ada1d5c373c28ff08044483b1534ab2350c3d';
const file = new URL('../dist/index.html', import.meta.url);
const slidesDir = new URL('../slides/', import.meta.url);
const configFile = new URL('../student/src/config.ts', import.meta.url);
const publicFile = new URL('../student/public.json', import.meta.url);
let html = fs.readFileSync(file, 'utf8');
// 從建置結果的 script 路徑推回網站前綴（例如 /open-slide_a01/）
const BASE = (html.match(/src="([^"]*)assets\//) || [])[1] || '/';

// 簡報清單（編號＋標題），給開放設定面板用
const decks = fs
  .readdirSync(slidesDir)
  .filter((d) => /^\d{2}-/.test(d))
  .sort()
  .map((dir) => {
    const src = fs.readFileSync(new URL(`${dir}/index.tsx`, slidesDir), 'utf8');
    const meta = src.slice(src.indexOf('export const meta'));
    const title = (meta.match(/title:\s*'([^']*)'/) || [])[1] || dir;
    return { no: dir.slice(0, 2), title: title.replace(/^\d{2}｜/, '') };
  });
const endpoint = (fs.readFileSync(configFile, 'utf8').match(/RATING_ENDPOINT\s*=\s*'([^']*)'/) || [])[1] || '';
const defaultPublic = JSON.parse(fs.readFileSync(publicFile, 'utf8')).public;

const gate = `<script>(function(){
var H='${HASH}',K='lecturer-pass';
try{if(localStorage.getItem(K)===H)return;}catch(e){}
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
if(hex(b)===H){try{localStorage.setItem(K,H);localStorage.setItem('lecturer-key',i.value)}catch(e){}w.remove();root.style.visibility='';}
else{err.textContent='密碼不正確';i.select();}});});
}
if(document.body)show();else document.addEventListener('DOMContentLoaded',show);
})();</script>`;

// 首頁右下角「學員站開放設定」：每份簡報一個開關，存到 Google 試算表，學員站即時生效
const panel = `<script>(function(){
var EP=${JSON.stringify(endpoint)},DECKS=${JSON.stringify(decks)},DEF=${JSON.stringify(defaultPublic)},BASE=${JSON.stringify(BASE)};
var pub=null,busy=false,btn,box;
function css(el,s){el.style.cssText=s;return el}
function isHome(){var p=location.pathname;return p===BASE||p+'/'===BASE}
function key(){var k='';try{k=localStorage.getItem('lecturer-key')||''}catch(e){}
if(!k){k=prompt('請輸入講師密碼')||'';if(k)try{localStorage.setItem('lecturer-key',k)}catch(e){}}return k}
function render(){
var on=pub||DEF;
var h='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><b style="font-size:16px">學員站開放設定</b>'
+'<button data-x style="border:0;background:none;font-size:18px;cursor:pointer;color:#6d655b">✕</button></div>'
+'<p style="margin:0 0 12px;color:#6d655b;font-size:12px;line-height:1.5">打開的簡報學員看得到，切換後學員重新整理就生效。'
+'<a href="'+BASE+'student/" target="_blank" style="color:#b5562b">開啟學員站 ↗</a></p>';
if(!EP){h+='<p style="color:#b3261e;font-size:13px;line-height:1.6">尚未接上 Google 試算表（student/src/config.ts 的 RATING_ENDPOINT），開關無法使用。<br>目前學員站顯示：'+DEF.join('、')+'</p>';}
else if(pub===null&&!box.dataset.loaded){h+='<p style="font-size:13px;color:#6d655b">讀取中…</p>';}
else{DECKS.forEach(function(d){var o=on.indexOf(d.no)>=0;
h+='<label style="display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid #eee6da;cursor:pointer;font-size:14px">'
+'<b style="min-width:24px;color:#b5562b">'+d.no+'</b><span style="flex:1;line-height:1.4">'+d.title.replace(/</g,'&lt;')+'</span>'
+'<input type="checkbox" data-no="'+d.no+'" '+(o?'checked':'')+(busy?' disabled':'')+' style="width:18px;height:18px;accent-color:#b5562b;cursor:pointer"></label>';});
h+='<p data-msg style="min-height:18px;margin:8px 0 0;font-size:12px;color:#6d655b"></p>';}
box.innerHTML=h;
box.querySelector('[data-x]').onclick=function(){box.style.display='none'};
box.querySelectorAll('input[data-no]').forEach(function(c){c.onchange=function(){toggle(c.dataset.no,c.checked)}});
}
function msg(t,err){var m=box.querySelector('[data-msg]');if(m){m.textContent=t;m.style.color=err?'#b3261e':'#2e7d32'}}
function load(){if(!EP)return render();
fetch(EP+'?action=summary').then(function(r){return r.json()}).then(function(s){pub=s.public||null;box.dataset.loaded='1';render()})
.catch(function(){box.dataset.loaded='1';render();msg('讀取失敗，顯示的是預設值',true)});}
function toggle(no,on){
var k=key();if(!k){render();return}
var cur=(pub||DEF).filter(function(x){return x!==no});if(on)cur.push(no);
busy=true;render();msg('儲存中…');
fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
body:JSON.stringify({action:'setPublic',key:k,decks:DECKS.map(function(d){return{no:d.no,title:d.title,on:cur.indexOf(d.no)>=0}})})})
.then(function(r){return r.json()}).then(function(r){busy=false;
if(r.ok){pub=r.public||[];render();msg('已儲存：'+(pub.length?pub.join('、'):'全部關閉'))}
else{if(r.error==='密碼不正確')try{localStorage.removeItem('lecturer-key')}catch(e){}render();msg(r.error||'儲存失敗',true)}})
.catch(function(){busy=false;render();msg('儲存失敗，請檢查網路',true)});
}
function init(){
btn=css(document.createElement('button'),'position:fixed;right:20px;bottom:20px;z-index:2147483000;padding:10px 16px;border:0;border-radius:999px;background:#b5562b;color:#fff;font:700 14px "Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer');
btn.textContent='學員站開放設定';
box=css(document.createElement('div'),'display:none;position:fixed;right:20px;bottom:72px;z-index:2147483000;width:min(380px,calc(100vw - 40px));max-height:calc(100vh - 110px);overflow:auto;padding:16px 18px;border-radius:14px;background:#fff;color:#1f1b16;color-scheme:light;border:1px solid #e2dbd0;box-shadow:0 12px 40px rgba(0,0,0,.25);font-family:"Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif');
btn.onclick=function(){var open=box.style.display==='none';box.style.display=open?'block':'none';if(open){render();load()}};
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
  console.log(`已加上講師密碼畫面與開放設定面板（${decks.length} 份簡報）`);
}
