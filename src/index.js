import { dirname, isAbsolute, join, relative, resolve } from 'path';

import babelPluginSyntaxJSX from 'babel-plugin-syntax-jsx';


const pluginName = 'babel-plugin-jsx-svg-inject';

function getPath(filename, rootPath, svgName) {
  const path = join(rootPath, `${svgName}.svg`).replace(/\\/g, '/');

  if (isAbsolute(rootPath)) {
    return path;
  }

  if (rootPath[0] === '.') {
    const scriptDir = dirname(filename);
    return relative(scriptDir, resolve(path)).replace(/\\/g, '/');
  }

  return path;
}

export default function ({ types }) {

  function getContentsIdentifier(path, { cache, file, opts }) {
    const svgName = path.node.value.value;

    if (cache.has(svgName)) {
      return cache.get(svgName);
    }

    const contentsId = path.scope.generateUidIdentifier(`svg contents ${svgName}`);
    const pathToSvg = getPath(file.opts.filename, opts.root, svgName);
    const importNode = types.importDeclaration(
      [types.importDefaultSpecifier(contentsId)],
      types.StringLiteral(pathToSvg),
    );
    path.scope.getProgramParent().path.unshiftContainer('body', importNode);

    cache.set(svgName, contentsId);

    return contentsId;
  }

  const visitor = {
    Program(path, { opts }) {
      if (!opts.root) {
        opts.root = '.';
      }

      if (!opts.nameProp) {
        opts.nameProp = 'svgName';
      }

      if (!opts.contentsProp) {
        opts.contentsProp = 'svgContents';
      }
    },

    JSXAttribute(path, state) {
      const { contentsProp, nameProp } = state.opts;

      if (!types.isJSXIdentifier(path.node.name, { name: nameProp })) {
        return;
      }

      if (!types.isStringLiteral(path.node.value)) {
        throw path.buildCodeFrameError(`Expected the "${nameProp}" prop to be a string`);
      }

      const contentsId = getContentsIdentifier(path, state);
      const attributeNode = types.JSXAttribute(
        types.JSXIdentifier(contentsProp),
        types.JSXExpressionContainer(contentsId)
      );

      path.replaceWith(attributeNode);
    },
  };

  return {
    pre(...args) {
      this.cache = new Map();
    },

    inherits: babelPluginSyntaxJSX,
    visitor,
  };
}
