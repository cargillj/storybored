var gulp = require('gulp')
  , htmlReplace = require('gulp-html-replace')
  , mainBowerFiles = require('main-bower-files')
  , filter = require('gulp-filter')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , sass = require('gulp-sass')
  , order = require('gulp-order')
  , del = require('del');

var bases = {
  src: './src/client/',
  dist: 'dist/'
};

var paths = {
  index: ['./src/client/index.html'],
  views: ['./src/client/app/**/*.html'],
  scripts: ['src/client/app/**/*.js'],
  sass: ['./src/client/static/css/*'],
  vendorcss: [
    './src/client/bower_components/bootstrap/dist/css/bootstrap.min.css',
    './src/client/bower_components/font-awesome/css/font-awesome.min.css'
  ],
  fonts: './src/client/static/fonts/*',
  images: './src/client/static/img/**'
};

var bowerConfig = {
  paths: {
    bowerDirectory: './src/client/bower_components',
    bowerJson: './src/client/bower.json'
  }
};

// Combine and minify vendor js
gulp.task('vendorjs', function() {
  gulp.src(mainBowerFiles(bowerConfig))
    .pipe(filter('*.js'))
    .pipe(order([
      "src/client/bower_components/jquery/dist/jquery.js",
      "src/client/bower_components/angular/angular.js",
      "*"
    ], {base: './'}))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.dist+'scripts/'));
});

// Combine and minify app js
gulp.task('js', function() {
  gulp.src(paths.scripts)
  .pipe(order([
    "src/client/app/storybored/storybored.module.js",
    "src/client/app/storybored/storybored.js",
    "src/client/app/storybored/route-config.js",
    "*"
  ], {base: './'}))
  .pipe(concat("storybored.min.js"))
  .pipe(uglify({mangle: false}))
  .pipe(gulp.dest(bases.dist+'scripts/'));
});

// Compile all sass
gulp.task('sass', function() {
  gulp.src(paths.sass)
    .pipe(filter('*scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(bases.dist+'css/'));
});

// Put vendor css in dist
gulp.task('vendorcss', function() {
  gulp.src(paths.vendorcss)
    .pipe(gulp.dest(bases.dist+'css/'));
});

// Put fonts in dist
gulp.task('fonts', function() {
  gulp.src(paths.fonts)
    .pipe(gulp.dest(bases.dist+'fonts/'))
});

// inject style and scripts into HTML
gulp.task('index', function() {
  gulp.src(paths.index)
    .pipe(htmlReplace({
      css: ['css/bootstrap.min.css', 'css/font-awesome.min.css', 'css/style.css'],
      js: ['scripts/vendor.min.js', 'scripts/storybored.min.js'],
      theme: {
        src: 'css/theme.light.css',
        tpl: '<link href="%s" rel="stylesheet" id="light-theme"></link>'
      }
    }))
    .pipe(gulp.dest(bases.dist));
});

// Put views in dist
gulp.task('views', function() {
  gulp.src(paths.views)
    .pipe(gulp.dest(bases.dist+'views/'))
});

// TEMPORARY: put images in dist
gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(gulp.dest(bases.dist+'img/'))
}); 

// Build dist folder
gulp.task('dist', ['vendorjs', 'js', 'sass', 'vendorcss', 'fonts', 'index', 'views', 'images']);

// Delete the dist directory
gulp.task('clean:dist', function() {
  return del([
    'dist'
  ]);
});

gulp.task('clean', ['clean:dist']);

// Default task
gulp.task('default', function() {});