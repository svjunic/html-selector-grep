'use strict';


var includeHtml = {
  create: function( options ){
    var app = {
      db_path : '',

      constructor : function ( options ) {
        this.colors = require('colors');
        this.jsdom  = require('jsdom');
        this.$      = require('jquery')(this.jsdom.jsdom().parentWindow);
        this.fs     = require('fs');
        this._      = require('lodash');

        this.db_path = options.db_path;

        this.mongoose = options.mongoose;

        this.Schema   = this.mongoose.Schema;

        this.HtmlSchema = new this.Schema({
          path                  : { type : String, default : '' }, // パス
          html                  : { type : String, default : '' }, // html自身
          doctypeName           : { type : String, default : '' }, // doctype name
          doctypeInternalSubset : { type : String, default : '' }, // doctype internalSubset
          doctypePublicId       : { type : String, default : '' }, // doctype publicId
          doctypeSystemId       : { type : String, default : '' }  // doctype systemId
        });

        this.mongoose.model( 'html', this.HtmlSchema );
      },

      _inputDb: function( promise, path, htmlString ) {
        var _this = this;

        // console.log( '接続' );
        // this.mongoose.connect( this.db_path );

        // 初期dom取得
        console.log( 'Dom変換' );
        var document = this.jsdom.jsdom(htmlString);

        var doctype = document.doctype;
 
        var html = new (this.mongoose.model( 'html' ))();

        html.path                  = path;
        html.html                  = htmlString;
        html.doctypeName           = doctype.name || '';
        html.doctypeInternalSubset = doctype.internalSubset || '';
        html.doctypePublicId       = doctype.publicId || '';
        html.doctypeSystemId       = doctype.systemId || '';

        // TODO ここが非同期で詰んでる
        console.log( '保存' );
        html.save(function(err) {
          if (err) {
            promise.reject();
            console.log( ( err ).red );
          } else {
            promise.resolve();
          }
        });
      },

      _loadHtml : function( path ) {
        var fs    = this.fs;

        var htmlString = fs.readFileSync( path, 'utf8' );

        // metaから文字コード変換
        var result = htmlString.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);

        if( result.length > 1 && result[1] !== '' ) {
          var htmlBuffer = fs.readFileSync( path );
          var iconvlite= require('iconv-lite');
          htmlString = iconvlite.decode( htmlBuffer, result[1] );
        }

        console.log( ('Include HTML: Success:' + path ).magenta );

        return {
          htmlString: htmlString
        };
      },

      saveHtml : function( path ) {
        var _this = this;
        var data = _this._loadHtml( path );
        return new Promise( function ( resolve, reject ) {
          _this._inputDb( { resolve:resolve, reject:reject }, path, data.htmlString );
        });
      }
    };

    app.constructor( options );

    return app;
  }
};


module.exports = includeHtml;

