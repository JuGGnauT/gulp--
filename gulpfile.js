/**
 * Created by TD-06 on 2017/6/29.
 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'), // 图片压缩
    pngquant = require('imagemin-pngquant'),// 深度压缩
    livereload = require('gulp-livereload'), // 网页自动刷新（文件变动后即时刷新页面）
    webserver = require('gulp-webserver'), //本地服务器
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'), // CSS压缩
    sourcemaps = require('gulp-sourcemaps');

gulp.task('html', function () {
    return gulp.src('src/**/*.html') // 指明源文件路径、并进行文件匹配
        .pipe(gulp.dest('dist')); // 输出路径
});
gulp.task('fonts', function () {
    return gulp.src('src/fonts/*.{eot,svg,ttf,woff,woff2}') // 指明源文件路径、并进行文件匹配
        .pipe(gulp.dest('dist/fonts'));// 输出路径
});
gulp.task('css', function () {
    gulp.src('src/css/*.less') //多个文件以数组形式传入
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
            cascade: false // 是否美化属性值
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css')); //将会在src/css下生成index.css以及detail.css
});
gulp.task('js', function () {
    return gulp.src('src/js/*.js') // 指明源文件路径、并进行文件匹配
        .pipe(sourcemaps.init())
        .pipe(uglify()) // 使用uglify进行压缩，并保留部分注释
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js')); // 输出路径
});
gulp.task('img', function () {
    return gulp.src('src/img/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest('dist/img')); // 输出路径
});
// 注册任务
gulp.task('webserver', function () {
    gulp.src('./dist') // 服务器目录（.代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch', function () {
    // 监听 html
    gulp.watch('src/**/*.html', ['html']);
    // 监听 less
    gulp.watch('src/**/*.less', ['css']);
    // 监听 images
    gulp.watch('src/img/**/*.{png,jpg,gif,svg}', ['img']);
    // 监听 js
    gulp.watch('src/js/*.js', ['js']);
});

gulp.task('default', ['html', 'img', 'css', 'js', 'fonts', 'webserver', 'watch']);