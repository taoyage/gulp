'use strict';

const gulp = require("gulp");
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const minifyCss = require('gulp-minify-css');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');



const path = {
	sass : './public/sass/main.scss',
	watch_sass : 'public/sass/**/*.scss',
	js : './public/js/**/*.js',
	html : './public/**/*.html'
};

const dest_path = {
	sass : './public/css/',
	js : './public/'
};

/*合并js*/
gulp.task('scripts', function() {
	return gulp.src(path.js)
	.pipe(concat('app.js'))
	.pipe(gulp.dest(dest_path.js))
	.pipe(rename({ extname:'.min.js' }))
	.pipe(uglify())
	.pipe(gulp.dest(dest_path.js))
	.pipe(livereload());
});

/*编译sass*/
gulp.task('sass', function () {
	gulp.src(path.sass)
	.pipe(sass())
	.on('error', sass.logError)
	.pipe(gulp.dest(dest_path.sass))
	.pipe(livereload())
	.pipe(minifyCss({
		keepSpecialComments: 0
	}))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(dest_path.sass));
});

/*html*/
gulp.task('html',function(){
	gulp.src(path.html)
	.pipe(livereload());
});

/*启动node服务器*/
gulp.task('serve', function (cb) {
  nodemon({
    script  : 'app.js',
    watch   : 'app.js'
  }).on('start',function(){
    setTimeout(function(){
      livereload.changed();
    },2000);
  })
});

/*监控*/
gulp.task('watch',function(){
	watch(path.js,function(event){
		gulp.start('scripts');
	});
	watch(path.watch_sass,function(event){
		gulp.start('sass');
	});
	watch(path.html,function(event){
		gulp.start('html');
	})
});

gulp.task('default', ['watch','serve']);



