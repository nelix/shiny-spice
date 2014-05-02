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

  componentDidMount: function() {
    this.getDOMNode().addEventListener('mousedown', this._handleGrabieMouseDown);
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('mousedown', this._handleGrabieMouseDown);
  },

  setGrabieState: function(state) {
    var oldGrabieMouse = this.state.grabieMouse;

    return this.setState({grabieMouse: extend(oldGrabieMouse, state)});
  },

  _handleGrabieMouseUp: function (e) {
    window.removeEventListener('mouseup', this._handleGrabieMouseUp);
    window.removeEventListener('mousemove', this._handleGrabieMouseMove);

    this.state.grabieMouse && this.setGrabieState({mouseDown: false});

    if (this.mightClick) {
      this.grabieMightClick = false;
    } else {
      this.handleGrabieRelease && this.handleGrabieRelease(this.state.grabieMouse);
    }
  },

  _handleGrabieMouseMove: function (e) {
    if (!this.grabieMightClick && this.state.grabieMouse.mouseDown) {
      this.setGrabieState({
        grabX: e.pageX,
        grabY: e.pageY
      });
      this.handleGrabieMove  && this.handleGrabieMove(this.state.grabieMouse);
    }
  },

  _isLeftMouseButton: function(e) {
    var button = e.button;
    return (button && (button !== 0 && button !== 1));
  },

  _handleGrabieMouseDown: function(e) {
    if (this._isLeftMouseButton(e)) {
      return;
    }

    window.addEventListener('mouseup', this._handleGrabieMouseUp);

    this.grabieMightClick = true;
    setTimeout(
      function() {
        if (this.grabieMightClick) {
          this.grabieMightClick = false;
          window.addEventListener('mousemove', this._handleGrabieMouseMove);

          this.setGrabieState({
            mouseDown: true,
            grabStartX: e.pageX,
            grabStartY: e.pageY,
            grabX: e.pageX,
            grabY: e.pageY
          });

          this.handleGrabieGrab  && this.handleGrabieGrab(this.state.grabieMouse);
        }
      }.bind(this), 200
    );

    e.preventDefault();
  }
}
