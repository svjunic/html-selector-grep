#!/usr/bin/env node

/**
 * @fileOverview lb.js
 *
 * @author sv.junic
 */


// proxyChildProcess( selecter, filelist, {
//   filter   : function(){},
//   callback : function(){},
// });


require('./config.js').CHILD_PROCESS;
console.log( require('./config.js').CHILD_PROCESS );

function proxyChildProcess( _selecter, _filelist, _option ) {

  var childProcess  = require('child_process');
  var childProcesses = [];

  var max = _filelist.length; // 処理する総件数
  var cnt = 0;
  var filter;
  if( typeof _option.filter === 'function' ) {
    filter = _option.filter;
  }

  var resultArray = [];

  // childprocessの作成
  var processNum = CHILD_PROCESS;
  var processCnt;

  for( processCnt=0; processNum>processCnt; processCnt++) {
    var subprocess = childProcess.fork("./modules/htmlSelectorGrep.js");

    subprocess.isRunning = true;

    subprocess.on('message',function( _result ) {
      //console.log( 'recv : ', _result);
      resultArray.push( _result );
      subroutine( this );
    });

    childProcesses.push( subprocess );
  }

  function subroutine( subprocess ) {
    if( cnt > max ) {
      subprocess.kill();
      subprocess.isRunning = false;

      if( isAllProcessComplete() ){
        process.exit( 0 );
      }

      return;
    }

    cnt++;
    subprocess.send( {
      fileid   : _filelist[cnt].fileid,
      filepath : _filelist[cnt].filepath,
      selecter :_selecter,
      filter   : filter,
    }, function() {});
  }

  function isAllProcessComplete() {
    var isComplete = true;

    for( var proccessCnt=0, max=processNum; max>proccessCnt; processCnt++ ) {
      if( !childProcesses[processCnt].isRunning ) {
        isComplete = false;
      }
    }
    return isComplete;
  }

  for( processCnt=0; processNum>processCnt; processCnt++) {
    subroutine( childProcesses[processCnt], num );
  }
}


module.exports = proxyChildProcess;
