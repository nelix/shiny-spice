/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

var Stackable = React.createClass({

  mixins: [ScrollieMixin],

  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired
  },

  render: function() {
    var items = this.props.children.map(function joinChildWithGrabbable(child, i) {
      var grabbableChild = <Grabbable
          position={i}
          key={child.props.key}
          onGrabieLongGrab={this.props.onGrabieLongGrab.bind(null, child.props.key)}
          onGrabieDragRelease={this.props.onGrabieDragRelease.bind(null, child.props.key)}
          onGrabieRelease={this.props.onGrabieRelease}
          onGrabieMove={this.props.onGrabieMove.bind(null, child.props.key)}
          onMouseMove={this.props.onGrabieHover.bind(null, child.props.key, i)}>
        {child}
      </Grabbable>;
      return grabbableChild;
    },this);

    if (this.props.overItemPosition !== false && this.props.dragging) {
      items.splice(this.props.overItemPosition, 0,
        <span style={{height: this.props.placeholderStyle.height}} className="grabie-grabbable grabbie-placeholder" key={'gap'}></span>
      );
    }

    return this.attachScrollie(
      items,
      {
        verticalOffset: 5,
        persistant: false
      },
      this.props.dragging,
      this.props.autoScrollSpeed
    );
  }
});
