import { relative } from 'path';


export default function getImportProps({ scope }, { file, types }, pathToSvg, contentsId) {
  scope.getProgramParent().path.unshiftContainer(
    'body',
    types.importDeclaration(
      [types.importDefaultSpecifier(contentsId)],
      types.StringLiteral(relative(file.opts.filename, pathToSvg)),
    ),
  );

  return [];
}
