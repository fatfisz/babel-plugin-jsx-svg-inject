import { relative } from 'path';


export default function getImportProps({ file, types }, pathToSvg, contentsId) {
  file.scope.path.unshiftContainer(
    'body',
    types.importDeclaration(
      [types.importDefaultSpecifier(contentsId)],
      types.StringLiteral(relative(file.opts.filename, pathToSvg)),
    ),
  );

  return [];
}
