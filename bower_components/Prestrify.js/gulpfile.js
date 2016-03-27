var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var order = require('gulp-order');
var registerBuildSlides = require('./scripts/gulp/build-slides');

registerBuildSlides();

var paths = {
  src: 'src',
  build: 'build',
  js: 'src/**/*.js',
  demo: 'demo'
};

var moduleOrder = [
  '**/prestrify.js',
  '**/file-loader.js',
  '**/description-manager.js',
  '**/engine.js'
];


gulp.task('dev', ['build', 'build-slides'], function () {

  browserSync.init({
    server: {
      baseDir: './'
    },
    files: ['./' + paths.demo + '/**'],
    open: false,
    logFileChanges: false
  });

  gulp.watch(paths.js, ['build']);
  gulp.watch(paths.build).on('change', reload);
});

gulp.task('build', function () {
  return gulp.src(paths.js).pipe(order(moduleOrder)).pipe(concat('prestrify.js')).pipe(gulp.dest(paths.build));
});