/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

var RectMixin = {
  // this is what checks is the mouse in position from boardie.js
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

var Grabbable = React.createClass({
  mixins: [GrabieMouseMixin, RectMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  handleGrabieDragRelease: function (state) {
    $(document).unbind("mousemove", this._handleGrabieMouseMove);
    this.props.onGrabieDragRelease && this.props.onGrabieDragRelease(state);
  },

  handleGrabieLongGrab: function (state) {
    this.props.onGrabieLongGrab && this.props.onGrabieLongGrab(this.props.position, this.rect.width, this.rect.height);
    $(document).bind("mousemove", this._handleGrabieMouseMove); // Because we removed it from the overlay...
  },

  handleGrabieMove: function (e, state, v) {
    this.v = v;
    this.props.onGrabieMove && this.props.onGrabieMove(e, state);
  },

  render: function () {
    if (!this.state.grabieMouse.mouseLongDown) {
      return this.transferPropsTo(
        <div onMouseDown={this._handleGrabieMouseDown} className="grabie-grabbable">{React.Children.only(this.props.children)}</div>
      );
    } else {
      return (
        <Overlay
            style={{width: this.rect.width, height: this.rect.height, pointerEvents: 'none'}}
            x={this.state.grabieMouse.grabX - (this.state.grabieMouse.grabStartX - this.rect.left)}
            y={this.state.grabieMouse.grabY - (this.state.grabieMouse.grabStartY - this.rect.top)}
            v={this.v}
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
