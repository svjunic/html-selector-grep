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

const TARGET_LIST = "./data/target.txt";


/* ファイルリスト作成 -------------------- */
// 検索後に対象になったhtmlのリストがあると便利だったので書き出しておく
execSync( "find " + check_dir + "* -type f -name '*.html' | sort > " + TARGET_LIST );


/* ファイルリストのストリーム作成 -------------------- */
var fs        = require('fs');
var readline  = require('readline');

var rs = fs.createReadStream( TARGET_LIST );
var rl = readline.createInterface(rs, {});


/* 対象ファイル一覧から１行づつ処理 -------------------- */
rl.on('line', function( filepath ) {
  let htmlString = getHtmlSource( filepath );
  let result = findSelector( htmlString, selectors );

  if( result.isMatch && result.result.length === 2 ) {
    console.log( filepath );
    //console.log( result );
  }
});
