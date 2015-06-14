/*jshint esnext:true */
var React = require('react');
var Global = require('../Common/Global.jsx');

//フォーム系
var InputBase = require('../Form/InputBase.jsx');
var TextInput = require('../Form/TextInput.jsx');
// var FormText = require('../Form/FormText.jsx');
var MyButton = require('../Form/MyButton.jsx');
var Submit = require('../Form/Submit.jsx');

//モジュール系
var Loader=require('../Module/Loader.jsx');

var ChatList = React.createClass({

	// 自作のチャットAPIをリスト表示するコンポーネントです。

	getInitialState(){
		return {
			chatNowLoading:true,
			messagesIsLoaded:false,
			messages:[],
			messageCount:-1,
			nextCursor:"",
			isFirstPage:true,
		};
	},

	componentDidMount(){
		var _this=this ;
		// console.log("this.props.playerUUID",this.props.playerUUID);
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
		// console.log("request next cursor=",_this.state.nextCursor);
		gapi.client.chatroom.list({'limit':Global.CHAT_PAGING_COUNT,'cursor':_this.state.nextCursor}).execute(function(resp) {
			// console.log("resp",resp);
			var messages=[];
			if(resp.messages===undefined)resp.messages=[];//GAE/g本番ではメッセージがないときはオブジェクト自体もなかったので追加。はて。


			for(var i=0 ; i<resp.messages.length ; i++){
				//TODO - ユーザ名はどうするかな。。player Kindを取得しなおしてmemcacheしておくか、チャットテーブル側にも冗長にもたせておくか。後者がDatastoreっぽいかなぁ。
				messages.push(<li key={Global.uuid()}>viewName : {resp.messages[i].name} / message : {resp.messages[i].message}</li>);
			}

			var callback=function(){
				//setStateした後にやらなきゃいけないのでコールバックに。promiseとかそろそろ見て見なきゃ。。
				// console.log("check",resp.messages.length,Global.CHAT_PAGING_COUNT);
				if(resp.messages.length!=Global.CHAT_PAGING_COUNT){
					_this.refs.toNext.setState({'textValue':"最後です。",'enabled':false});
					_this.setState({'nextCursor':''});
				}else{
					// console.log("resp.nextCursor",resp.nextCursor);
					_this.refs.toNext.setState({'textValue':"次へ",'enabled':true});
					_this.setState({'nextCursor':resp.nextCursor});
				}
				if(_this.state.isFirstPage){
					_this.refs.toFirst.setState({'textValue':"最初のページです。",enabled:false});
				}else{
					_this.refs.toFirst.setState({'textValue':"最初に戻る",enabled:true});
				}
			};

			_this.setState({'messagesIsLoaded':true,'messageCount':resp.allCount,'messages':messages},callback);
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
		_this.setState({'messagesIsLoaded':false,'nextCursor':'','isFirstPage':true},function(){
			//メッセージ追記
			gapi.client.chatroom
				.add({'message':mes,'playerUUID':_this.props.playerUUID,'name':_this.props.playerName})
				.execute(function(resp) {
					setTimeout(function(){
						_this.requestList(_this);
					},Global.API_CALL_WAIT);
				}
			);
		});
	},

	handleReload(e){
		// console.log("テスト");
		var _this=this;
		_this.setState({'messagesIsLoaded':false,'nextCursor':'','isFirstPage':true},function(){
			setTimeout(function(){
				_this.requestList(_this);
			},Global.API_CALL_WAIT);
		});
	},

	handleToFirst(){
		// e.preventDefault();
		var _this=this;
		this.setState({'messagesIsLoaded':false,'nextCursor':'','isFirstPage':true},function(){
			// console.log("handleToFirst",_this.state.nextCursor);
			setTimeout(function(){
				_this.requestList(_this);
			},Global.API_CALL_WAIT);
		});
	},

	handleToNext(){
		// e.preventDefault();
		// console.log("handleToNext",this.state.nextCursor);
		var _this=this;
		this.setState({'messagesIsLoaded':false,'isFirstPage':false},function(){
			setTimeout(function(){
				_this.requestList(_this);
			},Global.API_CALL_WAIT);
		});
	},

	render() {

		var chat=(<div>
			<h2>chat</h2>
			<Loader />
			<p>(チャットAPI読み込み中...)</p>
		</div>);

		if(this.state.messagesIsLoaded){
			chat=(<div>
				<h2>chat</h2>
				<p>ローディング完了！ 件数={this.state.messageCount}</p>
				{this.state.messages}
				<form className="form-horizontal"
				onSubmit={this.handleNewPost}
				>
					<TextInput
					key="message"
					ref="message"
					value="12345"
					viewName="メッセージ"
					/>
					<MyButton
						onClick={this.handleReload}
						value="リロード"
						enabled={true}
					/>
					<MyButton
						onClick={this.handleToFirst}
						ref="toFirst"
						value="最初に戻る"
						enabled={false}
					/>
					<MyButton
						onClick={this.handleToNext}
						ref="toNext"
						value="次へ"
						enabled={true}
					/>
					<Submit
					value="投稿"
					/>
				</form>
			</div>);
			//nextCursor={this.state.nextCursor}

		}else if(!this.state.chatNowLoading){
			chat=(<div><h2>chat</h2><Loader /><p>(本文読み込み中...)</p></div>);
		}

		return (<div className="border1pxgray">{chat}</div>);
	}

});


module.exports=ChatList;
