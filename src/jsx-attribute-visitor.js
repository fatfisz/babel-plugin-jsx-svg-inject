import getContentsIdentifier from './get-contents-identifier';


export default function JSXAttribute(path, state) {
  const { types } = state;
  const { nameProp } = state.opts;

  if (!types.isJSXIdentifier(path.node.name, { name: nameProp })) {
    return;
  }

  if (!types.isStringLiteral(path.node.value)) {
    throw path.buildCodeFrameError(`Expected the "${nameProp}" prop to be a string`);
  }

  const props = getContentsIdentifier(path, state);
  props.forEach((prop) => {
    path.insertAfter(prop);
  });
}
