'use strict';

const { relative } = require('path');

module.exports = {
  presets: [
    [relative(__dirname, require.resolve('babel-preset-env')), {
      target: {
        node: 4,
      },
    }],
    relative(__dirname, require.resolve('babel-preset-react')),
  ],
  plugins: [
    ['../../../../lib/index.js', {
      root: './some-path',
    }],
  ],
};
