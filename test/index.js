/* globals describe, it, afterEach */
'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

const branch = 'master';
const error = 'Danger, Will Robinson!';
const locDown = rewire('../index');
const maxLOC = 300;
const remote = 'git@github.com:tteltrab/loc-down.git';

const gitMock = locDown.__get__('git');

const setupTest = function setupTest (fetchError, diffError, insertions, deletions) {
  sinon.stub(gitMock, 'addRemote', () => gitMock);
  sinon.stub(gitMock, 'diffSummary', (diffFrom, then) => then(diffError, {
    insertions,
    deletions,
  }));
  sinon.stub(gitMock, 'fetch', (remoteName, branchName, then) => then(fetchError));
  sinon.stub(gitMock, 'removeRemote', () => gitMock);
};

describe('The utility for testing lines of code changed', () => {
  afterEach(() => {
    gitMock.addRemote.restore();
    gitMock.diffSummary.restore();
    gitMock.fetch.restore();
    gitMock.removeRemote.restore();
  });

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
