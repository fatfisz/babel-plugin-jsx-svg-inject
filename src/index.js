import { resolve } from 'path';

import babelPluginSyntaxJSX from 'babel-plugin-syntax-jsx';

import JSXAttribute from './jsx-attribute-visitor';


function normalizeOpts(opts) {
  if (!opts.root) {
    opts.root = '.';
  }
  opts.root = resolve(opts.root);

  if (!opts.nameProp) {
    opts.nameProp = 'svgName';
  }

  if (!opts.contentsProp) {
    opts.contentsProp = 'svgContents';
  }

  opts.unwrap = Boolean(opts.unwrap);
  opts.useImports = Boolean(opts.useImports);
}

export default function ({ types }) {
  return {
    pre() {
      this.cache = new Map();
      this.types = types;
      normalizeOpts(this.opts);
    },

    inherits: babelPluginSyntaxJSX,
    visitor: {
      JSXAttribute,
    },
  };
}
