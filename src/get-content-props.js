import { readFileSync } from 'fs';

import unwrap from './unwrap';


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

export default function getContentProps(path, state, pathToSvg, contentsId) {
  const { contents, props = [] } = getPropsFromSource(path, pathToSvg, state);
  const { types } = state;

  path.scope.getProgramParent().push({
    id: contentsId,
    init: types.StringLiteral(contents.trim()),
  });

  return props;
}
