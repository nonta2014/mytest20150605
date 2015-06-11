/*jshint esnext:true */
var React = require('react');
var Global = require('../Common/Global.jsx');

//フォーム系
var InputBase = require('../Form/InputBase.jsx');
var TextInput = require('../Form/TextInput.jsx');
// var FormText = require('../Form/FormText.jsx');
var Button = require('../Form/Button.jsx');
var Submit = require('../Form/Submit.jsx');

//モジュール系
var Loader=require('../Module/Loader.jsx')

var ChatList = React.createClass({

	// 自作のチャットAPIをリスト表示するコンポーネントです。

	getInitialState(){
		return {
			chatNowLoading:true,
			messagesIsLoaded:false,
			messages:[],
			messageCount:-1,
		};
	},

	componentDidMount(){
		var _this=this ;
		console.log("this.props.playerUUID",this.props.playerUUID);
		gapi.client.load('chatroom', 'v1', function() {
			gapi.client.chatroom.ping().execute(function(resp) {
				// console.log("chatroom ping finish.",resp);
				_this.setState({'chatNowLoading':false});
				//TODO - チャットルーム本文読み込み
				// console.log(gapi.client.chatroom);
				_this.requestList(_this);
			});
		}, Global.API_ROOT);
	},

	requestList(_this){
		gapi.client.chatroom.list({'limit':10}).execute(function(resp) {
			var messages=[];
			for(var i=0 ; i<resp.messages.length ; i++){
				//TODO - ユーザ名はどうするかな。。player Kindを取得しなおしてmemcacheしておくか、チャットテーブル側にも冗長にもたせておくか。後者がDatastoreっぽいかなぁ。
				messages.push(<li key={Global.uuid()}>UUID : {resp.messages[i].playerUUID} / message : {resp.messages[i].message}</li>);
			}
			_this.setState({'messagesIsLoaded':true,'messageCount':resp.allCount,'messages':messages});
			// console.log("messagesIsLoaded. list result",resp);
		});
	},

	handleNewPost(e){
		e.preventDefault();
		//TODO - validation
		var validationErrors=[];
		var mes=this.refs.message.state.textValue;
		// console.log("メッセージ投稿がクリックされました。mes="+mes);
		//TODO
		var _this=this ;
		//まずローディングに戻す
		_this.setState({'messagesIsLoaded':false});
		//メッセージ追記
		gapi.client.chatroom
			.add({'message':mes,'playerUUID':_this.props.playerUUID})
			.execute(function(resp) {
				_this.requestList(_this);
			}
		);
	},

	handleReload(e){
		// console.log("テスト");
		var _this=this;
		_this.setState({'messagesIsLoaded':false});
		setTimeout(function(){
			_this.requestList(_this);
		},1000);
	},

	render() {
		var newPost=(<div>
			<form className="form-horizontal"
			onSubmit={this.handleNewPost}
			>
			<TextInput
			key="message"
			ref="message"
			value="12345"
			viewName="メッセージ"
			/>
			<Button
				onClick={this.handleReload}
				value="リロード"
			/>
			<Submit
			value="投稿"
			/>
			</form>
		</div>);
		var chat=(<div><h2>chat</h2>
			<Loader />
			<p>(チャットAPI読み込み中...)</p></div>);
		if(this.state.messagesIsLoaded){
			chat=(<div>
				<h2>chat</h2>
				<p>ローディング完了！ 件数={this.state.messageCount}</p>
				{this.state.messages}
				{newPost}
			</div>);
		}else if(!this.state.chatNowLoading){
			chat=(<div><h2>chat</h2><Loader /><p>(本文読み込み中...)</p></div>);
		}

		return (<div className="border1pxgray">{chat}</div>);
	}

});


module.exports=ChatList;
