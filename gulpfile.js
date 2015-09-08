'use strict';
var gulp = require('gulp'),   
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),// Плагин, позволяющий импортировать файлы кострукцией "//= pathToFile"
    rimraf = require('rimraf'),
    connect = require('gulp-connect'),
    opn = require('opn');

var config = {
   bowerDir: './bower_components',
   build: {
	sassPath: './build/styles',
	js: './build/scripts'
   },
   src: {
	sassPath: './res/styles/**/*.scss',
	js: './res/scripts/**/*.js'
   }
}


gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('scripts', function () {
    gulp.src(config.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.build.js))
        .pipe(connect.reload());
});

gulp.task('styles', function () {
   gulp.src(config.src.sassPath)
    .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.build.sassPath))
        .pipe(connect.reload());
});


gulp.task('watch', function () {
  gulp.watch(config.src.sassPath, ['styles']);
  gulp.watch(config.src.js, ['scripts']);
});