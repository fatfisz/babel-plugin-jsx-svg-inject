import { resolve } from 'path';

import babelPluginSyntaxJSX from 'babel-plugin-syntax-jsx';

import JSXAttribute from './jsx-attribute-visitor';


export default function ({ types }) {
  return {
    pre() {
      const { opts } = this;

      this.cache = new Map();
      this.types = types;

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
    },

    inherits: babelPluginSyntaxJSX,
    visitor: {
      JSXAttribute,
    },
  };
}
