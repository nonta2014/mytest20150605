/*jshint esnext:true */

var Global={
	SERVER_ADDR:"http://localhost:8080",
	DEFAULT_TEST_PLAYER_UUID:"dbeba7b9-3f84-efe3-8d7d-8ef8f327f49d",//テスト用。登録済みUUIDを初期表示に含めてしまう。本番ではカットしたい。
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
