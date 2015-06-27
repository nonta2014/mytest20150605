/*jshint esnext:true */
var React = require('react');
var Global=require('../../Common/Global.jsx');
var Loader= require('../Loader.jsx');
var SampleLandStatus= require('./SampleLandStatus.jsx');
var MyButton = require('../../Form/MyButton.jsx');


var SampleLandExploreResult=React.createClass({
	//このコンポーネントは、「探検」の結果出力に専念します。
	//探検結果に応じたボタンの切り替えなどは親に任せています。
	propTypes:{
	},
	getInitialState(){
		return {};
	},
	componentDidMount(){
	},
	render(){
		var body;
		if(!this.props.exploreResult){
			body="さあ、探検しましょう！";
		}else{
			var e=this.props.exploreResult;
			body="探検中";
			switch(e.ResultType){

				case "ExploreResultStaminaShort" :
					body=<div>スタミナが足りません。。</div>;
					break ;

				case "ExploreResultCoinGet" :
					body=<div>コイン{e.Coin}枚ゲット！</div>;
					break ;
				case "ExploreResultBattle" :
					//TODO - APIresultに画像名を含めなきゃ。。
					var imageName="icon-"+e.EnemyImageName;
					body=<div>
						<img className={imageName} />
						<p>「{e.EnemyName}」が現れた！</p>
					</div>;
					break ;
				case "ExploreResultBattle_Local_Win" :
					body=<div>
						<p>勝利！ 経験値{e.Experience}を獲得！</p>
					</div>;
					break ;
			}
			console.log(this.props.exploreResult);
		}
		return <div>
			<h4>探検結果出力モジュール</h4>
			<p>{body}</p>
		</div>;
	}
});


var SampleLand=React.createClass({
	propTypes:{
		//setPage: React.PropTypes.func.isRequired
		UUID: React.PropTypes.string.isRequired
	},
	getInitialState(){
		return {
			initLoading:true,
			updateLoading:true,
			status:null,
			settings:null,
			exploreResult:null,
		};
	},
	componentDidMount(){
		var _this=this ;
		// console.log("this.props.playerUUID",this.props.playerUUID);
		gapi.client.load('sampleland', 'v1', function() {
			gapi.client.sampleland.ping().execute(function(resp) {
				_this.setState({'initLoading':false});
				gapi.client.sampleland.player({uuid:_this.props.UUID}).execute(function(resp) {
					// console.log("sampleland player API取得完了",resp);
					_this.setState({'updateLoading':false,'status':resp.PlayerData,'settings':resp.Settings});
				});
			});
		}, Global.API_ROOT);
	},

	nop(){//なんかテストで使った。なんだっけw
	},

	updateSub(_this,playerData){
		_this.setState({'updateLoading':false,'status':playerData});
		_this.refs.statuses.setState({'status':playerData});
	},

	debug_StaminaDown(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_decrementStamina({uuid:_this.props.UUID}).execute(function(resp) {
			_this.updateSub(_this,resp);
		});
	},
	debug_StaminaUp(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_incrementStamina({uuid:_this.props.UUID}).execute(function(resp) {
			_this.updateSub(_this,resp);
		});
	},
	debug_StaminaReset(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_resetStamina({uuid:_this.props.UUID}).execute(function(resp) {
			_this.updateSub(_this,resp);
		});
	},
	explore(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.explore({uuid:_this.props.UUID}).execute(function(resp) {
			console.log("sampleland explore API取得完了",resp);
			//探検結果をsetState
			_this.setState({
				'updateLoading':false,
				'status':resp.PlayerData,
				'exploreResult':resp.ExploreResult,
			});
			_this.refs.statuses.setState({'status':resp.PlayerData});
		});
	},

	render(){
		var body;
		var command;

		var debugButtons=<div>
			<hr />
			<MyButton
				onClick={this.debug_StaminaDown}
				ref="debug_StaminaDown"
				value="デバッグ：スタミナ減らす"
			/>
			<MyButton
				onClick={this.debug_StaminaUp}
				ref="debug_StaminaUp"
				value="デバッグ：スタミナ増やす"
			/>
			<MyButton
				onClick={this.debug_StaminaReset}
				ref="debug_StaminaUp"
				value="デバッグ：スタミナ全回復"
			/>
		</div>;

		var defaultCommand=<div>
			<h3>コマンド</h3>
			<form className="form-horizontal">
				<MyButton
					onClick={this.explore}
					ref="explore"
					value="探検する"
				/>
				{debugButtons}
			</form>
		</div>;

		//状況に応じたコマンドボタンを生成
		if(this.state.exploreResult===null){
			//初期状態
			command=defaultCommand;
		}else{
			switch(this.state.exploreResult.ResultType){

				case "ExploreResultStaminaShort" :
				case "ExploreResultCoinGet" :
					command=defaultCommand;
					break ;

				case "ExploreResultBattle" :
					_this=this;
					command=<div>
						<MyButton
							onClick={function(){
								var s=_this.state.exploreResult;
								s.ResultType="ExploreResultBattle_Local_Win";
								_this.setState({"exploreResult":s});
							}}
							ref="explore"
							value="たたかう"
						/>
						{debugButtons}
					</div>;
					break ;

				case "ExploreResultBattle_Local_Win" :
					command=defaultCommand;
					break ;


				default : command=<div>
					エラー : 想定外のResultTypeです。{this.state.exploreResult.ResultType}
					{defaultCommand}
				</div>;
			}
		}
		

		if(this.state.initLoading){
			body=<div>初期化中...<Loader /></div>;
		}else if(this.state.updateLoading){
			body=<div>読み込み中...<Loader /></div>;
		}else{
			body=(<div>
				<p>このモジュールでは、「以前よくあったカードバトル型ソシャゲ」的な機能を提供します。</p>

				<table><tr><td>
					<SampleLandStatus
						UUID={this.props.UUID}
						ref="statuses"
						status={this.state.status}
						settings={this.state.settings}
					/>
				</td><td>
					<SampleLandExploreResult
						exploreResult={this.state.exploreResult}
					/>
				</td></tr></table>

				{command}

			</div>);
		}
		return (<div>
			<h2>SampleLand</h2>
			{body}
		</div>);
	}
});

module.exports=SampleLand;
