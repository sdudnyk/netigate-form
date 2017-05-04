'use  strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');

gulp.task('sass', function () {
  var processors = [
    autoprefixer({browsers: ['last 10 version']}),

  ];

 return gulp.src('./sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./css'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
