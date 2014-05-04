/** @jsx React.DOM */

var UpdateLock = React.createClass({

  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    return this.transferPropsTo(<div>this.props.children</div>);
  }
});
