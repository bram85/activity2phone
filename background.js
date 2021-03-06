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

var Activity2Phone = function() {
  var DEBUG = false;
  var currentState = "active";

  // stored
  var config = {
    "apikey": null,
    "timeout": 15
  };

  // internal tunable;
  var pollSeconds = 10;

  var NMA = function() {
    var host = "https://www.notifymyandroid.com";
    var path = "/publicapi/notify";

    var appName = "Activity2Phone";
    var descIdle = "Synchronization+will+be+enabled.";
    var descActive = "Synchronization+will+be+disabled.";

    // when these strings are changed, they should also be changed in Tasker!
    var eventIdle = "User+is+idle";
    var eventActive = "User+is+active";

    function sendNotification( pState ) {
      if ( pState !== "idle" && pState !== "active" ) {
        return;
      }

      if ( config.apikey === null ) {
        console.error( "No API key is set, please set it in the options." );
      }

      var url = host + path;
      var content = "apikey=" + config.apikey
                  + "&application=" + appName
                  + "&event=" + ( pState === "idle" ? eventIdle : eventActive )
                  + "&description=" + ( pState === "idle" ? descIdle : descActive )
                  + "&priority=-2"; // low priority

      var request = new XMLHttpRequest();
      request.open( "POST", url, true );
      request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

      request.onreadystatechange = function() {
        if ( this.readyState === 4 && this.status !== 200 ) {
          console.error( "HTTP request failed with status " + this.status );
          console.error( this.responseText );
        }
      }

      request.send( content );
    }

    return {
      idle: function() {
        sendNotification( "idle" );
      },
      active: function() {
        sendNotification( "active" );
      }
    };
  }();

  function logWithTime( pMessage ) {
    function leadingZero( pValue ) {
      return pValue < 10 ? '0' + pValue : pValue.toString();
    }

    var d = new Date();
    var hours = leadingZero( d.getHours() );
    var minutes = leadingZero( d.getMinutes() );
    var seconds = leadingZero( d.getSeconds() );

    console.log( '[' + hours + ':' + minutes + ':' + seconds + "] " + pMessage );
  }

  function setActive() {
    logWithTime( "User is active." );
    currentState = "active";
    NMA.active();
  }

  function setIdle() {
    logWithTime( "User is idle." );
    currentState = "idle";
    NMA.idle();
  }

  setInterval( function() {
    chrome.idle.queryState( config.timeout, function( pNewState ) {
      if ( currentState === "active" && pNewState === "idle" ) {
        setIdle();
      }
    } );
  }, pollSeconds * 1000 );

  chrome.idle.onStateChanged.addListener( function( pNewState ) {
    if ( currentState === "idle" && pNewState === "active" ) {
      setActive();
    }
  } );

  function loadSettings( pCallback ) {
    var hasAPIkey = false;
    var hasTimeout = false;

    chrome.storage.local.get( "timeout", function( pItems ) {
      if ( pItems.hasOwnProperty( "timeout" ) ) {
        config.timeout = pItems.timeout * ( DEBUG ? 1 : 60 );
        if ( config.timeout < 15 ) {
          config.timeout = 15;
        }
      }

      hasTimeout = true;
      if ( hasAPIkey ) {
        pCallback();
      }
    } );

    chrome.storage.sync.get( "apikey", function( pItems ) {
      config.apikey = pItems.hasOwnProperty( "apikey" ) ? pItems.apikey : "";

      hasAPIkey = true;
      if ( hasTimeout ) {
        pCallback();
      }
    } );
  }

  loadSettings( setActive ); // callback

  chrome.runtime.onSuspend.addListener( setIdle );
  chrome.storage.onChanged.addListener( loadSettings );

  chrome.runtime.onInstalled.addListener( function( pDetails ) {
    if ( pDetails.reason === "install" ) {
      var filename = chrome.runtime.getManifest().options_page;
      chrome.app.window.create( filename );
    }
  } );
}();
