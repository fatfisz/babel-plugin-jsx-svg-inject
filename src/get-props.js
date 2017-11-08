import { join } from 'path';

import getContentProps from './get-content-props';
import getImportProps from './get-import-props';


export default function getProps(path, state) {
  const { cache, file, opts, types } = state;
  const svgName = path.node.value.value;
  const pathToSvg = join(opts.root, `${svgName}.svg`);

  if (cache.has(pathToSvg)) {
    return cache.get(pathToSvg);
  }

  const contentsId = file.scope.generateUidIdentifier(`svg contents`);
  const props = opts.useImports ?
    getImportProps(state, pathToSvg, contentsId) :
    getContentProps(path, state, pathToSvg, contentsId);

  props.push(
    types.JSXAttribute(
      types.JSXIdentifier(opts.contentsProp),
      types.JSXExpressionContainer(contentsId),
    ),
  );
  cache.set(pathToSvg, props);

  return props;
}
