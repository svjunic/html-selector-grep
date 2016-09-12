/**
 * @fileOverview htmlSelectorGrep.js
 *
 * @author sv.junic
 */

require('./modules/config.js');

var colors    = require('colors');
var _         = require('lodash');

var getHtmlSource = require( './getHtmlSource.js' );
var findSelector  = require( './findSelector.js' );

/*

_dataset = {
  fileid   : number,
  filepath : 'string',
  selecter : [ '.mogeta' ],
  filter   : function(){},
  callback : [ '.mogeta' ],
}

return {
  html: str,
  $   : $,
}

*/


process.on( 'message', function ( _dataset ) {
  var fileid   = _dataset.fileid;
  var filepath = _dataset.filepath;
  var selecter = _dataset.selecter;


  var htmlString = getHtmlSource( filepath );
  var result     = findSelector( htmlString, selecter );


  //if( typeof _dataset.filter === 'function' ) {
  //  result = _dataset.filter( result );
  //}

  process.send( { fileid:fileid, result:result } );
});
