import { readFileSync } from 'fs';
import { join } from 'path';


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

export default function getContentsIdentifier(path, { cache,  opts, types }) {
  const svgName = path.node.value.value;
  const pathToSvg = getPath(opts.root, svgName);

  if (cache.has(pathToSvg)) {
    return cache.get(pathToSvg);
  }

  const svgContents = getSource(path, pathToSvg);
  const contentsId = path.scope.generateUidIdentifier(`svg contents`);
  path.scope.getProgramParent().push({
    id: contentsId,
    init: types.StringLiteral(svgContents),
  });

  cache.set(pathToSvg, contentsId);

  return contentsId;
}
