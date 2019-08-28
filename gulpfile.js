const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const eslint = require('gulp-eslint');
const alias = require('gulp-wechat-weapp-src-alisa');
const path = require('path');

const srcPath = './src/**';
const distPath = './dist/';
const filePath = {
	sassFiles: [
		`${srcPath}/*.scss`,
		`!${srcPath}/assets/styles/**/*.scss`,
		`!${srcPath}/_template/*.scss`,
		`!${srcPath}/libs/*`,
	],
	jsFiles: [`${srcPath}/*.js`, `!${srcPath}/_template/*.js`, `!${srcPath}/env/*.js`, `!${srcPath}/libs/*`],
	imgFiles: [`${srcPath}/*.{png,jpg,gif,ico}`, `!${srcPath}/libs/*`],
	// wxss,wxml,json文件直接复制
	copyFiles: [
		`${srcPath}/*.wxs`,
		`${srcPath}/*.wxss`,
		`!${srcPath}/_template/*.wxss`,
		`${srcPath}/*.wxml`,
		`!${srcPath}/_template/*.wxml`,
		`${srcPath}/*.json`,
		`!${srcPath}/_template/*.json`,
		`${srcPath}/libs/**`
	]
}

// 路径拼接
function _join(dirname) {
	return path.join(process.cwd(), 'src', dirname);
}

// 引用路径别名配置
const aliasConfig = {
	'@Libs': _join('libs'),
	'@Utils': _join('utils'),
	'@Components': _join('components'),
	'@Images': _join('assets/images'),
	'@Styles': _join('assets/styles'),
}

/** 清除dist目录 */
gulp.task('clean', done => {
	del.sync(['dist/**/*']);
	done();
})

/**
 * 编译sass文件, 支持sass 
 * 缺点: css无法引入样式，而wxss可以，现在时将其编译成css重命名而已，所以会把引用的文件整个一起打包进去，打包后的文件会比原来的大 
*/ 
const wxss = () => {
	return gulp.src(filePath.sassFiles, { since: gulp.lastRun(wxss) })
		.pipe(alias(aliasConfig)) 
		.pipe(sass())
		// .pipe(gulpIf(process.env.NODE_ENV === 'production', csso()))
		.pipe(rename({ extname: '.wxss' }))
		.pipe(gulp.dest(distPath));
}
gulp.task(wxss);

/** 编译JS文件 */
const js = () => {
  return gulp
		.src(filePath.jsFiles, { since: gulp.lastRun(js) })
		.pipe(alias(aliasConfig))
    // .pipe(eslint())
    // .pipe(eslint.format())
    .pipe(gulp.dest(distPath));
};
gulp.task(js);

/* 编译图片 */
const img = () => {
  return gulp
		.src(filePath.imgFiles, { since: gulp.lastRun(img)})
    // .pipe(imagemin())
    .pipe(gulp.dest(distPath));
};
gulp.task(img);

const copy = () => {
	return gulp
		.src(filePath.copyFiles, { since: gulp.lastRun(copy) })
		.pipe(alias(aliasConfig))
    .pipe(gulp.dest(distPath));
};
gulp.task(copy);

/* 配置请求地址相关 */
const envJs = (env) => {
  return () => {
    return gulp
      .src(`./src/env/${env}.js`)
      // .pipe(eslint())
      // .pipe(eslint.format())
      .pipe(rename('env.js'))
      .pipe(gulp.dest(distPath));
  };
};
gulp.task('devEnv', envJs('development'));

/* watch */
gulp.task('watch', () => {
  gulp.watch(filePath.sassFiles, wxss);
	gulp.watch(filePath.jsFiles, js);
	gulp.watch(filePath.imgFiles, img);
  gulp.watch(filePath.copyFiles, copy);
});

/* dev */
gulp.task('dev', 
	// gulp.series('clean', gulp.parallel('js', 'img', 'wxss', 'copy', 'devEnv'), 'watch')
	gulp.series('clean', gulp.parallel('js', 'img', 'wxss', 'copy'), 'watch')
);

/* build */
gulp.task(
  'build',
  // gulp.series('clean', gulp.parallel('js', 'img', 'wxss', 'copy', 'prodEnv'))
  gulp.series('clean', gulp.parallel('js', 'img', 'wxss', 'copy'))
);
