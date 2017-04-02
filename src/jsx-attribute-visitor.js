import getContentsIdentifier from './get-contents-identifier';


export default function JSXAttribute(path, state) {
  const { types } = state;
  const { contentsProp, nameProp } = state.opts;

  if (!types.isJSXIdentifier(path.node.name, { name: nameProp })) {
    return;
  }

  if (!types.isStringLiteral(path.node.value)) {
    throw path.buildCodeFrameError(`Expected the "${nameProp}" prop to be a string`);
  }

  const contentsId = getContentsIdentifier(path, state);
  const attributeNode = types.JSXAttribute(
    types.JSXIdentifier(contentsProp),
    types.JSXExpressionContainer(contentsId)
  );

  path.insertAfter(attributeNode);
}
