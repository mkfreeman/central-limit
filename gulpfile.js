var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
  browserify({
    entries: 'src/index.jsx',
    extensions: ['.js', '.jsx'],
    debug: true
  })
  .transform(babelify,  {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task("watch", function() {
    // calls "build-js" whenever anything changes
    gulp.watch("src/**/*.js", ["build"]);
});

gulp.task('default', ['build']);
