/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

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

    rect = getBounds(el);

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
    return <div
        style={{cursor: '-webkit-grabbing', zIndex:100000, left:0, top: 0, right:0, bottom:0, position: 'fixed'}}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
      <Sprite style={this.props.style} x={this.props.x} y={this.props.y} className="grabie-grabbable grabie-grabbing">{React.Children.only(this.props.children)}</Sprite>
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
        <Overlay
            style={{width: this.rect.width, height: this.rect.height}}
            x={this.state.grabieMouse.grabX - (this.state.grabieMouse.grabStartX - this.rect.left)}
            y={this.state.grabieMouse.grabY - (this.state.grabieMouse.grabStartY - this.rect.top)}
            className={'grabie-grabbable grabie-grabbing'}
            rects={this.rects}
            onMouseMove={this._handleGrabieMouseMove}
            onMouseUp={this._handleGrabieMouseUp}
          >
          {React.Children.only(this.props.children)}
        </Overlay>
      );
    }

  }
});
