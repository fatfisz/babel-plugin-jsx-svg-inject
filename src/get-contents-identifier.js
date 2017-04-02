import { dirname, isAbsolute, join, relative, resolve } from 'path';


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

export default function getContentsIdentifier(path, { cache, file, opts, types }) {
  const svgName = path.node.value.value;
  const pathToSvg = getPath(file.opts.filename, opts.root, svgName);

  if (cache.has(pathToSvg)) {
    return cache.get(pathToSvg);
  }

  const contentsId = path.scope.generateUidIdentifier(`svg contents ${pathToSvg}`);
  const importNode = types.importDeclaration(
    [types.importDefaultSpecifier(contentsId)],
    types.StringLiteral(pathToSvg),
  );
  path.scope.getProgramParent().path.unshiftContainer('body', importNode);

  cache.set(pathToSvg, contentsId);

  return contentsId;
}
