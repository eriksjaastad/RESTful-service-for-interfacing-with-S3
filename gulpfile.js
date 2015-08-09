'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('test', function() {
  return gulp
    .src('test/*.js')
    .pipe(mocha())
    .pipe(exit());
});

gulp.task('lint', function() {
  return gulp
    .src(['**/**/*.js', '!./node_modules/**', 'db/**'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(['**/**/*.js', '!./gulpfile.js', '!./node_modules/**'], ['lint']);
});

gulp.task('default', ['test'], function(){});
