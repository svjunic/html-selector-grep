'use strict';

var _ = require('lodash');

/*
 * @filename findSelector.js
 */

var findSelector = function ( htmlString, selectorArray ) {
  //return new Promise( function ( resolve, reject ) {
  //  resolve( {
  //    isMatch       : isMatch,
  //    isError       : isError,
  //    filepath      : filepath,
  //    matchSelector : []
  //  };
  //});
 
  // 毎回読み込まないとキャッシュが残りメモリリーク
  var cheerio = require('cheerio');

  var matchSelector     = [];
  var matchCheerioArray = [];

  var $ = cheerio.load( htmlString, {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: false // 読み込み時に既にデコード済みなので不要
  });

  var isMatch      = false;
  var isError      = false;

  try {
    // dom検索
    _.forEach( selectorArray, function ( selector, key, object ) {

      var $link = $( selector );

      if( $link.length > 0 ) {
        isMatch = true;
        matchSelector.push( selector );
        matchCheerioArray.push( $link );
      } else {
        isMatch = isMatch || false;
      }
    });
  } catch (e) {
    // エラー時
    isMatch = false;
    console.log(( 'cheerio selector error : ' + findSelector ).bgRed );
  }

  return {
    isMatch       : isMatch,
    isError       : isError,
    matchSelector : matchSelector,
    result        : matchCheerioArray,
    $             : $
  };
};

module.exports = findSelector;

