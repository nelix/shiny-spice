/** @jsx React.DOM */

var TestBox = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <div className="testbox">{this.props.text}</div>
    );
  }
});
