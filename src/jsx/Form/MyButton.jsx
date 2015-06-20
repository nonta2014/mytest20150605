/*jshint esnext:true */
var React = require('react');
// var InputBase = require('InputBase');

var MyButton=React.createClass({
	propTypes: {
		onClick: React.PropTypes.func.isRequired,
		// enabled: React.PropTypes.bool.isRequired,
	},
	getDefaultProps(){return{
		enabled:true
	};},
	getInitialState(){
		return {
			textValue:this.props.value,
			enabled:this.props.enabled,
		};
	},
	handleOnClick(e){
		this.props.onClick();
	},
	render(){
		var body;
		if(this.state.enabled){
			body=(<a
				onClick={this.handleOnClick}
				className="btn btn-primary btn-large"
			>{this.state.textValue}</a>);
		}else{
			body=(<a
				onClick={this.handleOnClick}
				className="btn btn-primary btn-large disabled"
			>{this.state.textValue}</a>);
		}

		/*
		*/
		// return <p>{body}</p>;
		return <div className="form-group">
			<div className="col-sm-offset5 col-sm-7">
			{body}
			</div>
		</div>;
		
		// return <InputBase
		// key={this.props.key}
		// viewName={this.props.viewName}
		// body={body}
		// description={this.props.description}
		// validationErrors={this.state.validationErrors}
		// />;
	}
});

module.exports=MyButton;
