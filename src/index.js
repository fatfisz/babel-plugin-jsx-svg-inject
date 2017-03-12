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

  function getMarkupIdentifier(path, state, svgName) {
    if (this.cache.has(svgName)) {
      return this.cache.get(svgName);
    }

    const markupId = path.scope.generateUidIdentifier(`svg markup ${svgName}`);
    const pathToSvg = getPath(this.file.opts.filename, state.opts.root, svgName);
    const requireNode = types.callExpression(
      types.identifier('require'),
      [types.StringLiteral(pathToSvg)]
    );

    path.scope.getProgramParent().push({
      id: markupId,
      init: requireNode,
    });

    this.cache.set(svgName, markupId);

    return markupId;
  }

  const attributeVisitor = {
    JSXAttribute(path) {
      const { markupProp, nameProp } = this.opts;

      if (path.node.ignore || path.parent !== this.parent) {
        return;
      }

      if (types.isJSXIdentifier(path.node.name, { name: markupProp })) {
        throw path.buildCodeFrameError(
          `The "${markupProp}" prop is for internal use only, please use "${nameProp}" instead`
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
      const markupId = getMarkupIdentifier.call(this, path, this, svgName);
      const attributeNode = types.JSXAttribute(
        types.JSXIdentifier(markupProp),
        types.JSXExpressionContainer(markupId)
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

      if (!opts.markupProp) {
        opts.markupProp = 'markup';
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
