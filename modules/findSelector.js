'use strict';

var _ = require('lodash');

/*
 * 引数のhtmlテキストデータから引数のセレクタを持つか持たないか判断する
 *
 * @filename findSelector.js
 * @param {String} htmlString htmlのテキストデータ
 * @param {String,Array} selectors CSSSelectorの文字列、又はCSSSelectorの配列
 */

var findSelector = function ( htmlString, selectors ) {
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


  // selectorsが文字列の場合は配列に変換
  var selectorArray;
  if( typeof selectors === "string" ) {
    selectorArray = [];
    selectorArray.push( selectors );
  } else {
    selectorArray = selectors;
  }


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

