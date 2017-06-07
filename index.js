'use strict';

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

var check_dir; // = process.argv[2];
var selectors; // = process.argv[3].split(',');

var findcommand = process.argv[2];


/* 個別設定 -------------------- */
const TARGET_LIST = './data/list.txt';
const CHECK_DIR = './html/';
const SELECTER_QUERY = [
  "link[href*='/style.css']",
  //"html"
];
selectors = SELECTER_QUERY;
check_dir = CHECK_DIR;

const SEARCH_DATA = {
  mogeta : { selector : '.mogeta', htmlSelector : '.mogeta' },
};


if( typeof SEARCH_DATA[ findcommand ] === 'undefined' ) {
  console.log( 'command not found' );
  return;
}
var search_data_target = SEARCH_DATA[ findcommand ];

/* ファイルリスト作成 -------------------- */
// 検索後に対象になったhtmlのリストがあると便利だったので書き出しておく
execSync( "find " + check_dir + "* -type f -name '*.html' | sort > " + TARGET_LIST );

/* ファイルリストのストリーム作成 -------------------- */
var fs        = require('fs');
var readline  = require('readline');

var rs = fs.createReadStream( TARGET_LIST );
var rl = readline.createInterface(rs, {});

var cnt = 0;

/* 対象ファイル一覧から１行づつ処理 -------------------- */
rl.on('line', function( filepath ) {
  let htmlString = getHtmlSource( filepath );
  let result = findSelector( htmlString, selectors );

  if( result.isMatch  ) {
    echoHTML( filepath, result );
  }
});

function echoHTML( filepath, result ) {
  //let url = filepath.replace( CHECK_DIR, "http://sv.junic.jp/");
  let url = CHECK_DIR;

  let $result = result.$(search_data_target.selector);
  let $htmlResult = result.$(search_data_target.htmlSelector);

  if( $result.length > 0 ) {
    var hasMogeta = result.$(".mogeta").length;

    $htmlResult.each( function(){
      let $this    = result.$(this);
      let text     = $this.text();
      let elParent = $this.parent();
      let elPrev   = $this.prev();
      let elNext   = $this.next();
      text         = text.replace(/(\t|\r|\n)/g,'');

      cnt++;

      let output = '';
      output +=  cnt;
      output +=  '	';
      output +=  '	' + url;
      output +=  '	';
      output +=  '	' + text;
      output +=  '	' + text.length;
      output +=  '	' + getTagName( result.$(this) );
      output +=  '	' + result.$(this).attr('class');
      output +=  '	' + getTagName( elParent );
      output +=  '	' + elParent.attr('id');
      output +=  '	' + elParent.attr('class');
      output +=  '	' + getTagName( elPrev );
      output +=  '	' + elPrev.attr('id');
      output +=  '	' + elPrev.attr('class');
      output +=  '	' + getTagName( elNext );
      output +=  '	' + elNext.attr('id');
      output +=  '	' + elNext.attr('class');
      output +=  '	' + hasMogeta;

      console.log( output );
    });
  }
}

// getTagName cheerioのオブジェクトから要素名を取り出すだけの関数
function getTagName( el ) {
  var result = undefined;
  if( el.length !== 0 ) {
    result = el.get(0).tagName;
  }
  return result;
}
