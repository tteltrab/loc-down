'use strict';

const babel = require('babel-register');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

gulp.task('eslint', () =>
  gulp.src([
    '**/*.js',
    '!coverage/**/*.js',
    '!node_modules/**/*.js',
  ])
  .pipe(eslint('.eslintrc'))
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
);

gulp.task('mocha', () =>
  gulp.src([
    '**/*.js',
    '!gulpfile.js',
    '!coverage/**/*.js',
    '!node_modules/**/*.js',
    '!test/**/*.js',
  ])
  .pipe(istanbul({
    instrumenter: isparta.Instrumenter,
    includeUntested: true,
  }))
  .pipe(istanbul.hookRequire())
  .on('finish', () => {
    gulp.src(['test/**/*.js'])
      .pipe(mocha({
        compilers: {
          js: babel,
        },
        reporter: 'spec',
      }))
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({
        thresholds: { global: 100 },
      }));
  })
);

gulp.task('coveralls', () => {
  if (!process.env.CI) {
    return false;
  }

  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('test', ['eslint', 'mocha']);
