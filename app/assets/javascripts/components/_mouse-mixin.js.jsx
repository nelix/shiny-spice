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

  setGrabieState: function(state) {
    var oldGrabieMouse = this.state.grabieMouse;
    return this.setState({grabieMouse: extend(oldGrabieMouse, state)});
  },

  _handleGrabieMouseUp: function (e) {
    this.state.grabieMouse.mouseDown && this.setGrabieState({mouseDown: false});
    this.handleGrabieRelease && this.handleGrabieRelease(this.state.grabieMouse);
  },

  _handleGrabieMouseMove: function (e) {
    if (this.state.grabieMouse.mouseDown) {

      var x = e.pageX;
      var y = e.pageY;

      this.setGrabieState({
        grabX: x,
        grabY: y
      });

      this.handleGrabieMove  && this.handleGrabieMove(e, this.state.grabieMouse);
    }

    e.preventDefault();
    e.stopPropagation();
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

    this.setGrabieState({
      mouseDown: true,
      grabStartX: e.pageX,
      grabStartY: e.pageY,
      grabX: e.pageX,
      grabY: e.pageY
    });

    this.handleGrabieGrab  && this.handleGrabieGrab(this.state.grabieMouse);

    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
