'use strict';

const assert = require('assert');

const { types } = require('babel-core');

const getJSXFromContents = require('../src/get-jsx-from-contents').default;


function getProps(props) {
  return Object.keys(props).reduce((acc, key) => {
    acc.push(
      types.JSXAttribute(
        types.JSXIdentifier(key),
        types.StringLiteral(props[key])
      )
    );

    return acc;
  }, []);
}

function getElement(name, props, children, isSelfClosing = false) {
  const identifier = types.JSXIdentifier(name);
  const closingElement = isSelfClosing ? null : types.JSXClosingElement(identifier);

  return types.JSXElement(
    types.JSXOpeningElement(identifier, getProps(props), isSelfClosing),
    closingElement,
    children
  );
}

function getText(text) {
  return types.JSXText(text);
}

describe('getJSXFromContents', () => {
  it('should ignore comments and processing instructions', () => {
    const original = `
      <?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <!-- Created with Inkscape (http://www.inkscape.org/) -->
      <svg />
    `;
    const expected = getElement('svg', {}, [], true);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should only accept the first root element', () => {
    const original = `
      <svg id="first" />
      <svg id="second" />
      <svg id="third" />
    `;
    const expected = getElement('svg', { id: 'first' }, [], true);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle nested elements and their props', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <g>
          <rect x="10" y="10" width="100" height="100" />
          <circle cx="100" cy="100" r="100"/>
          <ellipse cx="60" cy="60" rx="50" ry="25" />
        </g>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '120', height: '120', viewBox: '0 0 120 120' }, [
      getElement('g', {}, [
        getElement('rect', { x: '10', y: '10', width: '100', height: '100' }, [], true),
        getElement('circle', { cx: '100', cy: '100', r: '100' }, [], true),
        getElement('ellipse', { cx: '60', cy: '60', rx: '50', ry: '25' }, [], true),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's some text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text after a self-closing element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          <g style="hello" />
          Here's some text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getElement('g', { style: 'hello' }, [], true),
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text after an element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          <g style="hello"></g>
          Here's some text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getElement('g', { style: 'hello' }, []),
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text before a self-closing element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's some text
          <g style="hello" />
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
        getElement('g', { style: 'hello' }, [], true),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text before an element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's some text
          <g style="hello"></g>
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
        getElement('g', { style: 'hello' }, []),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text surrounding a self-closing element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's
          <g style="hello" />
          text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s'),
        getElement('g', { style: 'hello' }, [], true),
        getText('text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text surrounding an element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's
          <g style="hello"></g>
          text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s'),
        getElement('g', { style: 'hello' }, []),
        getText('text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text after a self-closing unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          <unknown style="hello" />
          Here's some text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text after an unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          <unknown style="hello"></unknown>
          Here's some text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text before a self-closing unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's some text
          <unknown style="hello" />
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text before an unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's some text
          <unknown style="hello"></unknown>
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s some text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text surrounding a self-closing unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's
          <unknown style="hello" />
          text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s'),
        getText('text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should handle text surrounding an unknown element', () => {
    const original = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="40" viewBox="0 0 500 40">
        <text x="0" y="35" font-family="Verdana" font-size="35">
          Here's
          <unknown style="hello"></unknown>
          text
        </text>
      </svg>
    `;
    const expected = getElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '500', height: '40', viewBox: '0 0 500 40' }, [
      getElement('text', { x: '0', y: '35', fontFamily: 'Verdana', fontSize: '35' }, [
        getText('Here\'s'),
        getText('text'),
      ]),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should ignore unknown elements and their children', () => {
    const original = `
      <svg>
        <rect x="10" y="10" width="100" height="100" />
        <div>
          <circle cx="100" cy="100" r="100"/>
        </div>
      </svg>
    `;
    const expected = getElement('svg', {}, [
      getElement('rect', { x: '10', y: '10', width: '100', height: '100' }, [], true),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should ignore text of an unknown element', () => {
    const original = `
      <svg>
        <rect x="10" y="10" width="100" height="100" />
        <div>
          some text!
          <more />
          more text!
          <evenMore></evenMore>
          even more text!
        </div>
      </svg>
    `;
    const expected = getElement('svg', {}, [
      getElement('rect', { x: '10', y: '10', width: '100', height: '100' }, [], true),
    ]);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });

  it('should ignore text outside of element', () => {
    const original = `
      Oops!
      <svg />
    `;
    const expected = getElement('svg', {}, [], true);

    const result = getJSXFromContents(original, types);

    assert.deepEqual(result, expected);
  });
});
