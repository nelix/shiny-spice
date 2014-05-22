/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

var Grabbable = React.createClass({
  mixins: [GrabieMouseMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  handleGrabieRelease: function(state) {
    document.removeEventListener('mousemove', this._handleGrabieMouseMove);
    this.props.onGrabieRelease && this.props.onGrabieRelease(state);
  },

  handleGrabieDragRelease: function (state) {
    this.props.onGrabieDragRelease && this.props.onGrabieDragRelease(state);
  },

  handleGrabieLongGrab: function (state) {
    this.boundingRect = getBounds(this.getDOMNode());
    this.props.onGrabieLongGrab && this.props.onGrabieLongGrab(this.props.position, this.boundingRect.width, this.boundingRect.height);
    document.addEventListener('mousemove', this._handleGrabieMouseMove); // Because we removed it from the overlay...
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
            style={{width: this.boundingRect.width, height: this.boundingRect.height, pointerEvents: 'none'}}
            x={this.state.grabieMouse.grabX - (this.state.grabieMouse.grabStartX - this.boundingRect.left)}
            y={this.state.grabieMouse.grabY - (this.state.grabieMouse.grabStartY - this.boundingRect.top)}
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
