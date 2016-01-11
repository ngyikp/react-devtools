/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

/* global chrome */
var ports = {};

chrome.runtime.onConnect.addListener(onConnect);

// Enable extension popup pages to be inspected
// TODO: Might be a potential security risk here...
chrome.runtime.onConnectExternal.addListener(onConnect);

function onConnect(port) {
  var tab = null;
  var name = null;
  var parts = port.name.split('_');

  // Possible outcomes from pages:
  // devtools_page_<tabId>
  // content-script_page

  // Possible outcomes from extensions:
  // devtools_extension_<pageId>
  // content-script_extension_<pageId>
  if (parts[0] === 'devtools') {
    name = 'devtools';

    tab = +parts[2];
    if (parts[1] !== 'extension') {
      installContentScript(+parts[2]);
    }
  } else if (parts[0] === 'content-script') {
    if (parts[1] !== 'extension') {
      tab = port.sender.tab.id;
    } else {
      tab = +parts[2];
    }
    name = 'content-script';
  } else {
    console.error('Unknown port name ' + port.name);
    return;
  }

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      'content-script': null,
    };
  }
  ports[tab][name] = port;

  if (ports[tab].devtools && ports[tab]['content-script']) {
    doublePipe(ports[tab].devtools, ports[tab]['content-script']);
  }
}

function installContentScript(tabId: number) {
  chrome.tabs.executeScript(tabId, {file: '/build/contentScript.js'}, function() {
  });
}

function doublePipe(one, two) {
  one.onMessage.addListener(lOne);
  function lOne(message) {
    // console.log('dv -> rep', message);
    two.postMessage(message);
  }
  two.onMessage.addListener(lTwo);
  function lTwo(message) {
    // console.log('rep -> dv', message);
    one.postMessage(message);
  }
  function shutdown() {
    one.onMessage.removeListener(lOne);
    two.onMessage.removeListener(lTwo);
    one.disconnect();
    two.disconnect();
  }
  one.onDisconnect.addListener(shutdown);
  two.onDisconnect.addListener(shutdown);
}
