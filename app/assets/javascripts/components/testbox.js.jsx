/** @jsx React.DOM */

var TestBox = React.createClass({

  randomColor: Math.floor(Math.random()*16777215).toString(16),

  render: function () {
    this.color = this.color || Math.floor(Math.random()*16777215).toString(16);
    return this.transferPropsTo(
      <div style={{background: '#'+this.color}} className="testbox">{this.props.text}<br/>{this.props.key}</div>
    );
  }
});
