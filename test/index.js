/* globals describe, it */
'use strict';

const expect = require('chai').expect;
const locDown = require('../index');

describe('loc-down', () => {
  it('does nothing', () => {
    expect(locDown()).to.equal(true);
  });
});
