var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var gutil = require("gulp-util");

var onError = function (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
};

gulp.task('prepare-test', function () {
    return gulp.src(['lib/**/*.js'])
      // Covering files
      .pipe(istanbul())
      // Force `require` to return covered files
      .pipe(istanbul.hookRequire());
  });
  

gulp.task('test', ['prepare-test'], function () {
    return gulp.src(['test/tests/**/*.js'], {
        read: false
    }).pipe(plumber({
        errorHandler: onError
    })).pipe(mocha({
        timeout: 5000,
        reporter: 'spec'
    })).pipe(istanbul.writeReports());
    // Enforce a coverage of at least 90%
    //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));;
});

gulp.task('default', ['test'], function () {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});