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

module.exports = function() {
  // Change this to whatever random string Chrome gives you
  var DEVTOOLS_EXTENSION_ID = 'lijlpjbjbiafjcjfhfpjhhjjnligpdda';

  // proxy from main page to devtools (via the background page)
  var port = chrome.runtime.connect(DEVTOOLS_EXTENSION_ID, {
    name: 'content-script_extension_' + window.__REACT_DEVTOOLS_GLOBAL_HOOK__.pageId,
  });

  port.onMessage.addListener(handleMessageFromDevtools);
  port.onDisconnect.addListener(handleDisconnect);
  window.addEventListener('message', handleMessageFromPage);

  window.postMessage({
    source: 'react-devtools-content-script',
    hello: true,
  }, '*');

  function handleMessageFromDevtools(message) {
    window.postMessage({
      source: 'react-devtools-content-script',
      payload: message,
    }, '*');
  }

  function handleMessageFromPage(evt) {
    if (evt.data && evt.data.source === 'react-devtools-bridge') {
      // console.log('page -> rep -> dev', evt.data);
      port.postMessage(evt.data.payload);
    }
  }

  function handleDisconnect() {
    window.removeEventListener('message', handleMessageFromPage);
    window.postMessage({
      source: 'react-devtools-content-script',
      payload: {
        type: 'event',
        evt: 'shutdown',
      },
    }, '*');
  }
};
