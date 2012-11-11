chrome.storage.local.get( "timeout", function( pItems ) {
  var timeout = pItems.hasOwnProperty( "timeout" ) ? pItems.timeout : 15;
  document.querySelector( "#timeout" ).value = timeout;
} );

chrome.storage.sync.get( "apikey", function( pItems ) {
  var apikey = "";

  if ( pItems.hasOwnProperty( "apikey" ) ) {
    apikey = pItems.apikey;
  }

  document.querySelector( "#nma_apikey" ).value = apikey;
} );

document.querySelector( "#options" ).onsubmit = function() {
  // prevent reload of page
  return false;
};

document.querySelector( "#save" ).onclick = function( pEvent ) {
  // timeout may be situation specific, so don't sync
  chrome.storage.local.set( {
    "timeout": document.querySelector( "#timeout" ).value
  } );

  // you usually need one API key, so this can be synced among other Chrome
  // instances.
  chrome.storage.sync.set( {
    "apikey": document.querySelector( "#nma_apikey" ).value
  } );
};
