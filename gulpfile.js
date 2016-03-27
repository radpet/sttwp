var gulp = require('gulp');
var del = require('del');
var registerPrestrifyBuildScript = require('./bower_components/Prestrify.js/scripts/gulp/build-slides');

registerPrestrifyBuildScript(gulp);

gulp.task('build', ['build-slides'], function () {
  del.sync('build');
  gulp.src('src/index.html').pipe(gulp.dest('build'));
  gulp.src('src/slides/**').pipe(gulp.dest('build/slides'));
});

