/*jshint esnext:true */
var React = require('react');
// var InputBase = require('InputBase');

var Button=React.createClass({
	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},
	handleOnClick(e){
		this.props.onClick();
	},
	render(){
		var body=<input
		type="button"
		value={this.props.value}
		onClick={this.handleOnClick}
		/>;
		/*
		className="btn btn-primary btn-large"
		*/
		return <p>{body}</p>;
		// return <div className="form-group">
		// <div className="col-sm-offset5 col-sm-7">
		// {body}
		// </div>
		// </div>;
	}
});

module.exports=Button;
