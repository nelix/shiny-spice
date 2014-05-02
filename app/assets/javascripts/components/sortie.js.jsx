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
          onGrab={this.props.onGrab.bind(null, child.props.key)}
          onDrop={this.props.onDrop.bind(null, child.props.key)}
          onRect={this.handleRect}
          onClick={this.handleClick}>
        {child}
      </Grabbable>;
      return grabbableChild;
    },this);

    if (this.props.overItemPosition !== false) {
      items.splice(this.props.overItemPosition, 0,
        <span style={this.props.placeholderStyle} className="grabbie-placeholder" key={'gap'}></span>
      );
    }

    return this.attachScrollie(<div className="sortie-column">{items}</div>, {
      verticalOffset: 5,
      persistant: false
    });
  }
});
