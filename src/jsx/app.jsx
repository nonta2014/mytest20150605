/*jshint esnext:true */
var React = require('react');

//全体系
var Global = require('./Common/Global.jsx');
var PageBase = require('./Common/PageBase.jsx');

//ページ別
var Main = require('./Page/Main.jsx');
var Login = require('./Page/Login.jsx');


/*
アプリの初期化と画面遷移のコントローラ処理を行っています。
*/


var PreLogin = React.createClass({
	render(){
		return <PageBase
		left=""
		right="now loading..."
		/>;
	}
});


var NonchangGameServerInitError=React.createClass({
	render(){
		var r=<div>
		<h2>ERROR!!</h2>
		<ul>
		<li>Nonchang Game Serverの初期pingに失敗しました。
		</li>
		<li>URL設定、外部ライブラリのサーバ不良や移転、ネットワーク不良などが考えられます。
		</li>
		</ul>
		</div>;
		return <PageBase
		left=""
		right={r}
		/>;
	}
});

var GoogleAPIInitError=React.createClass({
	render(){
		var r=<div>
		<h2>ERROR!!</h2>
		<ul>
		<li>google APIクライアント初期化に失敗しました。
		</li>
		<li>URL設定、外部ライブラリのサーバ不良や移転、ネットワーク不良などが考えられます。
		</li>
		</ul>
		</div>;
		return <PageBase
		left=""
		right={r}
		/>;
	}
});




var App = React.createClass({
	getInitialState(){
		return {
			pageName: 'pre-login',
			// uuid:false,
			pageData:false
		};
	},
	componentDidMount(){
		// console.log("app componentDidMount() start.");
		var _this=this ;
		var failed= false ;

		// try{
			window.onGoogleClientLoaded=function(){
				// console.log("404チェック1");
				// メモ：サーバ起動してないときのエラーハンドリングはできなさげ……？
				gapi.client.load('account', 'v1', function() {
					// console.log("server ping start");
					gapi.client.account.ping().execute(function(resp) {
						// console.log("server ping finish.",resp);
						$("#pleaseWaitDialog").hide();
						if(resp!==undefined && resp.success!==undefined && resp.success===true){
							_this.setState({'pageName':'login'});
						}else{
							_this.setState({'pageName':'ngs_ping_error'});
						}
					});
				}, Global.API_ROOT);
			};
		// }catch(e){
		// 	console.log("こっちきた",e);
		// }

		// try{
			$.ajax({
				url: "https://apis.google.com/js/client.js?onload=onGoogleClientLoaded",
				dataType: "script",
				success: function () {
					// console.log("GP load successful");
					// SetKeyCheckAuthority();
				},
				error: function () {
					// console.log("GP load failed");
					_this.setState({'pageName':'gapi_init_error'});
					$("#pleaseWaitDialog").hide();
					failed=true ;
				},
				complete: function () {
					if(!failed){ //メモ：error時もcompleteはするので注意。
						// console.log("GP load complete");
					}
				}
			});
		// }catch(e){
		// 	console.log("こっちきた",e);
		// }
	},
	setPage(pageName,pageData){
		//console.log(name);
		if(pageData===undefined) pageData=false;
		this.setState({'pageName':pageName,'pageData':pageData});
	},
	render(){
		// console.log("app render() start.");
		var page ;
		switch(this.state.pageName){
			case "gapi_init_error" : page=<GoogleAPIInitError /> ; break ;
			case "ngs_ping_error" : page=<NonchangGameServerInitError /> ; break ;
			case "login" : page=<Login setPage={this.setPage}/> ; break ;
			case "main" : page=<Main
					pageData={this.state.pageData}
					setPage={this.setPage}
				/> ; break ;
			case "settings" : page=<Settings /> ; break ;
			default : page=<PreLogin /> ; break ;
		}
		return <div id="app">{page}</div>;
	}
});


module.exports=App;
