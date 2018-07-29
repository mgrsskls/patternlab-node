/* load command line arguments */
var args = require('yargs').argv;

/* load gulp */
var gulp = require('gulp');

/* load the plugins */
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins({ scope: ['devDependencies'] });
plugins.del = require('del');

/* copy the dist folder into the designated public folder */
function copyPublic(suffix) {
  if (args['copy-dist'] !== undefined) {
    return gulp.dest(args['copy-dist'] + '/' + suffix);
  } else {
    return plugins.util.noop();
  }
}

gulp.task('clean:css', function(cb) {
  return plugins.del(['dist/styleguide/css/*'], cb);
});

gulp.task('clean:html', function(cb) {
  return plugins.del(['dist/*.html'], cb);
});

gulp.task('clean:images', function(cb) {
  return plugins.del(['dist/styleguide/images/*'], cb);
});

gulp.task('clean:js', function(cb) {
  return plugins.del(['dist/styleguide/js/*'], cb);
});

gulp.task('build:css', function() {
  return plugins
    .rubySass('src/sass/pattern-lab.scss', {
      style: 'expanded',
      'sourcemap=none': true,
    })
    .pipe(
      plugins.autoprefixer(
        {
          browsers: [
            'last 2 version',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'android 4',
          ],
        },
        { map: false }
      )
    )
    .pipe(gulp.dest('dist/styleguide/css'))
    .pipe(copyPublic('styleguide/css'));
});

gulp.task('build:html', ['clean:html'], function() {
  return gulp
    .src('src/html/index.html')
    .pipe(plugins.fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest('dist'))
    .pipe(copyPublic(''));
});

gulp.task('build:images', ['clean:images'], function() {
  return gulp
    .src('src/images/*')
    .pipe(
      plugins.imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [plugins.pngcrush()],
      })
    )
    .pipe(gulp.dest('dist/styleguide/images'))
    .pipe(copyPublic('styleguide/images'));
});

gulp.task('default', ['build:css', 'build:html'], function() {
  if (args.watch !== undefined) {
    gulp.watch(
      ['src/sass/pattern-lab.scss', 'src/sass/scss/**/*'],
      ['build:css']
    );
    gulp.watch(['src/html/*'], ['build:html']);
  }
});
