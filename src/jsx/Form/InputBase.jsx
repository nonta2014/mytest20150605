/*jshint esnext:true */
var React = require('react');
var Global = require('../Common/Global.jsx');

//Bootstrap整形フォームの手抜き用
var InputBase=React.createClass({
	render(){
		// console.log("テスト：こっちきた",this.props.validationErrors);
		var description="";
		if(this.props.description!==undefined) description=<p>{this.props.description}</p>;
		var validationErrors="";
		if(this.props.validationErrors.length!==0){
			validationErrors=<ul className="noticeList">{
				this.props.validationErrors.map(function(r){
					//動的子要素はkeyがないと警告が出るので、とりあえずuuid()を流用します。
					return <li key={Global.uuid()}>{r}</li>;
				}
				)}</ul>;
			}
			return (<div className="form-group">
				<label htmlFor="{this.props.key}" className="col-sm-5 control-label">
				{this.props.viewName}
				</label>
				<div className="col-sm-7">
				{this.props.body}
				{description}
				{validationErrors}
				</div>
				</div>);
		}
	});

module.exports=InputBase;
