/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

var Stackable = React.createClass({

  mixins: [ScrollieMixin],

  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired
  },

  handleRect: function(a,b) {
    this.props.onRect && this.props.onRect(a,b, this.props.key);
  },

  render: function() {
    var items = this.props.children.map(function joinChildWithGrabbable(child, i) {
      var grabbableChild = <Grabbable
          position={i}
          key={child.props.key}
          onGrabieGrab={this.props.onGrabieGrab.bind(null, child.props.key)}
          onGrabieRelease={this.props.onGrabieRelease.bind(null, child.props.key)}
          onGrabieMove={this.props.onGrabieMove.bind(null, child.props.key)}
          onMouseMove={this.props.onGrabieHover.bind(null, child.props.key, i)}
          onRect={this.handleRect}>
        {child}
      </Grabbable>;
      return grabbableChild;
    },this);

    if (this.props.overItemPosition !== false && this.props.dragging) {
      items.splice(this.props.overItemPosition, 0,
        <span style={{height: this.props.placeholderStyle.height}} className="grabie-grabbable grabbie-placeholder" key={'gap'}></span>
      );
    }
    return this.attachScrollie(items, {
      verticalOffset: 5,
      persistant: false
    });
  }
});
