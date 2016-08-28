/* globals describe, it */
'use strict';

const expect = require('chai').expect;
const locDown = require('../index');

describe('The utility for testing lines of code changed', () => {
  const maxLOC = 300;
  const remote = 'git@github.com:tteltrab/loc-down.git';
  const branch = 'master';

  it('returns true if the number of LOC changed between current HEAD and the remote is less ' +
    'than the maximum LOC number indicated', done => {
    locDown(remote, branch, maxLOC)
      .then(diff => {
        expect(diff).to.equal(true);
        done();
      })
      .catch(done);
  });
});
