'use strict';

const assert = require('assert');

const removeIgnoredParts = require('../src/svg-utils').removeIgnoredParts;


describe('removeIgnoredParts', () => {
  it('should remove comments', () => {
    const original = `
      <element />
      <another><!-- comment --></another>
    `;
    const expected = `
      <element />
      <another></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });

  it('should remove the shortest comment substring', () => {
    const original = `
      <!-- here --><element /><!-- and there -->
      <another><!-- comment --><--  sup?  --></another>
    `;
    const expected = `
      <element />
      <another><--  sup?  --></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });

  it('should remove a processing instruction', () => {
    const original = `
      <element />
      <another><? comment ?></another>
    `;
    const expected = `
      <element />
      <another></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });

  it('should remove the shortest processing instruction', () => {
    const original = `
      <? here ?><element /><? and there ?>
      <another><? comment ?>sup??></another>
    `;
    const expected = `
      <element />
      <another>sup??></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });

  it('should remove doctype', () => {
    const original = `
      <element />
      <another><!DOCTYPE who="cares"></another>
    `;
    const expected = `
      <element />
      <another></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });

  it('should remove the shortest doctype', () => {
    const original = `
      <!doctype here><element /><!DOCTYPE and there>
      <another><!doctype comment>sup></another>
    `;
    const expected = `
      <element />
      <another>sup></another>
    `;

    const result = removeIgnoredParts(original);

    assert.equal(result, expected);
  });
});
