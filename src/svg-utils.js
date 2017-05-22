import attributeMap from './attribute-map';
import execIterator from './exec-iterator';
import tagSet from './tag-set';


const commentRegExp = /<!--[^]*?-->/g;
const processingInstructionRegExp = /<\?[^]*?\?>/g;
const tagNameRegExp = /^\S+/;
const attributeRegExp = /([^"]+"[^"]+)"/;

export function removeIgnoredParts(contents) {
  return contents
    .replace(commentRegExp, '')
    .replace(processingInstructionRegExp, '');
}

export function getElement(name, props, children, isSelfClosing, types) {
  const identifier = types.JSXIdentifier(name);
  const closingElement = isSelfClosing ? null : types.JSXClosingElement(identifier);

  return types.JSXElement(
    types.JSXOpeningElement(identifier, props, isSelfClosing),
    closingElement,
    children,
  );
}

export function getText(text, types) {
  return types.JSXText(text);
}

export function getNameFromTag(tag) {
  const name = tagNameRegExp.exec(tag)[0];
  if (!tagSet.has(name)) {
    return null;
  }
  return name;
}

export function getPropsFromAttributes(attributes, types) {
  return Array.from(execIterator(attributeRegExp, attributes))
    .map(([, attribute]) => attribute
      .split(/=\s*"/)
      .map(part => part.trim())
    )
    .filter(([name]) => attributeMap.has(name))
    .map(([name, value]) =>
      types.JSXAttribute(
        types.JSXIdentifier(attributeMap.get(name)),
        types.StringLiteral(value),
      )
    );
}

export class State extends Array {
  constructor() {
    super();
    this.push({ children: [] });
  }

  root() {
    return this[0].children[0];
  }

  pushChild(child) {
    this[this.length - 1].children.push(child);
  }
}
