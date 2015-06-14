/*jshint esnext:true */
var React = require('react');

//MITのCSSローダを表示します。
//	41kbで表現力もなかなか多彩なので採用しました。
//	紹介 : <http://www.moongift.jp/2015/04/loaders-css-スタイルシートだけで作られたローディング/>
// - 以下からloaders.cssを取得して、css/に配置しておいてください。
//	<https://github.com/ConnorAtherton/loaders.css>

var Loader=React.createClass({
	getInitialState(){
		return {
			enable:true,
		};
	},
	render(){
		if(this.state.enable){
			return <div className="loader-inner ball-pulse">
				<div></div>
				<div></div>
				<div></div>
			</div>;
		}else{
			return (<span></span>);
		}
	}
});

module.exports=Loader;
