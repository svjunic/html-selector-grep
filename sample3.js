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

const TARGET_LIST = "./data/target.txt";


/* ファイルリスト作成 -------------------- */
// 検索後に対象になったhtmlのリストがあると便利だったので書き出しておく
execsyncs( "find " + check_dir + "* -type f -name '*.html' > " + TARGET_LIST );


/* ファイルリストのストリーム作成 -------------------- */
var fs        = require('fs');
var readline  = require('readline');

var rs = fs.createReadStream( TARGET_LIST );
var rl = readline.createInterface(rs, {});


/* 対象ファイル一覧から１行づつ処理 -------------------- */
rl.on('line', function( filepath ) {
  let htmlString = getHtmlSource( filepath );
  let result = findSelector( htmlString, selectors );

  if( result.isMatch ) {
    result.$('textarea').empty();
    if(  result.$('.tbl thead th:last-of-type').length  !== 0 ){
      console.log( filepath );
    }
  }
});
