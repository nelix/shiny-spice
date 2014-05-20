/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

var RectMixin = {
  // this is what checks is the mouse in position from boardie.js
  getRect: function() {
    var el = this.getDOMNode();
    var rect = {};

    return getBounds(el);

  }

};

var Grabbable = React.createClass({
  mixins: [GrabieMouseMixin, RectMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  handleGrabieRelease: function(state) {
    $(document).unbind("mousemove", this._handleGrabieMouseMove);
    this.props.onGrabieRelease && this.props.onGrabieRelease(state);
  },

  handleGrabieDragRelease: function (state) {
    this.props.onGrabieDragRelease && this.props.onGrabieDragRelease(state);
  },

  handleGrabieLongGrab: function (state) {
    this.r = this.getRect();
    this.props.onGrabieLongGrab && this.props.onGrabieLongGrab(this.props.position, this.r.width, this.r.height);
    $(document).on("mousemove", this._handleGrabieMouseMove); // Because we removed it from the overlay...
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
      var r = this.getRect();
      return (

        <Overlay
            style={{width: this.r.width, height: this.r.height, pointerEvents: 'none'}}
            x={this.state.grabieMouse.grabX - (this.state.grabieMouse.grabStartX - this.r.left)}
            y={this.state.grabieMouse.grabY - (this.state.grabieMouse.grabStartY - this.r.top)}
            v={this.v}
            className={'grabie-grabbable grabie-grabbing'}
            onMouseMove={this._handleGrabieMouseMove}
            onMouseUp={this._handleGrabieMouseUp}
            wrapperStyle={{pointerEvents: 'none'}}
          >
          {React.Children.only(this.props.children)}
        </Overlay>
      );
    }

  }
});
