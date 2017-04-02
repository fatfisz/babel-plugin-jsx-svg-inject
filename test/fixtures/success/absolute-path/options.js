'use strict';

const { resolve } = require('path');

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      root: resolve('some-path'),
    }],
  ],
};
