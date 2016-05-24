# html-selector-grep
htmlをセレクタでgrepしたり、そのなかで更にJSを使った絞り込みをしてリストアップしたい時に使えそうなもの
grepだとコメントアウトされている部分までカウントしてしまい、面倒だったので作った。
結局コードは書く。

## サンプルの場合の使い方
```
// table.mogetaがあるページのリストが作りたい
node sample.js {$パス} "table.mogeta"

// mogeta.cssを読み込んでいて、table.mogetaがあるページのリストが作りたい
node sample.js {$パス} "link[href$='/modules.css'],table.mogeta"

// 特定のhtmlから特定の情報だけ取得したい
node sample2.js {$パス} "div#test"

// 特定のhtmlからhtmlを取得したい（textareaと特定のdivはカウントしたくない）
node sample3.js {$パス} ".tbl th:last-of-type"
```
- このサンプルはhtmlのリストを取得してその中でgrepしたい時の例
- 必要に応じて適当に。
