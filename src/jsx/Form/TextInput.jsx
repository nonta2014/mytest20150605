/*jshint esnext:true */
var Global = require('../Common/Global.jsx');
var React = require('react');
var InputBase = require('./InputBase.jsx');

var TextInput=React.createClass({
	getInitialState(){
		return {
			textValue:this.props.value,
			validationErrors:[]
		};
	},
	changeText(e){
		this.setState({textValue: e.target.value});
	},
	render(){
		// console.log("textinput",this.state.validationErrors.length);
		var body=<input
		type="text"
		name={this.props.name}
		value={this.state.textValue}
		onChange={this.changeText}
		className="form-control"
		/>;
		return <InputBase
		name={Global.uuid()}
		viewName={this.props.viewName}
		body={body}
		description={this.props.description}
		validationErrors={this.state.validationErrors}
		/>;
	}
});

module.exports=TextInput;
