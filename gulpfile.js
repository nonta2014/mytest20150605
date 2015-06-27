'use strict';

var fs=require("fs");

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

// var s3 = require('gulp-s3');
var awspublish = require('gulp-awspublish');

var replace = require('gulp-replace');


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
			baseDir:"./dist/debug",directory:false
		}
	});
});


//クリーンを実装したい……のだけど、なんかトラブったので保留中。。

//順序保証できてないっぽい？bindってなんだ？streamを返したいんだけど……。
// 参考 : <http://qiita.com/shinnn/items/bd7ad79526eff37cebd0>
// gulp.task('clean',del.bind(null,['dist/debug/**/*','temp/**/*']));

//上の参考でdeprecatedとなってるやつを試した → AssertionError: rimraf: missing path
// gulp.task('clean',function(cb){
// 	return gulp.src(['dist/debug','temp'],{read:false})
// 		.pipe(rimraf());
// });



// ＿■■■＿■■■＿＿
// ■＿＿＿＿＿＿＿■＿
// ＿■■＿＿＿■■＿＿
// ＿＿＿■＿＿＿＿■＿
// ■■■＿＿■■■＿＿

//S3デプロイ
// - ビルドが必要です。
// - じゃあ依存タスクかけばいいんですが、なんか順序保証がまだよくわかってないので、defaultタスク叩き直してからやってます。
gulp.task('deploy',function(){
	var IAM_cli_user = JSON.parse(fs.readFileSync('./secrets/aws/IAM-cli-user.json'));
	var publisher = awspublish.create({
		params: {
			Bucket: IAM_cli_user.bucket
		},
		"accessKeyId": IAM_cli_user.key,
		"secretAccessKey": IAM_cli_user.secret
	});
	var headers = {
		//'Cache-Control': 'max-age=315360000, no-transform, public'
	};
	gulp.src('./dist/release/*')
		.pipe(rename(function (path) {
			path.dirname += '/game-client-mockup';
			// path.basename += '-s3';
		}))
		.pipe(awspublish.gzip({ ext: '.gz' }))
		.pipe(publisher.publish(headers))
		.pipe(publisher.sync())
		.pipe(awspublish.reporter());
});





// ■＿＿■＿■■■＿■＿＿＿■＿■＿＿＿＿
// ■＿＿■＿＿■＿＿■■＿■■＿■＿＿＿＿
// ■■■■＿＿■＿＿■＿■＿■＿■＿＿＿＿
// ■＿＿■＿＿■＿＿■＿＿＿■＿■＿＿＿＿
// ■＿＿■＿＿■＿＿■＿＿＿■＿■■■■＿

gulp.task('html',function(){
	return gulp.src(["src/html/**/*.html"])
		.pipe(plumber())
		.pipe(minifyHTML({conditionals: true}))
		.pipe(gulp.dest("./dist/debug"))

		//本番はいくつか置き換え（ここでやるの正しいのかな……。。）
		.pipe(replace(/styles.min.css/g,'styles.min.css.gz'))
		.pipe(replace(/app.min.js/g,'app.min.js.gz'))
		.pipe(gulp.dest("./dist/release"))
		.pipe(browser.reload({stream:true}))
	;
});





// ＿＿＿■＿＿■■■＿
// ＿＿＿■＿■＿＿＿＿
// ＿＿＿■＿＿■■＿＿
// ■＿＿■＿＿＿＿■＿
// ＿■■＿＿■■■＿＿

//メモ : 通常のJavaScriptをJSXと同居させる方法はトラブったので調査保留。
// React使わないなら、普通にbrowserifyだけ使うコードを検討したほうが早いかも。

gulp.task('js', function(){
	var bundler=browserify('./src/jsx/index.jsx',{debug:true});
	return bundler
		.transform(reactify,{harmony:true}) //あれ？？harmony:trueはどこで？？
		.bundle()
		.pipe(plumber())
		.pipe(source('app.min.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./dist/debug'))
		
		//本番はいくつか置き換え（ここでやるの正しいのかな……。。）
		.pipe(replace(/http:\/\/localhost:8080/g,'https://mytest-20150503-golang.appspot.com/'))
		.pipe(replace(/DEFAULT_TEST_PLAYER_UUID:.*\n/g,'DEFAULT_TEST_PLAYER_UUID:"",'))

		.pipe(uglify())
		.pipe(gulp.dest('./dist/release'))
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
		.pipe(gulp.dest("./dist/debug"))
		.pipe(gulp.dest("./dist/release"))
		.pipe(browser.reload({stream:true}))
	;
});


// ＿■■■＿■■■＿＿■■■＿＿■＿■■■＿■■■■＿
// ■＿＿＿＿■＿＿■＿■＿＿■＿■＿＿■＿＿■＿＿＿＿
// ＿■■＿＿■■■＿＿■■■＿＿■＿＿■＿＿■■■■＿
// ＿＿＿■＿■＿＿＿＿■＿■＿＿■＿＿■＿＿■＿＿＿＿
// ■■■＿＿■＿＿＿＿■＿＿■＿■＿＿■＿＿■■■■＿

//CSSスプライト作成
//参考 : <http://whiskers.nukos.kitchen/2014/12/24/gulp-spritesmith.html>
//インストール : npm install --save-dev spritesmith gulp.spritesmith

//他の参考 :
// - retina対応とか？ : <http://blog.e-riverstyle.com/2014/02/gulpspritesmithcss-spritegulp.html>
// - 読んでない :<http://ichimaruni-design.com/2015/02/csssprite-gulp/>

var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function(){

	var spriteData = gulp.src('src/images/**/*.png')
		.pipe(spritesmith({
			imgName : 'img/sprite.png',
			cssName : 'sprite.css'
			//cssFormat: 'scss', //フォーマット指定もできる。デフォルトはcss
		}))
	;

	spriteData.css
		.pipe(gulp.dest('src/css'));

	spriteData.img
		.pipe(gulp.dest('./dist/debug'))
		.pipe(gulp.dest('./dist/release'))
	;
});



