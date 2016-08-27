'use strict';

// Подключаемые плагины
var gulp        = require('gulp');
var watch       = require('gulp-watch');
var plumber     = require('gulp-plumber');
var clean       = require('gulp-clean');
var runSequence = require('run-sequence');
var jade        = require('gulp-jade');
// var sass        = require('gulp-sass');
var sass        = require('gulp-ruby-sass');
var sourcemaps  = require('gulp-sourcemaps');
var connect     = require('gulp-connect');
var wiredep     = require('gulp-wiredep');
var zip         = require('gulp-zip');
var spritesmith = require('gulp.spritesmith');
var imagemin    = require('gulp-imagemin');
var merge       = require('merge-stream');

// Переменные
var _src           = './src';
var _images_src    = './images_src';
var _dist          = './dist';
var _backups       = './backups';


// ------------------------------------
// Компиляция Jade файлов в html
gulp.task('jade', function() {
	return gulp.src( _src + '/jade/*.jade' )
		.pipe(plumber())
		.pipe(jade({
			pretty: '    ',
			doctype: 'html'
		}))
		.pipe(gulp.dest( _src + '/html/' ));
});

// Компиляция Jade файлов в html (watch)
gulp.task('jade:watch', function() {
	watch(_src + '/jade/**/*.jade', function() {
		var start = Date.now();

		var rtrn = gulp.src( _src + '/jade/*.jade' )
			.pipe(plumber())
			.pipe(jade({
				pretty: '    ',
				doctype: 'html'
			}))
			.pipe(gulp.dest( _src + '/html/' ));

		var stop = Date.now();
		var time = stop - start;
		var date = new Date();
		console.log('['+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()  +']' + ' jade:watch - ' + time + ' ms');

		return rtrn;
	});
});
// ------------------------------------



// ------------------------------------
// Компиляция scss в css с использованием sourcemap
gulp.task('scss', function() {
	return sass( 'src/scss/main.scss', {sourcemap: true, style: 'expanded'/*, require: 'susy'*/} )
		.on('error', sass.logError)
		.pipe(sourcemaps.write( './' ))
		.pipe(gulp.dest( 'src/css' ));
});

// Компиляция scss в css с использованием sourcemap (watch)
gulp.task('scss:watch', function() {
	watch(_src + '/scss/**/*.scss', function() {
		var start = Date.now();
		
		var rtrn = sass( 'src/scss/main.scss', {sourcemap: true, style: 'expanded'/*, require: 'susy'*/} )
			.on('error', sass.logError)
			.pipe(sourcemaps.write( './' ))
			.pipe(gulp.dest( 'src/css' ));

		var stop = Date.now();
		var time = stop - start;
		var date = new Date();
		console.log('['+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()  +']' + ' scss:watch - ' + time + ' ms');

		return rtrn;
	});
});
// ------------------------------------



// ------------------------------------
// Запуск Web сервера
gulp.task('server:start', function() {
	connect.server({
		root: [ _src + '/html/', _src ],
		livereload: true
	});
});

// Слежение за изменением html файлов и запуск автообновления
gulp.task('html:watch', function() {
	watch([_src + '/html/**/*.html', _src + '/css/**/*.css', _src + '/js/**/*.js'], function() {
		var start = Date.now();

		return gulp.src( [_src + '/html/**/*.html', _src + '/css/**/*.css', _src + '/js/**/*.js'] )
			.pipe(connect.reload());

		var stop = Date.now();
		var time = stop - start;
		var date = new Date();
		console.log('['+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()  +']' + ' html:watch - ' + time + ' ms');
	});
});
// ------------------------------------



// Запуск WATCH компиляторов Jade и SCSS, запуск HTTP сервера и WATCH автообновления страницы
gulp.task('run', ['jade:watch', 'scss:watch', 'server:start', 'html:watch']);





// Вспомогательные задачи

// ------------------------------------
// Плагин gulp-wiredep прописывает в указанных местах jade файлов пути к css и js файлам библиотек, установленных через bower.
// Данные о том какие библиотеки установлены он берет из раздела зависимостей файла bower.json
gulp.task('bower', function () {
	gulp.src( _src + '/jade/**/*.jade' )
		.pipe(wiredep({
			optional: 'configuration',
			goes: 'here',
			ignorePath: '../../'
			}))
		.pipe(gulp.dest( _src + '/jade/' ));
});
// ------------------------------------



