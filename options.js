/*
 * Copyright (C) 2012 Bram Schoenmakers <me@bramschoenmakers.nl>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/

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
