import {
  getElement,
  getNameFromTag,
  getPropsFromAttributes,
  getText,
  removeIgnoredParts,
  State,
} from './svg-utils';


export default function getJSXFromContents(contents, types) {
  const tagsWithText = removeIgnoredParts(contents)
    .split('<')
    .map(tagWithText => tagWithText.trim());
  let ignoreFirst = false;

  if (tagsWithText.length > 0 && tagsWithText[0] !== '') {
    ignoreFirst = true;
  }

  const state = new State();
  let ignoring = 0;

  for (const tagWithText of tagsWithText) {
    if (ignoreFirst) {
      ignoreFirst = false;
      continue;
    }

    if (tagWithText === '') {
      continue;
    }

    const isClosing = tagWithText[0] === '/';
    const closingIndex = tagWithText.lastIndexOf('>');
    const tag = tagWithText.slice(0, closingIndex);
    const text = tagWithText.slice(closingIndex + 1).trim();

    if (isClosing) {
      if (ignoring > 0) {
        ignoring -= 1;
      } else {
        const { name, props, children } = state.pop();
        state.pushChild(getElement(name, props, children, false, types));
        if (state.length === 1) {
          break;
        }
      }
    } else {
      const isSelfClosing = tag[tag.length - 1] === '/';
      const name = getNameFromTag(tag);

      if (ignoring > 0 || name === null) {
        if (!isSelfClosing) {
          ignoring += 1;
        }
      } else {
        const props = getPropsFromAttributes(tag.slice(name.length), types);

        if (isSelfClosing) {
          state.pushChild(getElement(name, props, [], true, types));
        } else {
          state.push({ name, props, children: [] });
        }

        if (state.length === 1) {
          break;
        }
      }
    }

    if (ignoring === 0 && text) {
      state.pushChild(getText(text, types));
    }
  }

  return state.root();
}
