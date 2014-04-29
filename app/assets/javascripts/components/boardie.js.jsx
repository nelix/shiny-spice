/** @jsx React.DOM */

var Boardie = React.createClass({

  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired
  },

  render: function() {
    
    return <div className="sortie">{items}</div>;
  }
});
