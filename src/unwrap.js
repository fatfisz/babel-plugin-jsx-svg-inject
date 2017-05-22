import execIterator from './exec-iterator';


const svgRegExp = /<svg ?([^>]+)>([^]*)<\/svg>/i;
const attributeRegExp = /([^"]+"[^"]+)" ?/;

export default function unwrap(originalContents, types) {
  const [, attributes, contents] = svgRegExp.exec(originalContents);
  const props = Array.from(execIterator(attributeRegExp, attributes))
    .map(([, attribute]) => {
      const [name, value] = attribute.split('="');

      return types.JSXAttribute(
        types.JSXIdentifier(name),
        types.StringLiteral(value),
      );
    });

  return {
    init: types.StringLiteral(contents.trim()),
    props,
  };
}
