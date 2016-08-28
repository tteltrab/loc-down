# loc-down [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
> check number lines of code changed

<img alt="John Locke smiling" src="https://cloud.githubusercontent.com/assets/1487463/18031721/a09417b2-6cbb-11e6-8edc-fd90d95e3729.gif" height="200">

## Installation

```sh
$ npm install --save loc-down
```

## Usage

```js
var locDown = require('loc-down');

locDown('git@github.com:tteltrab/loc-down.git', 'master', 200)
  .then(isReasonable => {
    // isReasonable is a boolean - true if <= 200 lines changed, false otherwise
  })
  .catch(error => {
    // error is whatever issue was encountered when trying to diff with the provided parameters
  });
```

## locDown(repo, branch, loc)

Determine if loc difference from `repo/branch` is less than or equal to `loc`.

* `repo` `{String}` url representation fo the repo against which diffs will be done
* `branch` `{String}` name of the branch to diff against
* `loc` `{Number}` number which indicates the maximum lines of code which should be changed

Returns a promise:
* `.then(isReasonable => {})` - promise is resolved if the diff was successful, with the boolean `isReasonable` being true/false if the loc difference is lte/gt the `loc` parameter respectively
* `.catch(error => {})` - promise is rejected if some error was encountered when attempting to diff agianst `repo/branch`

## License

MIT © [Nick Bartlett]()

[npm-image]: https://badge.fury.io/js/loc-down.svg
[npm-url]: https://npmjs.org/package/loc-down
[travis-image]: https://travis-ci.org/tteltrab/loc-down.svg?branch=master
[travis-url]: https://travis-ci.org/tteltrab/loc-down
