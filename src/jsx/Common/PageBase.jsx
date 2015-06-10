/*jshint esnext:true */
var React = require('react');

var PageBase=React.createClass({
	render(){
		var textStyle={"textAlign" : "center"};
		var containerStyle={"textAlign" : "left","margin" : "2em"};
		var rightStyle={"borderLeft" : "1px dotted gray" };
		var modalWaitStyle={"width":"100%"};
		return (
			<div>
			<h1>GAE/g ゲームテンプレート α0002</h1>
			<div style={textStyle}>
			{this.props.header}
			<section className="container" style={containerStyle}>
			<div className="row">
			{this.props.notice}
			<div className="col-sm-3">
			{this.props.left}
			</div>
			<div className="col-sm-9" style={rightStyle}>
			{this.props.right}
			</div>
			</div>
			</section>
			</div>

			</div>
			);
		/*
			bootstrap modalでいつでもローディング表示できるようにしたいんだけど……
			なんかうまくいってないので一旦退避
				<div className="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false">
					<div className="modal-header">
						<h1>Processing...</h1>
					</div>
					<div className="modal-body">
						<div className="progress progress-striped active">
							<div className="bar" style={modalWaitStyle}></div>
						</div>
					</div>
				</div>
				*/
			}

		});

module.exports=PageBase;
