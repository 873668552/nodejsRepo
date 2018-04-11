var uglify = require('gulp-uglify');//获取uglify 模块（用于压缩JS）
var concat = require('gulp-concat');//合并
var rename = require('gulp-rename');//改名
var minifyCSS = require('gulp-minify-css');//获取minify-css 模块（用于压缩CSS）
var sass = require('gulp-sass');//编译scss
var babel = require("gulp-babel");//es6转es5
// var es2015 = require("babel-preset-es2015");//es6转es5
const gulp = require('gulp');

// 
gulp.task('scss',function(){
    gulp.src('./*.scss')
    .pipe(concat('./test.css'))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./css/'));
});
// 
gulp.task('index',function(){
    gulp.src('./index.scss')
    .pipe(concat('./index.css'))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./css/'));
});
// system 样式
gulp.task('sys',function(){
    gulp.src('./system.scss')
    .pipe(concat('./sys.css'))// 暂时缓存文件
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({suffix:'.min'}))//改名功能
    .pipe(gulp.dest('./css/'));// 最总保存地方
});
gulp.task('auto',()=>{
    // 监听那个文件 ， 执行那个任务
    gulp.watch('./system.scss',['sys'])
})