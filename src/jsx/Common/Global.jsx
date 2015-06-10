/*jshint esnext:true */

var Global={
	SERVER_ADDR:"http://localhost:8080",
	DEFAULT_TEST_PLAYER_UUID:"cf086035-c4dd-b22a-88ae-e2b4514d3de7",
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
