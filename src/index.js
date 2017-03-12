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

  function getContentsIdentifier(path, state, svgName) {
    if (this.cache.has(svgName)) {
      return this.cache.get(svgName);
    }

    const contentsId = path.scope.generateUidIdentifier(`svg contents ${svgName}`);
    const pathToSvg = getPath(this.file.opts.filename, state.opts.root, svgName);
    const requireNode = types.callExpression(
      types.identifier('require'),
      [types.StringLiteral(pathToSvg)]
    );

    path.scope.getProgramParent().push({
      id: contentsId,
      init: requireNode,
    });

    this.cache.set(svgName, contentsId);

    return contentsId;
  }

  const attributeVisitor = {
    JSXAttribute(path) {
      const { contentsProp, nameProp } = this.opts;

      if (path.node.ignore || path.parent !== this.parent) {
        return;
      }

      if (types.isJSXIdentifier(path.node.name, { name: contentsProp })) {
        throw path.buildCodeFrameError(
          `The "${contentsProp}" prop is for internal use only, please use "${nameProp}" instead`
        );
      }

      if (!types.isJSXIdentifier(path.node.name, { name: nameProp })) {
        return;
      }

      if (this.foundName) {
        throw path.buildCodeFrameError(`Found a duplicate "${nameProp}" prop`);
      }

      if (!types.isStringLiteral(path.node.value)) {
        throw path.buildCodeFrameError(`Expected the "${nameProp}" prop to be a string`);
      }

      const svgName = path.node.value.value;
      const contentsId = getContentsIdentifier.call(this, path, this, svgName);
      const attributeNode = types.JSXAttribute(
        types.JSXIdentifier(contentsProp),
        types.JSXExpressionContainer(contentsId)
      );

      path.replaceWith(attributeNode);

      attributeNode.ignore = true;
      this.foundName = true;
    },
  };

  const visitor = {
    Program(path, { opts }) {
      if (!opts.root) {
        opts.root = '.';
      }

      if (!opts.tagName) {
        opts.tagName = 'SVG';
      }

      if (!opts.nameProp) {
        opts.nameProp = 'name';
      }

      if (!opts.contentsProp) {
        opts.contentsProp = 'contents';
      }
    },

    JSXOpeningElement(path) {
      const { nameProp, tagName } = this.opts;

      if (!types.isJSXIdentifier(path.node.name, { name: tagName })) {
        return;
      }

      const childState = {
        ...this,
        foundName: false,
        parent: path.node,
      };

      path.traverse(attributeVisitor, childState);

      if (!childState.foundName) {
        throw path.buildCodeFrameError(
          `The "${nameProp}" prop required for the ${tagName} component is missing`
        );
      }
    },
  };

  return {
    pre() {
      this.cache = new Map();
    },

    inherits: babelPluginSyntaxJSX,
    visitor,
  };
}
