/** @jsx React.DOM */

var Overlay = React.createClass({
  mixins: [LayeredComponentMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  renderLayer: function() {

    var sprite = null;

    if (this.props.children) {
      sprite = <Sprite style={this.props.style} x={this.props.x} y={this.props.y} className="grabie-grabbable grabie-grabbing">{React.Children.only(this.props.children)}</Sprite>;
    }

    return (
      <div
        style={{cursor: '-webkit-grabbing', zIndex:100000, left:0, top: 0, right:0, bottom:0, position: 'fixed'}}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}
      >{sprite}</div>
    );
  },

  render: function() { // TODO: shrug
    return <span style={{display:'none'}}/>
  }
});