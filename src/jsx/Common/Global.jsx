/*jshint esnext:true */

var Global={
	
	//メモ：サーバアドレスはgulp側でdeploy時にlocalhostを本番URLに置き換えていますが、
	//	テスト中に手作業で本番に向けてもコメントアウト側が置き換えられるだけなので正常に動作します。

	// SERVER_ADDR:"https://mytest-20150503-golang.appspot.com",
	SERVER_ADDR:"http://localhost:8080",
	// API_ROOT:"https://mytest-20150503-golang.appspot.com/_ah/api", //本番に向ける
	API_ROOT:"http://localhost:8080/_ah/api", //ローカルに向ける

	DEFAULT_TEST_PLAYER_UUID:"6aa1d732-8231-b42e-0661-cfc745d24f5b",//テスト用。登録済みUUIDを初期表示に含めてしまう。本番ではgulpで空文字に置き換え。

	API_CALL_WAIT:100,//通信ウェイト
	CHAT_PAGING_COUNT:10,//チャットのページング数（※サーバ側リミットと合わせたい。。）

	g(id){
		return document.getElementById(id);
	},

	uuid(){ //元はguid()。
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
	}
};

module.exports=Global;
