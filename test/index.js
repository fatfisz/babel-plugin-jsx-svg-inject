'use strict';

const path = require('path');


require('babel-helper-plugin-test-runner')(__dirname);


// Mock the path.resolve method so that tests will be deterministic

const { join, resolve } = path;

path.resolve = function (pathToResolve, ...args) {
  if (!pathToResolve.endsWith('.svg')) {
    return resolve(pathToResolve, ...args);
  }

  return join('/root', pathToResolve).replace(/\\/g, '/');
};
