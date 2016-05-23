'use strict';

/*
 * @filename findSelector.js
 */

var iconvlite = require('iconv-lite');
var fs        = require('fs');

// ファイル扱うので非同期
var getHtmlSource = function( filepath ) {
  // ファイルの読み込み
  var htmlString = fs.readFileSync( filepath, 'utf8' );

  try {
    // meta指定の文字コードからデコード（metaがない場合はスルー）
    var result = htmlString.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);
    if( result !== null &&
        typeof result.length === 'number' &&
        result.length > 1 &&
        result[1] !== '' ) {
      var htmlBuffer = fs.readFileSync( filepath );
      htmlString = iconvlite.decode( htmlBuffer, result[1] );
    }
  } catch (e) {
    //console.log( filepath,e );
    //console.log( htmlString );
  }

  return htmlString;
};

module.exports = getHtmlSource;
