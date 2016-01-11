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

var __DEV__ = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: './src/main.js',
    background: './src/background.js',
    inject: './src/GlobalHook.js',
    contentScript: './src/contentScript.js',
    reactDevtoolsHelperForChromeExtensions: './src-for-chrome-extension/hook.js',
    panel: './src/panel.js',
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader:  'babel',
      exclude: /node_modules/,
    }],
  },
};
