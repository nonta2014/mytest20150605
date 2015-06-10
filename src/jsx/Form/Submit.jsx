/*jshint esnext:true */
var React = require('react');
// var InputBase = require('InputBase');

var Submit=React.createClass({
	render(){
		var body=<input
		type="submit"
		value={this.props.value}
		className="btn btn-primary btn-large"
		/>;
		return <div className="form-group">
		<div className="col-sm-offset5 col-sm-7">
		{body}
		</div>
		</div>;
	}
});

module.exports=Submit;
