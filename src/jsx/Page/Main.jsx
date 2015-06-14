/*jshint esnext:true */
var React = require('react');
var PageBase = require('../Common/PageBase.jsx');
var ChatList = require('../Module/ChatList.jsx');

var SampleLand = require('../Module/Game/SampleLand.jsx');


//メモ：ES6構文に挑戦しようと思ったのだけど、
// http://qiita.com/ringo/items/3d8b693fec7395b913ef
//	にあるようにpropTypes定義が逆にかっこわるくて面倒なことになるので保留。
//class Main extends React.Component {
var Main = React.createClass({

	propTypes:{
		setPage: React.PropTypes.func.isRequired,
	},

	getInitialState(){
		return {
			chatNowLoading:true,
			secondsElapsed: 0,
		};
	},

	tick: function() {
		this.setState({secondsElapsed: this.state.secondsElapsed + 1});
	},

	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},

	handleLogout(e){
		// e.preventDefault();
		// console.log("handleLogout");
		this.props.setPage("login");
	},


	render() {
		// console.log("P_MAIN",this.props.pageData);
		var playerData=this.props.pageData.playerData ;
		var left=(<div>
			<ul className="nav nav-pills nav-stacked">
				<li>
					<a onClick={this.handleLogout}>
						Logout
					</a>
				</li>
				<li className="active">
					<a>
						home
					</a>
				</li>
			</ul>
		</div>);
		var right=(<div>
			<ul>
				<li>
					バージョン : 001(test)
				</li>
				<li>
					プレイヤー名 : {playerData.name}
				</li>
				<li>
					UUID : {playerData.uuid}
				</li>
				<li>
					レベル : {playerData.level}
				</li>
				<li>
					最終ログイン日 : {playerData.lastLoginAt}
				</li>
				<li>
					Seconds Elapsed: {this.state.secondsElapsed}
				</li>
			</ul>

			<SampleLand UUID={playerData.uuid}/>

			<ChatList playerUUID={playerData.uuid} playerName={playerData.name}/>

		</div>);
		// console.log("testreach 001");
		//さて、ここでどうやってUUIDとるかな……？
		return <PageBase
		left={left}
		right={right}
		/>;
	}
});


module.exports=Main;
