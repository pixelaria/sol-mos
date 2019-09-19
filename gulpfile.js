
const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const shorthand = require('gulp-shorthand');
const svgSprite = require('gulp-svg-sprites');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const clean = require('gulp-clean');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pxtorem = require('postcss-pxtorem');
const imagemin = require('gulp-imagemin');
const focus = require('postcss-focus');
const postcssPresetEnv = require('postcss-preset-env');
const imageminMozjpeg = require('imagemin-mozjpeg');
const htmlmin = require('gulp-htmlmin');
const csscomb = require('gulp-csscomb');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const gulpif = require('gulp-if');




const processors = [
autoprefixer({browsers: ['last 5 version']}),
postcssPresetEnv(),
focus(), 
pxtorem(), 
];

const cssmin = [
cssnano({
discardComments: {removeAll: true}
})
];

let isProd = true;

let webpackConfig = {
	output: {
		filename: 'app.min.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}
		]
	},
	mode: isProd ?  'production' : 'development'
}


gulp.task('webpack', function() {
  return gulp.src('frontend/js/app.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('public/js'));
});

// Clean
gulp.task('clean', function () { 
return gulp.src('public', {read: false})
.pipe(clean());
});



// Pug
gulp.task('pug', function() {
	return gulp.src('frontend/pug/*.pug')
	.pipe(pug({
		pretty:true
	}))
	.pipe(gulpif(!isProd, htmlmin({ 
		collapseWhitespace: true,
		removeComments: true
	})))
	.pipe(gulp.dest('public'))
});




// Stylus and css min
gulp.task('stylus', function(){
	return gulp.src('frontend/stylus/*.styl','frontend/stylus/*/*.styl')
	// .pipe(sourcemaps.init())
	.pipe(stylus())
	//.pipe(shorthand())
	.pipe(gulp.src('frontend/assets/css/*.css'))
	.pipe(concat('style.css'))
	.pipe(csscomb())
	.pipe(postcss(processors))
	// .pipe(sourcemaps.write('.'))
	
	.pipe(gulpif(isProd,postcss(cssmin)))
	.pipe(gulpif(isProd,rename({
		suffix: ".min"
	})))
	.pipe(gulp.dest('public/css'))
	.pipe(browserSync.stream());
});




// Svg sprites
gulp.task('svg:build', function () {
return gulp.src('frontend/assets/svg/*.svg')
.pipe(cheerio({
run: function ($) {
$('[fill]').removeAttr('fill');
$('[style]').removeAttr('style');
$('[height]').removeAttr('height');
$('[width]').removeAttr('width');
},
parserOptions: { xmlMode: true }
}))

.pipe(gulp.src('frontend/assets/svg/auto-icons/*.svg'))

.pipe(svgmin({
js2svg: {
pretty: true
}
}))
.pipe(replace('&gt;', '>'))
.pipe(svgSprite({
mode: "symbols",
preview: false,
selector: "icon-%f",
svg: {
symbols: 'sprite.svg'
}
}
))
.pipe(gulp.dest('public/svg'))
});



// Fonts
gulp.task('fonts:build', function(){
return gulp.src('frontend/assets/fonts/HelveticaNeueCyr/*')
.pipe(gulp.src('frontend/assets/fonts/Circe/*'))
.pipe(gulp.dest('public/css'))

});

// Image min
// npm config set unsafe-perm=true
gulp.task('images:build', function(){
return gulp.src('frontend/assets/images/**')
.pipe(imagemin({
interlaced: true,
progressive: true,
optimizationLevel: 5,
verbose: true
}))
.pipe(imagemin([imageminMozjpeg({
quality: 85
})]))
.pipe(gulp.dest('public/images'))


.pipe(gulp.src('frontend/assets/icons/**'))
.pipe(gulp.dest('public/icons'))



});

gulp.task('watch', function(){
gulp.watch(['frontend/stylus/*.styl','frontend/stylus/*/*.styl','frontend/stylus/**/*.styl','frontend/stylus/***/*.styl'],gulp.series('stylus'))
gulp.watch(['frontend/pug/*.pug','frontend/pug/**/*.pug'],gulp.series('pug'))
gulp.watch(['frontend/js/*.js','frontend/js/inc/*.js'],gulp.series('webpack'))
});
 
gulp.task('browser-sync', function() {
browserSync.init({
server: {
baseDir: "./public"
}
});
browserSync.watch('public',browserSync.reload)
});


// ПЕРВИЧНАЯ СБОРКА 
gulp.task('build:dev',gulp.series(
gulp.parallel('webpack', 'fonts:build','images:build','svg:build')));

// ЛОКАЛЬНАЯ СБОРКА 
gulp.task('dev', gulp.series('clean', gulp.parallel('build:dev', 'pug','stylus'),
gulp.parallel('watch','browser-sync')
));



