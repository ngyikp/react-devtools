/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var winGlobal;

function initPopupWindow(win, resolve) {
  var title = win.document.createElement('title');
  title.textContent = 'React Developer Tools' + (typeof window !== 'undefined' && typeof window.location !== 'undefined' ? ' (' + window.location.href + ')' : '');
  win.document.head.appendChild(title);

  win.document.body.style.margin = '0';
  
  var container = win.document.createElement('div');
  container.id = 'container';
  container.style.display = 'flex';
  container.style.height = '100%';
  win.document.body.appendChild(container);
  
  // Close window if user accidentally reloads React DevTools
  // to avoid the need to close useless white page
  win.addEventListener('unload', win.close, false);

  resolve(win);
}

module.exports = {
  create() {
    if (winGlobal) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Dead_object
      try {
        String(winGlobal);
      } catch (ex) {
        winGlobal = null;
      }
    }

    if (winGlobal) {
      winGlobal.focus();
      return Promise.resolve(winGlobal);
    }

    return new Promise(function(resolve) {
      winGlobal = window.open('about:blank', '', 'width=800,height=600');

      var win = winGlobal;

      // Chrome
      if (win.document.readyState === 'complete') {
        initPopupWindow(win, resolve);
        return;
      }

      // Necessary for Firefox
      // https://stackoverflow.com/q/7476660
      win.addEventListener('load', function() {
        initPopupWindow(win, resolve);
      }, false);
    });
  },

  close() {
    if (winGlobal) {
      winGlobal.close();
    }
  },
};
