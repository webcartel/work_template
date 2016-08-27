1. Создание структуры папок.
	
	- Через Git bash
		mkdir src/{css,fonts,html,images,jade,js,libs,scss} -p && mkdir images_src/{for_sprite,images} -p

	- Просто через консоль Windows
		md src\css src\fonts src\html src\images src\jade src\js src\libs src\scss && md images_src\for_sprite images_src\images



2. Установка плагинов Gulp ГЛОБАЛЬНО с флагом -g (флаг --save-dev можно использовать для сохранения зависимостей в файле package.json при локальной установке).

	npm install -g gulp gulp-watch gulp-plumber gulp-jade gulp-sass gulp-ruby-sass gulp-sourcemaps gulp-connect gulp-wiredep gulp-clean run-sequence gulp-zip gulp.spritesmith gulp-imagemin merge-stream

3. Создание локально в папке с проектом папки node_modules и создание в ней ссылок на глобально установленные модули, что бы можно было их использовать в проекте.

	npm link gulp gulp-watch gulp-plumber gulp-jade gulp-sass gulp-ruby-sass gulp-sourcemaps gulp-connect gulp-wiredep gulp-clean run-sequence gulp-zip gulp.spritesmith gulp-imagemin merge-stream