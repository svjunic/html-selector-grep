#!/usr/bin/env node

/**
 * @fileOverview main.js
 *
 * @author sv.junic
 */


// 細かい出し分け等を書く
require('./modules/config.js');
require('date-utils');

var fs = require('fs');
var readline  = require('readline');
var execsyncs = require('execsyncs');

var proxyChildProcess = require('./modules/proxyChildProcess.js');

var dt        = new Date();
var formatted = dt.toFormat("YYYYMMDDHH24MISS");

var findlist = './data/' + formatted + '.txt';
var htmldir  = '/mnt2/www/preview/pack/sp/';

// ２つ書くと両方あるもの、１つにまとめてて書くどちらかがあるもの
var findSelecter = [
  '*[class*=carousel], *[class*=slide]'
];

// var query2 = function() {
//   //[
//   //    '*[class*=carousel], *[class*=slide]',
//   //    '*[class*=carousel], *[class*=slide]',
//   //];
// }

// ----------------------------------------------------------------------------------------------------
// main
execsyncs( "find " + htmldir + "* -type f -name '*.html' | sort > " + findlist );

var rs = fs.createReadStream( findlist );
var rl = readline.createInterface(rs, {});

var fileid = 0;
var filelist = [];

rl.on('line', function( filepath ) {
  fileid++;
  filelist.push( { fileid:fileid, filepath:filepath } );
});

proxyChildProcess( findSelecter, filelist, {
  filter   : function(){},
  callback : function(){},
});

