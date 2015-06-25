/*jshint esnext:true */
var React = require('react');
var Global=require('../../Common/Global.jsx');
var Loader= require('../Loader.jsx');
var SampleLandStatus= require('./SampleLandStatus.jsx');
var MyButton = require('../../Form/MyButton.jsx');

var m=React.createClass({
	propTypes:{
		//setPage: React.PropTypes.func.isRequired
		UUID: React.PropTypes.string.isRequired
	},
	getInitialState(){
		return {
			initLoading:true,
			updateLoading:true,
			status:null,
		};
	},
	componentDidMount(){
		var _this=this ;
		// console.log("this.props.playerUUID",this.props.playerUUID);
		gapi.client.load('sampleland', 'v1', function() {
			gapi.client.sampleland.ping().execute(function(resp) {
				_this.setState({'initLoading':false});
				gapi.client.sampleland.player({uuid:_this.props.UUID}).execute(function(resp) {
					console.log("sampleland player get finish.",resp);
					_this.setState({'updateLoading':false,'status':resp});
				});
			});
		}, Global.API_ROOT);
	},
	nop(){
	},

	debug_StaminaDown(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_decrementStamina({uuid:_this.props.UUID}).execute(function(resp) {
			console.log("sampleland dev_decrementStamina get finish.",resp);
			_this.setState({'updateLoading':false,'status':resp});
			_this.refs.statuses.setState({'status':resp});
		});
	},
	debug_StaminaUp(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_incrementStamina({uuid:_this.props.UUID}).execute(function(resp) {
			console.log("sampleland dev_incrementStamina get finish.",resp);
			_this.setState({'updateLoading':false,'status':resp});
			_this.refs.statuses.setState({'status':resp});
		});
	},
	debug_StaminaReset(){
		var _this=this ;
		_this.setState({'updateLoading':true});
		gapi.client.sampleland.dev_resetStamina({uuid:_this.props.UUID}).execute(function(resp) {
			console.log("sampleland dev_resetStamina get finish.",resp);
			_this.setState({'updateLoading':false,'status':resp});
			_this.refs.statuses.setState({'status':resp});
		});
	},

	render(){
		var body;
		if(this.state.initLoading){
			body=<div>初期化中...<Loader /></div>;
		}else if(this.state.updateLoading){
			body=<div>読み込み中...<Loader /></div>;
		}else{
			body=(<div>
				<p>このモジュールでは、「以前よくあったカードバトル型ソシャゲ」的な機能を提供します。</p>
				<SampleLandStatus
					UUID={this.props.UUID}
					ref="statuses"
					status={this.state.status}
				/>
				<form className="form-horizontal">
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
				</form>
			</div>);
		}
		return (<div>
			<h2>SampleLand</h2>
			{body}
		</div>);
	}
});

module.exports=m;
