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

var contentScript = require('./contentScript');

// Inject a `__REACT_DEVTOOLS_GLOBAL_HOOK__` global so that React can detect that the
// devtools are installed (and skip its suggestion to install the devtools).

var installGlobalHook = require('../../../backend/installGlobalHook.js');
var installRelayHook = require('../../../plugins/Relay/installRelayHook.js');

// We are already running on the page execution scope, there is no need to create
// a <script> tag, plus it wouldn't work under the strict Content Security Policy anyway
installGlobalHook(window);
installRelayHook(window);

window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeObjectCreate = Object.create;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeMap = Map;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeWeakMap = WeakMap;
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeSet = Set;

// Extension popup pages do not have tabId, so we create our own unique identifier
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.pageId = +new Date();

contentScript();
