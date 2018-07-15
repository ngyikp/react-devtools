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

var React = require('react');
var ReactDOM = require('react-dom');
var nullthrows = require('nullthrows').default;

var installGlobalHook = require('../../backend/installGlobalHook');
var installRelayHook = require('../../plugins/Relay/installRelayHook');

var Panel = require('../../frontend/Panel');

var fakeWall = require('./fake-wall');
var popupWindow = require('./popup-window');

// First hook to React...
window.React = React;

installGlobalHook(window);
installRelayHook(window);

// Then the panel is injected later
var openDevToolsLink = document.createElement('button');
openDevToolsLink.style.position = 'fixed';
openDevToolsLink.style.top = '0';
openDevToolsLink.style.left = '0';
openDevToolsLink.style.zIndex = '10000000';
openDevToolsLink.textContent = 'Open React DevTools';
openDevToolsLink.addEventListener('click', function() {
  popupWindow.create().then(function(externalWindow) {
    window.addEventListener('beforeunload', popupWindow.close, false);

    var config = {
      alreadyFoundReact: true,
      showHiddenThemes: true,
      inject(done) {
        require('./backend');

        var wall = {
          listen(fn) {
            fakeWall.on('message-to-front', fn);
          },
          send(data) {
            fakeWall.emit('message-to-back', data);
          },
        };
        done(wall);
      },
    };

    var node = nullthrows(externalWindow.document.getElementById('container'));
    ReactDOM.render(<Panel {...config} />, node);
  });
}, false);
nullthrows(document.body).appendChild(openDevToolsLink);
