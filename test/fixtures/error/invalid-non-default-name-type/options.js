'use strict';

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      nameProp: 'name',
      root: 'some-path',
    }],
  ],
  throws: 'Expected the "name" prop to be a string',
};
