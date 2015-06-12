/*jshint esnext:true */
var React = require('react');
// var ChatList = require('../ChatList.jsx');
var Global = require('../Common/Global.jsx');
var PageBase = require('../Common/PageBase.jsx');

//フォーム系
var InputBase = require('../Form/InputBase.jsx');
var TextInput = require('../Form/TextInput.jsx');
var FormText = require('../Form/FormText.jsx');
var Submit = require('../Form/Submit.jsx');

var Login = React.createClass({

	propTypes: {
		setPage: React.PropTypes.func.isRequired
	},

	handleNewUser(e){
		e.preventDefault();
		// console.log("a");
		// $("#pleaseWaitDialog").modal('show');
		var validationErrors=[];
		if(this.refs.name.state===undefined || this.refs.name.state.textValue===undefined || this.refs.name.state.textValue.length===0){
			validationErrors.push("お名前が入力されていません。");
			// console.log("validation error pushed.");
		}else if(this.refs.name.state.textValue.length<3 ){
			validationErrors.push("お名前が短すぎます。3文字以上10文字未満で入力してください。");
			// console.log("validation error pushed.",this.refs.name.state.textValue.length);
		}else if(this.refs.name.state.textValue.length>=10){
			validationErrors.push("お名前が長すぎます。3文字以上10文字未満で入力してください。");
			// console.log("validation error pushed.",this.refs.name.state.textValue.length);
		}
		//
		if(validationErrors.length!==0){
			this.refs.name.setState({validationErrors:validationErrors});
		}else{
			this.refs.name.setState({validationErrors:[]});
			// console.log(this.refs.name.state.textValue,this.refs.newUserUuid.props.text);
			//ここで新規登録＋ログイン実行！
			var _this=this ;
			gapi.client.account.signup({
				// "createdAt" : new Date(),
				// "lastLoginAt" : new Date(),
				"uuid" : this.refs.newUserUuid.props.text,
				"name" : this.refs.name.state.textValue
			}).execute(function(r){
				if(r.result.success===true){
					// console.log("success!",r);
					_this.props.setPage("main",{"playerData":r.result});
				}else{
					//TODO - ここではエラーを表示したい。エラーフォームの更新かな？
					// console.log("fail...",r);
					alert("新規登録時にサーバエラーが発生しました。。"); //とりあえず手抜き
				}
			});
		}
		return ;
	},

	handleLogin(e){
		e.preventDefault();
		var validationErrors=[];
		if(this.refs.loginUuid.state===undefined || this.refs.loginUuid.state.textValue===undefined || this.refs.loginUuid.state.textValue.length===0){
			validationErrors.push("UUIDが入力されていません。");
			console.log("validation error pushed.");
		}else if(this.refs.loginUuid.state.textValue.length!=36 ){
			validationErrors.push("UUIDの長さが不正です。");
			console.log("validation error pushed.");
		}
		if(validationErrors.length!==0){
			this.refs.loginUuid.setState({validationErrors:validationErrors});
		}else{
			this.refs.loginUuid.setState({validationErrors:[]});
			var _this=this ;
			gapi.client.account.login(
				{'uuid':this.refs.loginUuid.state.textValue}
			).execute(function(r){
				// console.log("login after : ",r);
				if(r.code!==undefined && r.code==400){
					//datastore: no such entity
					// console.log("ユーザないよー");
					_this.refs.loginUuid.setState({validationErrors:["ユーザが見つかりません。(400)"]});
				}else{
					// console.log("ユーザないよー（400以外）")
					if(r.result.success===true){
						_this.props.setPage("main",{"playerData":r.result});
					}else{
						// _this.refs.loginUuid.setState({validationErrors:["ユーザが見つかりません。"]});
					}
				}
			});
			// console.log("TODO",this.refs.loginUuid.state.textValue);
		}
		// console.log("b");
		return ;
	},

	render(){
		var left=(
			<div>
			<h2>説明</h2>
			<p><span styleName="colorred">ログイン</span>または<span styleName="colorred">自動生成されたuuidで新規登録</span>してください。</p>
			<h2>追加情報</h2>
			<p>現在接続中のサーバ : <span id="serveraddr">{Global.SERVER_ADDR}</span></p>
			</div>
			);
		var newUserUuid=Global.uuid();
		var right=(
			<div>
			<h2>新規登録</h2>

			<form className="form-horizontal"
			onSubmit={this.handleNewUser}
			>
			<TextInput
			key="name"
			ref="name"
			value="12345"
			viewName="名前"
			description="※お名前は後から変更できません。"
			/>
			<FormText
			viewName="生成されたUUID"
			ref="newUserUuid"
			text={newUserUuid}
			/>
			<Submit
			value="新規登録"
			/>
			</form>

			<br clear="both" />

			<h2>既存ユーザでログイン</h2>

			<form className="form-horizontal"
			onSubmit={this.handleLogin}
			>
			<TextInput
			key="uuid"
			ref="loginUuid"
			value={Global.DEFAULT_TEST_PLAYER_UUID}
			viewName="UUID"
			description="登録時のUUIDを入力してください。"
			/>
			<Submit
			value="ログイン"
			/>
			</form>

			</div>
			);
		/*
		<p>サーバ応答 : <span id="serverresponce">(waiting)</span></p>

		<button id="addUserTest">addUserテスト</button>
		<button id="getPosList">getPosList</button>
		<button id="getCount">getCount</button>
		*/
		return <PageBase
		left={left}
		right={right}
		/>;
	},
});


module.exports=Login;
