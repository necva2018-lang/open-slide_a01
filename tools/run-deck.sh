#!/bin/bash
# 用法：bash run-deck.sh <id> <色票> <標題> <章節json> <頁面檔> <頁數> <輸出資料夾名>
# 組簡報 → 逐頁截圖＋檢查爆版 → 產生縮圖總覽
cd "$(dirname "$0")"
id="$1"; pal="$2"; title="$3"; chap="$4"; pages="$5"; n="$6"; out="$7"
node build-deck.mjs "$id" "$pal" "$title" "$chap" "$pages" || exit 1
sleep 4
node shoot.mjs "$id" "$out" 1920 1080 1 "$n" 2>&1 | grep -v ": ok"
python -I sheet.py "$out" "sheet_$out" 6
echo "done $id"
