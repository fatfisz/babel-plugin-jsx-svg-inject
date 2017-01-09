import { dirname, isAbsolute, join, relative, resolve } from 'path';

import babelPluginSyntaxJSX from 'babel-plugin-syntax-jsx';


const pluginName = 'babel-plugin-jsx-svg-icon-inject';

function getPath(filename, path, iconName) {
  const iconPath = join(path, `${iconName}.svg`).replace(/\\/g, '/');

  if (isAbsolute(path)) {
    return iconPath;
  }

  if (path[0] === '.') {
    const scriptDir = dirname(filename);
    return relative(scriptDir, resolve(iconPath)).replace(/\\/g, '/');
  }

  return iconPath;
}

export default function ({ types }) {

  function getIconMarkupIdentifier(path, state, iconName) {
    if (this.cache.has(iconName)) {
      return this.cache.get(iconName);
    }

    const markupId = path.scope.generateUidIdentifier(`icon markup ${iconName}`);
    const pathToIcon = getPath(this.file.opts.filename, state.opts.path, iconName);
    const requireNode = types.callExpression(
      types.identifier('require'),
      [types.StringLiteral(pathToIcon)]
    );

    path.scope.getProgramParent().push({
      id: markupId,
      init: requireNode,
    });

    this.cache.set(iconName, markupId);

    return markupId;
  }

  const attributeVisitor = {
    JSXAttribute(path) {
      const { markupPropName, namePropName } = this.opts;

      if (path.node.ignore || path.parent !== this.parent) {
        return;
      }

      if (types.isJSXIdentifier(path.node.name, { name: markupPropName })) {
        throw path.buildCodeFrameError(
          `The "${markupPropName}" prop is for internal use only, please use "${namePropName}" with the icon name instead`
        );
      }

      if (!types.isJSXIdentifier(path.node.name, { name: namePropName })) {
        return;
      }

      if (this.foundName) {
        throw path.buildCodeFrameError(`Found a duplicate "${namePropName}" prop`);
      }

      if (!types.isStringLiteral(path.node.value)) {
        throw path.buildCodeFrameError(`Expected the "${namePropName}" prop to be a string`);
      }

      const iconName = path.node.value.value;
      const markupId = getIconMarkupIdentifier.call(this, path, this, iconName);
      const attributeNode = types.JSXAttribute(
        types.JSXIdentifier(markupPropName),
        types.JSXExpressionContainer(markupId)
      );

      path.replaceWith(attributeNode);

      attributeNode.ignore = true;
      this.foundName = true;
    },
  };

  const visitor = {
    Program(path, { opts }) {
      if (!opts.path) {
        throw path.buildCodeFrameError(`The ${pluginName} plugin requires a "path" option`);
      }

      if (!opts.tagName) {
        throw path.buildCodeFrameError(`The ${pluginName} plugin requires a "tagName" option`);
      }

      if (!opts.namePropName) {
        opts.namePropName = 'name';
      }

      if (!opts.markupPropName) {
        opts.markupPropName = 'markup';
      }
    },

    JSXOpeningElement(path) {
      const { namePropName, tagName } = this.opts;

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
          `The "${namePropName}" prop required for the ${tagName} component is missing`
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
