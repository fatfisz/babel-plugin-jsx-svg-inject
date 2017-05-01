'use strict';

const { join } = require('path');


const invalidFilePath = join(process.cwd(), 'some-path/invalid.svg');

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      unwrap: true,
    }],
  ],
  throws: `File could not be unwrapped: ${invalidFilePath}`,
};
