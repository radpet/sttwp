var gutil = require('gulp-util');
var concat = require('gulp-concat');
var del = require('del');

function getPath(basePath) {
  return function (path) {
    return basePath + path;
  }
}

var paths = {
  build: 'build'
};

function buildSlides(gulp) {

  gulp.task('build-slides', function () {
    var basePath = gutil.env['basePath'];
    if (!basePath) {
      basePath = './src';
    }

    var base = getPath(basePath);
    del.sync(paths.build);
    gulp.src(base('**/config.js')).pipe(concat('config.js')).pipe(gulp.dest(paths.build));


  });

}

module.exports = buildSlides;