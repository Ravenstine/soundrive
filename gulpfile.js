var gulp       = require('gulp');
var coffee     = require('gulp-coffee');
var jasmine    = require('gulp-jasmine');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify'); 
var source     = require('vinyl-source-stream');
var babel      = require('gulp-babel');

gulp.task('coffee-src', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    // .pipe(browserify())
    .pipe(babel())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('playground', function() {
  return gulp.src('./playground/src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    // .pipe(browserify())
    .pipe(babel())
    .pipe(gulp.dest('./playground/build/'));
});

gulp.task('build', ['coffee-src', 'playground']);
