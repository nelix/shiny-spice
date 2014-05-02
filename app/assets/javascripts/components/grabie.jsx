/** @jsx React.DOM */

var RectMixin = {
  isEventInRect: function(e, rect) {
    return (e.pageX >= rect.left && e.pageX <= rect.right) && (e.pageY >= rect.top && e.pageY <= rect.bottom);
  },

  componentDidUpdate: function() {
    if (this.state.grabieMouse.mouseDown) return;
    this.rect = getBounds(this.getDOMNode());
    this.props.onRect && this.props.onRect(this, this.rect);
  },

  componentDidMount: function() {
    if (this.state.grabieMouse.mouseDown) return;
    this.rect = getBounds(this.getDOMNode());
    this.props.onRect && this.props.onRect(this, this.rect);
  }
};

var Grabber = React.createClass({
  mixins: [LayeredComponentMixin],
  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  renderLayer: function() {
    var style = this.props.styles;
    this.props.children.props.style = this.props.children.props.style || {};
    this.props.children.props.style['width'] = this.props.styles.width;
    return <div style={style} className="grabie-grabbable grabie-grabbing">{React.Children.only(this.props.children)}</div>;
  },

  render: function() {
    return <span style={{display:'none'}}/>
  }
});

var Grabbable = React.createClass({
  mixins: [GrabieMouseMixin, RectMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  grabieMoveStyle: function(style, rect) {
    style = style || {};
    style.position = 'absolute';

    if (this.state.grabieMouse.mouseDown) {
      var x = this.state.grabieMouse.grabX - (this.state.grabieMouse.grabStartX - rect.left);
      var y = this.state.grabieMouse.grabY - (this.state.grabieMouse.grabStartY - rect.top);
      if (transformProperty) {
        style[transformProperty] = translate(x,y);
      } else {
        style.left = x;
        style.top = y;
      }
    }

    return style;
  },

  handleGrabieRelease: function (state) {
    this.props.onDrop && this.props.onDrop(state);
  },

  handleGrabieGrab: function (state) {
    this.props.onGrab && this.props.onGrab(this.props.position, this.otherWidth, this.otherHeight);
  },

  componentDidUpdate: function(){ // TODO part of the rect mixin?
    var el = this.getDOMNode();
    if (el.children.length > 0) {
      this.otherWidth = el.children[0].clientWidth;
      this.otherHeight = el.children[0].clientHeight;
    }
  },

  componentDidMount: function(){
    var el = this.getDOMNode();
    if (el.children.length > 0) {
      this.otherWidth = el.children[0].clientWidth;
      this.otherHeight = el.children[0].clientHeight;
    }
  },

  render: function () {
    if (!this.state.grabieMouse.mouseDown) {
      return this.transferPropsTo(
        <div className="grabie-grabbable">{React.Children.only(this.props.children)}</div>
      );
    } else {
      return <Grabber styles={this.grabieMoveStyle({width: this.otherWidth}, this.rect)}>{React.Children.only(this.props.children)}</Grabber>
    }

  }
});
