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
```
- このサンプルはhtmlのリストを取得してその中でgrepしたい時の例
- 必要に応じて適当に。
