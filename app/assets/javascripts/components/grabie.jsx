/** @jsx React.DOM */

var RectMixin = {
  isEventInRect: function(e, rect) {
    return (e.pageX >= rect.left && e.pageX <= rect.right) && (e.pageY >= rect.top && e.pageY <= rect.bottom);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.grabieMouse.mouseDown) return;
    this.setRect() && this.props.onRect && this.props.onRect(this, this.rect);
  },

  componentDidMount: function() {
    if (this.state.grabieMouse.mouseDown) return;
    this.setRect() && this.props.onRect && this.props.onRect(this, this.rect);
  },

  rect: {},

  setRect: function() {
    var el = this.getDOMNode();
    var rect = {};

    if (el.children.length > 0) {
      rect = getBounds(el.children[0])
    } else {
      rect = getBounds(el);
    }

    if ((rect.top !== this.rect.top) || (rect.left !== this.rect.left) || (rect.width !== this.rect.width) || (rect.height !== this.rect.height)) {
      this.rect = rect;
      return true;
    }
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
    this.props.children.props.style.width = this.props.styles.width;
    return <div
        style={{width:'100%', height:'100%', display: 'block', zIndex:100000, left:0, top: 0, right:0, bottom:0, position: 'fixed'}}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
      <div style={style} className="grabie-grabbable grabie-grabbing">{React.Children.only(this.props.children)}</div>
    </div>
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

  grabieMoveStyle: function(rect) {
    var style = {};
    style.position = 'absolute';

    if (this.state.grabieMouse.mouseDown) {
      style.width = rect.width;
      style.height = rect.height;
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
    this.props.onGrabieRelease && this.props.onGrabieRelease(state);
  },

  handleGrabieGrab: function (state) {
    this.props.onGrabieGrab && this.props.onGrabieGrab(this.props.position, this.rect.width, this.rect.height);
  },

  handleGrabieMove: function (e, state) {
    this.props.onGrabieMove && this.props.onGrabieMove(e, state);
  },

  render: function () {

    if (!this.state.grabieMouse.mouseDown) {
      return this.transferPropsTo(
        <div onMouseDown={this._handleGrabieMouseDown} className="grabie-grabbable">{React.Children.only(this.props.children)}</div>
      );
    } else {
      return (
        <Grabber
            rects={this.rects}
            onMouseMove={this._handleGrabieMouseMove}
            onMouseUp={this._handleGrabieMouseUp}
            styles={this.grabieMoveStyle(this.rect)}
          >
          {React.Children.only(this.props.children)}
        </Grabber>
      );
    }

  }
});
