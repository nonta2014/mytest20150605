/*jshint esnext:true */
var React = require('react');
// var InputBase = require('InputBase');

var FormText=React.createClass({
	render(){
		return <div className="form-group">
		<label className="col-sm-5 control-label">
		{this.props.viewName}
		</label>
		<div className="col-sm-7">
		<p>{this.props.text}</p>
		</div>
		</div>;
	}
});

module.exports=FormText;
