var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');

var basePath = '../client';

function blogCss() {

    return gulp.src(basePath + '/blog/_content/bootstrap.css')
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(basePath + '/blog/_dist/'));
};

function blogLess() {

    return gulp.src(basePath + '/blog/_content/app.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(basePath + '/blog/_dist/'));
};

function adminLess() {

    return gulp.src(basePath + '/admin/_content/app.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(basePath + '/admin/_dist/'));
};

function blogScripts() {

    return gulp.src([
        basePath + '/blog/**/*.js', 
        '!' + basePath + '/blog/_content/**/*.js', 
        '!' + basePath + '/blog/_dist/**/*.js'
    ])
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(basePath + '/blog/_dist'));
};

function adminScripts() {

    return gulp.src([
        basePath + '/admin/**/*.js', 
        '!' + basePath + '/admin/_content/**/*.js', 
        '!' + basePath + '/admin/_dist/**/*.js'
    ])
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(basePath + '/admin/_dist'));
};

exports.blogCss = blogCss;
exports.blogLess = blogLess;
exports.adminLess = adminLess;
exports.blogScripts = blogScripts;
exports.adminScripts = adminScripts;

exports.default = gulp.series(gulp.parallel(blogCss, blogLess, adminLess), gulp.parallel(blogScripts, adminScripts));
