var gulp = require('gulp'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    fs = require('fs'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    gulpNgConfig = require('gulp-ng-config'),
    filter = require('gulp-filter'),
    json = JSON.parse(fs.readFileSync('./package.json')),
	purify = require('gulp-purifycss');


gulp.task('clean', function () {
  return gulp.src('dist/**/*')
    .pipe(filter(['*', '!.git']))
    .pipe(clean());
});

gulp.task('config', function () {
  gulp.src('./local.json')
  .pipe(gulpNgConfig('app.config', {
    environment: argv.production ? 'production' : 'development'
  }))
  .pipe(gulp.dest('app'))
})

gulp.task('connect', function(){
    connect.server({
        root: 'dist',
        port: 4930
    });
});

gulp.task('copy-html', ['clean'], function(){
    return gulp.src(['app/index.html', './**/*.html', '!node_modules/**/*.html', '!vendor/**/*.html', '!dist/**/*.html', '!static/**/*.html'])
            .pipe(gulp.dest('dist'));
});

gulp.task('copy-fonts', ['clean'], function(){
    return gulp.src('assets/fonts/**/*')
            .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('copy-images', ['clean'], function(){
    return gulp.src('assets/img/**/*')
            .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('vendorjs', ['clean'], function(){
    return gulp
		.src([
      'assets/vendor/angular/angular.js',
      'assets/vendor/angular/angular-animate/angular-animate.js',
      'assets/vendor/angular/angular-bootstrap/ui-bootstrap-custom-tpls-0.14.3.min.js',
      'assets/vendor/angular/angular-ui-router/angular-ui-router.js',
      'assets/vendor/angular/restangular/restangular.min.js',
      'assets/vendor/angular/ng-feathers.standalone.min.js',
      'assets/vendor/angular/underscore/underscore-min.js',
      'assets/vendor/angular/angular-chart/Chart.js',
      'assets/vendor/angular/angular-chart/angular-chart.min.js',
      'assets/vendor/angular/dirDisqus.js',

		'assets/vendor/*.js'
		])
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('vendorcss', ['clean'], function(){
    return gulp
			.src([
        'assets/vendor/animate/animate.css',
        'assets/vendor/bootstraps/bootstraps.css',
        'assets/vendor/font-awesome/font-awesome.css',
				'assets/vendor/**/*.css'
			])
		    .pipe(concat('vendor.css'))
		    .pipe(gulpif(argv.production, cssmin()))
			.pipe(gulpif(argv.production, purify(['./dist/**/*.js', './dist/**/*.html'])))
		    .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('appjsfiles', ['clean'], function(){
    return gulp.src([ 'app/local.js', 'assets/js/app.js', 'assets/js/*.js', 'modules/**/*.js'])
            .pipe(concat(json.name.toLowerCase() + '.js'))
            .pipe(gulpif(argv.production, uglify()))
            .pipe(gulpif(argv.production, rename({suffix: '.min'})))
            .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('link-files', ['copy-images', 'copy-fonts', 'copy-html',  'vendorjs', 'vendorcss', 'appjsfiles'], function () {
  var target = gulp.src('dist/index.html');
  var sources = gulp.src(['dist/assets/js/vendor.js', 'dist/assets/js/*.js', 'dist/assets/css/vendor.css', 'dist/assets/css/*.css'], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('style', ['clean'], function(){
    return gulp.src(['assets/css/app.css', 'assets/css/ted.css'])

        .pipe(concat(json.name.toLowerCase() + '.css'))
        .pipe(gulpif(argv.production, cssmin()))
		.pipe(gulpif(argv.production, purify(['./dist/**/*.js', './dist/**/*.html'])))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
		.pipe(gulp.dest('dist/assets/css'))
});

gulp.task('logger', function(){
    console.info('===== A file changed ======== restarting server now ====');
});

gulp.task('build', [ 'config', 'style', 'link-files']);

gulp.task('serve', ['connect', 'config', 'style', 'link-files'], function () {
	return gulp.watch(['app/**/*', 'assets/**/*', 'modules/**/*'], ['logger', 'style', 'link-files']);
});
