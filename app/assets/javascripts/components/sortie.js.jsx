/** @jsx React.DOM */

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
          onRect={this.handleRect}>
        {child}
      </Grabbable>;
      return grabbableChild;
    },this);

    if (this.props.overItemPosition !== false) {
      items.splice(this.props.overItemPosition, 0,
        <span style={this.props.placeholderStyle} className="grabbie-placeholder" key={'gap'}></span>
      );
    }
    return this.attachScrollie(items, {
      verticalOffset: 5,
      persistant: false
    });
  }
});
