/*jshint esnext:true */
var Global=require('../../Common/Global.jsx');
var React = require('react');
var Loader= require('../Loader.jsx');
var Statuses= require('./SampleLandStatus.jsx');

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
	render(){
		var body;
		if(this.state.initLoading){
			body=<div>初期化中...<Loader /></div>;
		}else if(this.state.updateLoading){
			body=<div>読み込み中...<Loader /></div>;
		}else{
			body=(<div>
				<p>このモジュールでは、某リランド風の「よくあるソシャゲ」の基本機能を提供します。</p>
				<Statuses status={this.state.status} />
			</div>);
		}
		return (<div>
			<h2>SampleLand</h2>
			{body}
		</div>);
	}
});

module.exports=m;
