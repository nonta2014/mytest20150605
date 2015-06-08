'use strict';

var gulp=require("gulp");
var less=require("gulp-less");
var sass=require("gulp-sass");
var cssimport=require("gulp-cssimport");
var autoprefixer=require("gulp-autoprefixer");
var concat=require("gulp-concat");
var frontnote=require("gulp-frontnote");//コメントからドキュメントでも作るのかな？
var uglify=require("gulp-uglify");//js圧縮
var browser=require("browser-sync");
var plumber=require("gulp-plumber");//エラーでも止めない（勉強中は邪魔かも）

var csso = require('gulp-csso'); //CSS圧縮
// var minifyCss = require('gulp-minify-css'); //他のサンプルにあった。一旦無視。

var rename = require('gulp-rename');
var streamqueue = require('streamqueue');
var merge=require('merge-stream');

var minifyHTML = require('gulp-minify-html');

var del=require("del");
var rimraf=require('rimraf');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
// var react = require('gulp-react');



//defaultタスクは、単に`gulp`と叩いたときに実行される処理となります。
// gulp.task("default",['clean','js','html','css','server'],function(){
gulp.task("default",['js','html','css','server'],function(){
	gulp.watch(["src/jsx/**/*.jsx"],["js"]);
	gulp.watch(["src/css/**/*.css","src/css/**/*.scss","src/css/**/*.less"],["css"]);
	gulp.watch(["src/html/**/*.html"],["html"]);
});


gulp.task("server",function(){
	browser({
		server:{
			baseDir:"./dist/",directory:false
		}
	});
});

//順序保証できてないっぽい？bindってなんだ？streamを返したいんだけど……。
// 参考 : <http://qiita.com/shinnn/items/bd7ad79526eff37cebd0>
// gulp.task('clean',del.bind(null,['dist/**/*','temp/**/*']));

//上の参考でdeprecatedとなってるやつを試した → AssertionError: rimraf: missing path
// gulp.task('clean',function(cb){
// 	return gulp.src(['dist','temp'],{read:false})
// 		.pipe(rimraf());
// });



gulp.task('html',function(){
	return gulp.src(["src/html/**/*.html"])
		.pipe(plumber())
		.pipe(minifyHTML({conditionals: true}))
		.pipe(gulp.dest("./dist"))
		.pipe(browser.reload({stream:true}))
	;
});


// ＿＿＿■＿＿■■■＿
// ＿＿＿■＿■＿＿＿＿
// ＿＿＿■＿＿■■＿＿
// ■＿＿■＿＿＿＿■＿
// ＿■■＿＿■■■＿＿


//メモ : 通常のJavaScriptをJSXと同居させる方法は不明。
// React使わないなら、普通にbrowserifyだけ使うコードを検討したほうが早いかも。

gulp.task('js', function(){
	var bundler=browserify('./src/jsx/index.jsx',{debug:true});
	return bundler
		.transform(reactify,{harmony:true}) //あれ？？harmony:trueはどこで？？
		.bundle()
		.pipe(plumber())
		.pipe(source('app.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
		.pipe(browser.reload({stream:true}))
	;
});



// ＿■■＿＿＿■■■＿＿■■■＿
// ■＿＿■＿■＿＿＿＿■＿＿＿＿
// ■＿＿＿＿＿■■＿＿＿■■＿＿
// ■＿＿■＿＿＿＿■＿＿＿＿■＿
// ＿■■＿＿■■■＿＿■■■＿＿

//CSSごった煮コンパイル 参考 : <http://qiita.com/cognitom/items/c6b5e95c41dd53fe3dcf>
// <https://www.npmjs.com/package/streamqueue>
gulp.task('css',function(){
	streamqueue({objectMode:true},
		gulp.src(['src/css/**/*.less']).pipe(less()),
		gulp.src(['src/css/**/*.scss']).pipe(sass()),
		gulp.src(['src/css/**/*.css'])
			.pipe(plumber())
			.pipe(sass())
			.pipe(cssimport())
	).pipe(concat('styles.min.css'))
		.pipe(plumber())
		.pipe(csso())
		.pipe(gulp.dest("./dist"))
		.pipe(browser.reload({stream:true}))
	;
});





