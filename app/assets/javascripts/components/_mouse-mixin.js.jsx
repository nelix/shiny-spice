/** @jsx React.DOM */
function extend(a, b){
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

var GrabieMouseMixin = {
  getInitialState: function () {
    return {
      grabieMouse: {
        mouseDown: false,
        grabX: 0,
        grabY: 0,
        grabStartX: 0,
        grabStartY: 0
      }
    };
  },

  _handleGrabieMouseUp: function (e) {
    if (this.state.grabieMouse.mouseDown) {
      var oldGrabieMouse = this.state.grabieMouse;
      oldGrabieMouse.mouseDown = false;
      this.setState({grabieMouse: oldGrabieMouse});
    }
    this.handleGrabieRelease && this.handleGrabieRelease(this.state.grabieMouse);
    return false;
  },

  _handleGrabieMouseMove: function (e) {

    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.grabX = e.pageX;
    oldGrabieMouse.grabY = e.pageY;
    this.setState({grabieMouse: oldGrabieMouse});

    this.handleGrabieMove  && this.handleGrabieMove(e, this.state.grabieMouse);
    return false;
  },

  _isLeftMouseButton: function(e) {
    var button = e.button;
    return (button && (button !== 0 && button !== 1));
  },

  _handleGrabieMouseDown: function(e) {

    if (this._isLeftMouseButton(e)) {
      return;
    }

    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.mouseDown = true;
    oldGrabieMouse.grabStartX = e.pageX;
    oldGrabieMouse.grabStartY = e.pageY;
    oldGrabieMouse.grabX = e.pageX;
    oldGrabieMouse.grabY = e.pageY;
    this.setState({grabieMouse: oldGrabieMouse});

    this.handleGrabieGrab  && this.handleGrabieGrab(this.state.grabieMouse);
    return false;
  }
}
