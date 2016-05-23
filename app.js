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

require('./modules/config.js');

var colors    = require('colors');


var _         = require('lodash');
var execsyncs = require('execsyncs');

var getHtmlSource = require( './modules/getHtmlSource.js' );
var findSelector  = require( './modules/findSelector.js' );

var check_dir = process.argv[2];
var selectors = process.argv[3].split(',');

/* ファイル検索 -------------------- */
// NOTE: （シェル使いからしたら邪魔かもしれない）
// findで結果を取得
var resourceArray = execsyncs("find " + check_dir + "* -type f -name '*.html'").toString().split('\n');

// 最後から空の行なので削除
resourceArray.pop();


/* 1ファイルづつ処理（キャッシュすると重くて辛い） -------------------- */
while( resourceArray.length > 0 ) {
// 回す
var filepath = resourceArray.pop();

var htmlString = getHtmlSource( filepath );
var result = findSelector( htmlString, selectors );

console.log( result, selectors );

}
