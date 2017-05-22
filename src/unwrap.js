export default function unwrap(jsx, types) {
  const { children } = jsx;
  const init = (
    children.length === 0 ? types.nullLiteral() :
    children.length === 1 ? children[0] :
    types.arrayExpression(
      children.map((child, index) => {
        child.openingElement.attributes.push(
          types.JSXAttribute(
            types.JSXIdentifier('key'),
            types.StringLiteral(`.${index}`),
          ),
        );
        return child;
      }),
    )
  );
  const props = jsx.openingElement.attributes;

  return { init, props };
}
