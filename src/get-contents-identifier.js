import { readFileSync } from 'fs';
import { join } from 'path';

import unwrap from './unwrap';


function getPath(rootPath, svgName) {
  return join(rootPath, `${svgName}.svg`);
}

function getSource(path, pathToSvg) {
  try {
    return readFileSync(pathToSvg, 'utf8');
  } catch (err) {
    throw path.buildCodeFrameError(`File not found: ${pathToSvg}`);
  }
}

function getPropsFromSource(path, pathToSvg, state) {
  const contents = getSource(path, pathToSvg);

  if (!state.opts.unwrap) {
    return { contents };
  }

  try {
    return unwrap(path, contents, state);
  } catch (error) {
    throw path.buildCodeFrameError(`File could not be unwrapped: ${pathToSvg}`);
  }
}

function getActualContentsIdentifier({ scope }, { types }, contents) {
  const contentsId = scope.generateUidIdentifier(`svg contents`);

  scope.getProgramParent().push({
    id: contentsId,
    init: types.StringLiteral(contents.trim()),
  });

  return contentsId;
}

export default function getContentsIdentifier(path, state) {
  const { cache, opts, types } = state;
  const { contentsProp, root } = opts;
  const svgName = path.node.value.value;
  const pathToSvg = getPath(root, svgName);

  if (cache.has(pathToSvg)) {
    return cache.get(pathToSvg);
  }

  const { contents, props = [] } = getPropsFromSource(path, pathToSvg, state);
  const contentsId = getActualContentsIdentifier(path, state, contents);

  props.push(types.JSXAttribute(
    types.JSXIdentifier(contentsProp),
    types.JSXExpressionContainer(contentsId),
  ));
  cache.set(pathToSvg, props);

  return props;
}
