'use strict';

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      contentsProp: 'html',
      nameProp: 'type',
      root: './some-path',
    }],
  ],
};
