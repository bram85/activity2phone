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

      if ( !DEBUG ) {
        request.send( content );
      }
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

  function setActive() {
    console.log( "User is active." );
    currentState = "active";
    NMA.active();
  }

  function setIdle() {
    console.log( "User is idle." );
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

  function loadSettings() {
    chrome.storage.local.get( "timeout", function( pItems ) {
      if ( pItems.hasOwnProperty( "timeout" ) ) {
        config.timeout = pItems.timeout * ( DEBUG ? 1 : 60 );
        if ( config.timeout < 15 ) {
          config.timeout = 15;
        }
      }
    } );

    chrome.storage.sync.get( "apikey", function( pItems ) {
      config.apikey = pItems.hasOwnProperty( "apikey" ) ? pItems.apikey : "";
    } );
  }

  loadSettings();
  // loadSettings performs async ops, so wait a sec before marking ourselves as
  // active
  setTimeout( setActive, 1000 );

  chrome.runtime.onSuspend.addListener( setIdle );
  chrome.storage.onChanged.addListener( loadSettings );

  chrome.runtime.onInstalled.addListener( function( pDetails ) {
    if ( pDetails.reason === "install" ) {
      var filename = chrome.runtime.getManifest().options_page;
      chrome.app.window.create( filename );
    }
  } );
}();
