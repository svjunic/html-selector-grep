'use strict';

var debug = false;

var includeHtml = {
  create: function( options ){
    var app = {
      db_path : '',
      constructor : function ( options ) {
        this.colors    = require('colors');
        this.iconvlite = require('iconv-lite');
        this._         = require('lodash');

        this.db_path = options.db_path;

        this.mongoose = options.mongoose;

        this.Schema   = this.mongoose.Schema;

        // スキーマ作成
        this.HtmlSchema = new this.Schema({
          url                   : { type : String, default : '' }, // 検査URL
          path                  : { type : String, default : '' }, // パス
          html                  : { type : String, default : '' }, // html自身
          doctypeName           : { type : String, default : '' }, // doctype name
          doctypeInternalSubset : { type : String, default : '' }, // doctype internalSubset
          doctypePublicId       : { type : String, default : '' }, // doctype publicId
          doctypeSystemId       : { type : String, default : '' }  // doctype systemId
        });

        // コレクションとの関連付け
        this.mongoose.model( 'html', this.HtmlSchema );
      },

      _inputDb: function( promise, urlinfo, htmlString ) {
        var _this = this;

        /* {{{ モジュールリフレッシュ
        }}}*/
        var jsdom   = require('jsdom');

        // ドキュメント ベース作成
        var html = new (this.mongoose.model( 'html' ))();
        
        html.url  = ( typeof urlinfo.url  === 'string' )? urlinfo.url : '';
        html.path = ( typeof urlinfo.path === 'string' )? urlinfo.path : '';
        html.html = ( typeof htmlString   === 'string' )? htmlString : '';

        /* {{{ jsdom メモ
          ・url（文字列）
          HTML コンテンツの baseURI。
          コンテンツに含まれる相対パスの baseURI として使用されます。
          省略時は baseURI が存在しないため相対パスはそのまま処理されます。その場合、コンテンツ中の相対パスで指定された外部リソースの取得は失敗します。
          
          ・features.FetchExternalResources（配列）
          外部リソースを取得するタグを列挙します。デフォルトでは script タグで指定されたファイルを取得します。
          空文字列または null など偽評価値を渡すと外部リソースをダウンロードしなくなります。
          
          ・features.ProcessExternalResources（配列）
          外部リソースから実行するタグを列挙します。デフォルトでは script タグの JavaScript を実行します。
          空文字列または null など偽評価値を渡すと外部リソースを実行しなくなります。
          
          ・QuerySelector（Boolean）
          true の場合、Sizzle CSS Selector Engine を有効にします。デフォルトは false です。
          （jQuery を使う場合は、jQuery 本体に CSS Selector が含まれていますので QuerySelector を有効にする必要はありません。）
        }}} */

        /* {{{ jsdom使う場合 }}} */

        // 初期dom取得

        if( debug ) console.log( 'Dom変換' );

        var document = jsdom.jsdom( htmlString, {
          features : {
            ProcessExternalResources : false,
            FetchExternalResources   : false,
            QuerySelector            : true
          }
        });

        if( document.doctype !== null ) {
          html.doctypeName           = document.doctype.name || '';
          html.doctypeInternalSubset = document.doctype.internalSubset || '';
          html.doctypePublicId       = document.doctype.publicId || '';
          html.doctypeSystemId       = document.doctype.systemId || '';
        }else{
          html.doctypeName           = '判定不可';
          html.doctypeInternalSubset = '';
          html.doctypePublicId       = '';
          html.doctypeSystemId       = '';
        }

        if( debug ) {
          var link = document.querySelectorAll( 'link[rel="stylesheet"]' );
          if( link.length > 0 ) {
            console.log( link[0].getAttribute('href') );
          } else {
            console.log( 'link element not found' );
          }
          link = null;
        }

        if( debug ) console.log( '保存' );

        document.defaultView.close();
        document = null

        jsdom = null;

        html.save(function(err) {
          html     = null
          if (!err) {
            promise.resolve();
          } else {
            promise.reject();
          }
        });
      },

      _getHtml : function( urlinfo ) {
        var iconvlite  = this.iconvlite;
        var request    =  require('request');
        
        return new Promise( function ( resolve, reject ) {
          console.log(( 'Requesting : ' + urlinfo.url ).blue );

          request( { url:urlinfo.url, encoding: null } , function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(( 'Request Success: ' + urlinfo.url ).blue );
             
              var htmlBuffer = body;
              var htmlString = body.toString();
 
              // metaから文字コード指定を取得
              var result = htmlString.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);

              // utf-8じゃなかったらデコード
              if( result !== null && result.length > 1 && result[1] !== '' && !/utf-8/i.test( result[1] ) ) {
                htmlString = iconvlite.decode( htmlBuffer, result[1] );
              }
              resolve( htmlString );
            } else {
              console.log(( 'Request Error: ' + urlinfo.url ).blue );
              reject();
            }
          });
        });
      },

      saveHtml : function( urlinfo ) {
        var _this = this;
        return new Promise( function ( resolve, reject ) {
          _this._getHtml( urlinfo )
            .then( function ( htmlString ) {
              console.log(( 'Include HTML: Success:' + urlinfo.url ).magenta);
              _this._inputDb( { resolve:resolve, reject:reject }, urlinfo, htmlString );
            }, function () {
              console.log(( 'Include HTML: Error: ' + urlinfo.url ).red);
              reject();
            });
        });
      }
    };

    app.constructor( options );

    return app;
  }
};


module.exports = includeHtml;

