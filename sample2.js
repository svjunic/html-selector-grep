'use strict';

/**
 * @fileOverview app.js
 *
 * @author sv.junic
 */

/**
 * ディレクトリ以下のhtmlファイルからセレクタでgrepする
 *
 * @param {String} process.argv[0]
 * @param {String} process.argv[1]
 * @param {String} process.argv[2] 対象ディレクトリ
 * @param {String} process.argv[3] セレクタ "selector,selector"のカンマ区切りで記述
 */

const execSync = require('child_process').execSync;

var getHtmlSource = require( './modules/getHtmlSource.js' );
var findSelector  = require( './modules/findSelector.js' );

var check_dir = process.argv[2];
var selectors = process.argv[3].split(',');

/* ファイル検索 -------------------- */
// findで結果を取得
var resourceArray = execSync("find " + check_dir + "* -type f -name '*.html'").toString().split('\n');

// 最後から空の行なので削除
resourceArray.pop();

/* 1ファイルづつ処理（キャッシュすると重くて辛い） -------------------- */
while( resourceArray.length > 0 ) {
  // 回す
  let filepath = resourceArray.pop();

  let htmlString = getHtmlSource( filepath );
  let result = findSelector( htmlString, selectors );

  //console.log( result, selectors );

  let pc  = result.$( "table.tbl.branch-1.center td" ).eq(0).html();
  let sp  = result.$( "table.tbl.branch-1.center td" ).eq(1).html();
  let md  = result.$( "table.tbl.branch-1.center td" ).eq(2).html();
  let one = result.$( "table.tbl.branch-1.center td" ).eq(3).html();

  let tpc  = result.$( "table.tbl.branch-1.center td" ).eq(0).html();
  let tsp  = result.$( "table.tbl.branch-1.center td" ).eq(1).html();
  let tmd  = result.$( "table.tbl.branch-1.center td" ).eq(2).html();
  let tone = result.$( "table.tbl.branch-1.center td" ).eq(3).html();
  console.log( filepath, pc, sp, md, one );
}