// ------------------------------------
// Создание спрайта
gulp.task('sprite', function () {

	var spriteData = gulp.src( _images_src + '/for_sprite/**/*.png' )
		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../images/sprite/sprite.png',
			cssName: '_sprite.scss',
			cssVarMap: function( sprite ) {
				sprite.name = 's-' + sprite.name
			}
		}));
	var imgStream = spriteData.img
		.pipe(gulp.dest( _src + '/images/sprite/' ));
	var cssStream = spriteData.css
		.pipe(gulp.dest( _src + '/scss/common/' ));

	return merge(imgStream, cssStream);
});

// Создание спрайта (watch)
gulp.task('sprite:watch', function() {
	watch( _images_src + '/for_sprite/**/*.png', function() {
		var start = Date.now();

		var spriteData = gulp.src( _images_src + '/for_sprite/**/*.png' )
			.pipe(spritesmith({
				imgName: 'sprite.png',
				imgPath: '../images/sprite/sprite.png',
				cssName: '_sprite.scss',
				cssVarMap: function( sprite ) {
					sprite.name = 's-' + sprite.name
				}
			}));
		var imgStream = spriteData.img
			.pipe(gulp.dest( _src + '/images/sprite/' ));
		var cssStream = spriteData.css
			.pipe(gulp.dest( _src + '/scss/common/' ));

		var rtrn = merge(imgStream, cssStream);

		var stop = Date.now();
		var time = stop - start;
		var date = new Date();
		console.log('['+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()  +']' + ' sprite:watch - ' + time + ' ms');

		return rtrn;
	});
});
// ------------------------------------



// ------------------------------------
// Оптимизация изображений
gulp.task('imagemin', function() {

	return gulp.src( _images_src + '/images/**/*' )
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest( _src + '/images/' ));
});

// Оптимизация изображений (watch)
gulp.task('imagemin:watch', function() {
	watch( _images_src + '/images/**/*', function() {
		var start = Date.now();

		var rtrn = gulp.src( _images_src + '/images/**/*' )
			.pipe(imagemin({progressive: true}))
			.pipe(gulp.dest( _src + '/images/' ));

		var stop = Date.now();
		var time = stop - start;
		var date = new Date();
		console.log('['+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()  +']' + ' imagemin:watch - ' + time + ' ms');

		return rtrn;
	});
});
// ------------------------------------



// ------------------------------------
// Создание резервной копии в папке backups
gulp.task('backup', function() {
	var date = new Date();
	var Y    = date.getFullYear();
	var M    = date.getMonth()+1;
	var D    = date.getDate();
	var TIME = date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds();
	return gulp.src( _src + '/**/*' )
		.pipe(zip(D + '_' + M + '_' + Y + '__' + TIME + '.zip'))
		.pipe(gulp.dest( _backups ));
});
// ------------------------------------



// ------------------------------------
// Создание быстрой сборки (без конкатинации и минификации)
gulp.task('build:fast:clean', function() {
	return gulp.src( _dist, {read: false} )
        .pipe( clean() );
});
gulp.task('build:fast:assets', function() {
    return gulp.src( _src + '/assets/**/*' )
    	.pipe(gulp.dest( _dist + '/assets' ));
});
gulp.task('build:fast:css', function() {
    return gulp.src( _src + '/css/**/*.css' )
    	.pipe(gulp.dest( _dist + '/css' ));
});
gulp.task('build:fast:fonts', function() {
    return gulp.src( _src + '/fonts/**/*' )
    	.pipe(gulp.dest( _dist + '/fonts' ));
});
gulp.task('build:fast:html', function() {
    return gulp.src( _src + '/html/**/*' )
    	.pipe(gulp.dest( _dist ));
});
gulp.task('build:fast:images', function() {
    return gulp.src( _src + '/images/**/*' )
    	.pipe(gulp.dest( _dist + '/images' ));
});
gulp.task('build:fast:js', function() {
    return gulp.src( _src + '/js/**/*' )
    	.pipe(gulp.dest( _dist + '/js' ));
});
gulp.task('build:fast:libs', function() {
    return gulp.src( _src + '/libs/**/*' )
    	.pipe(gulp.dest( _dist + '/libs' ));
});
gulp.task('build:fast', function() {
	runSequence('build:fast:clean', ['build:fast:assets', 'build:fast:css', 'build:fast:fonts', 'build:fast:html', 'build:fast:images', 'build:fast:js', 'build:fast:libs']);
});
// ------------------------------------