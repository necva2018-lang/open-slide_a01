// 講師站簡易密碼：建置後把密碼畫面注入 dist/index.html。
// 注意：GitHub Pages 是純靜態網站，這只能擋一般人，懂技術的人可以繞過。
// 改密碼：把新密碼的 SHA-256 填到 HASH（node -e "console.log(require('crypto').createHash('sha256').update('新密碼').digest('hex'))"）
import fs from 'node:fs';

const HASH = '0dfaa2548fff16d3e2945fa4685ada1d5c373c28ff08044483b1534ab2350c3d';
const file = new URL('../dist/index.html', import.meta.url);

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
if(hex(b)===H){try{localStorage.setItem(K,H)}catch(e){}w.remove();root.style.visibility='';}
else{err.textContent='密碼不正確';i.select();}});});
}
if(document.body)show();else document.addEventListener('DOMContentLoaded',show);
})();</script>`;

let html = fs.readFileSync(file, 'utf8');
if (html.includes("K='lecturer-pass'")) {
  console.log('密碼畫面已存在，略過');
} else {
  html = html.replace('<head>', `<head>${gate}`);
  html = html.replace('</head>', '<meta name="robots" content="noindex"></head>');
  fs.writeFileSync(file, html);
  console.log('已加上講師密碼畫面');
}
