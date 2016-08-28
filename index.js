'use strict';

let git = require('simple-git')();
const randomString = require('randomstring');

/**
 * diffs the branch on the repo with the current HEAD,
 * failing if the diff has more than `loc` lines of code changed
 * @param  {string} repo   - url representation of the repo
 * @param  {string} branch - name of the branch to do the diff against, defualts to `master`
 * @param  {number} loc    - maximum number of lines of code changed
 * @returns {boolean}      - true if number of changes is lte `loc`
 */
module.exports = function checkLOC (repo, branch = 'master', loc) {
  return new Promise((resolve, reject) => {
    const remoteName = randomString.generate();

    git.addRemote(remoteName, repo)
    .fetch(remoteName, branch, error => {
      if (error) {
        reject(error);
      }
      else {
        git.diffSummary(`${remoteName}/${branch}`, (err, diffSummary) => {
          if (err) {
            return reject(err);
          }
          console.log(diffSummary)
          const { insertions, deletions } = diffSummary;

          return resolve(insertions + deletions <= loc);
        });
      }

      return git.removeRemote(remoteName);
    });
  });
};
