var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');

var basePath = '../client';

function lessFiles() {
    const apps = ['blog', 'admin'];

    for (const app in apps) {
        return gulp.src(basePath + '/' + apps[app] + '/_content/app.less')
            .pipe(plumber())
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(cleanCSS())
            .pipe(gulp.dest(basePath + '/' + apps[app] + '/_dist/'));
    }
};

function scripts() {
    const apps = ['blog', 'admin'];

    for (const app in apps) {
        return gulp.src([
            basePath + '/' + apps[app] + '/**/*.js', 
            '!' + basePath + '/' + apps[app] + '/_content/**/*.js', 
            '!' + basePath + '/' + apps[app] + '/_dist/**/*.js'
        ])
            .pipe(plumber())
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(concat('app.min.js'))
            .pipe(gulp.dest(basePath + '/' + apps[app] + '/_dist'));
    }
};

exports.scripts = scripts;
exports.lessFiles = lessFiles;

exports.default = gulp.series(lessFiles, scripts);
