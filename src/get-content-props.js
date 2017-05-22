import { readFileSync } from 'fs';

import getJSXFromContents from './get-jsx-from-contents';
import unwrap from './unwrap';


function getSource(path, pathToSvg) {
  try {
    return readFileSync(pathToSvg, 'utf8');
  } catch (err) {
    throw path.buildCodeFrameError(`File not found: ${pathToSvg}`);
  }
}

function getPropsFromSource(path, pathToSvg, { opts, types }) {
  const contents = getSource(path, pathToSvg);
  const jsx = getJSXFromContents(contents, types);

  if (!opts.unwrap) {
    return { init: jsx };
  }

  try {
    return unwrap(contents, types);
  } catch (error) {
    throw path.buildCodeFrameError(`File could not be unwrapped: ${pathToSvg}`);
  }
}

export default function getContentProps(path, state, pathToSvg, id) {
  const { init, props = [] } = getPropsFromSource(path, pathToSvg, state);
  path.scope.getProgramParent().push({ id, init });
  return props;
}
