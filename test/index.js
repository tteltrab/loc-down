/* globals describe, it */
'use strict';

const expect = require('chai').expect;
const git = require('simple-git')();
const rewire = require('rewire');

const branch = 'master';
const error = 'Danger, Will Robinson!';
const locDown = rewire('../index');
const maxLOC = 300;
const remote = 'git@github.com:tteltrab/loc-down.git';

const setupTest = function setupTest (fetchError, diffError, insertions, deletions) {
  locDown.__set__('git', {
    addRemote: function mockGit () {
      console.log(this);
      return this;
    },
    diff: (options, then) => then(
      null,
`test/index.js | 9 ++++++---
1 file changed, ${insertions} insertions(+), ${deletions} deletions(-))`
    ),
    diffSummary: diffError ?
      function mockError (diffFrom, then) {
        then(diffError);
      }
      : git.diffSummary,
    fetch: function mockGit (remoteName, branchName, then) {
      return then(fetchError);
    },
    removeRemote: function mockGit () {
      return this;
    },
  });
};

describe('The utility for testing lines of code changed', () => {
  it('returns true if the number of LOC changed between current HEAD and the remote is less ' +
    'than the maximum LOC number indicated', done => {
    setupTest(false, false, 100, 100);

    locDown(remote, branch, maxLOC)
      .then(diff => {
        expect(diff).to.equal(true);
        done();
      })
      .catch(done);
  });

  it('returns false if the number of LOC changed between current HEAD and the remote is greater ' +
    'than the maximum LOC number indicated', done => {
    setupTest(false, false, 200, 200);

    locDown(remote, branch, maxLOC)
      .then(diff => {
        expect(diff).to.equal(false);
        done();
      })
      .catch(done);
  });

  it('returns error if encountered trying to fetch remote', done => {
    setupTest(error, false, 100, 100);

    locDown(remote, branch, maxLOC)
      .catch(err => {
        expect(err).to.equal(error);
        done();
      })
      .catch(done);
  });

  it('returns error if encountered trying to diff with remote', done => {
    setupTest(false, error, 200, 200);

    locDown(remote, branch, maxLOC)
      .catch(err => {
        expect(err).to.equal(error);
        done();
      })
      .catch(done);
  });
});
