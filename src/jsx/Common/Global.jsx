/*jshint esnext:true */

var Global={
	SERVER_ADDR:"http://localhost:8080",
	DEFAULT_TEST_PLAYER_UUID:"a4f582c3-6b48-7bdd-4d0c-6cca3f9499b2",//テスト用。登録済みUUIDを初期表示に含めてしまう。本番ではカットしたい。
	API_ROOT:"http://localhost:8080/_ah/api",
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
