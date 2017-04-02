'use strict';

const { join } = require('path');


const missingFilePath = join(process.cwd(), 'some-path/missing file.svg');

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      root: 'some-path',
    }],
  ],
  throws: `File not found: ${missingFilePath}`,
};
