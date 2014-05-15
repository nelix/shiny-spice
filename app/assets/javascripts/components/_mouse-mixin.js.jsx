/** @jsx React.DOM */
function extend(a, b){
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

var velocity = new Array(5);

function addToV(val){
    // last in, first out
    var arr = velocity;
    arr = arr.slice(1, arr.length);
    arr.push(val);
    velocity = arr;
}

function velocityR(){
    var sumX = 0;
    var sumY = 0;

    for (var i = 0; i < velocity.length -1; i++){
      if ( velocity[i] ){
        sumX += (velocity[i+1].x - velocity[i].x);
        sumY += (velocity[i+1].y - velocity[i].y);
      }
    }

    // return velocity in each direction.
    return { x: sumX*0.5, y: sumY*0.5};
  }

var GrabieMouseMixin = {
  getInitialState: function () {
    return {
      grabieMouse: {
        mouseDown: false,
        mouseLongDown: false,
        dragging: false,
        grabX: 0,
        grabY: 0,
        grabStartX: 0,
        grabStartY: 0
      }
    };
  },

  _handleGrabieMouseUp: function (e) {
    // temporary
    $(document).unbind("mouseup", this._handleGrabieMouseUp);

    var oldGrabieMouse = this.state.grabieMouse;
    var initialGrabieMouse = $.extend({}, this.state.grabieMouse); // this can be changed to use ._clone()

    if (this.state.grabieMouse.mouseDown) {
      oldGrabieMouse.mouseDown = false;
      clearTimeout(this.longDown);
      oldGrabieMouse.mouseLongDown = false;
    }

    if (this.state.grabieMouse.dragging) {
      oldGrabieMouse.dragging = false;
    }

    // update grabieMouse
    this.setState({grabieMouse: oldGrabieMouse});

    velocity = new Array(5);

    // Mouseup
    this.handleGrabieRelease && this.handleGrabieRelease(this.state.grabieMouse);

    // Drag release
    if (initialGrabieMouse.dragging) {
      this.handleGrabieDragRelease && this.handleGrabieDragRelease(this.state.grabieMouse);
    }

    return false;
  },

  _handleGrabieMouseMove: function (e) {
    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.grabX = e.pageX;
    oldGrabieMouse.grabY = e.pageY;
    addToV({x: e.pageX, y:e.pageY})
    this.setState({grabieMouse: oldGrabieMouse});
    if (oldGrabieMouse.mouseLongDown) {this._handleGrabieMouseDrag()}
    this.handleGrabieMove  && this.handleGrabieMove(e, this.state.grabieMouse, velocityR());
    return false;
  },

  _isLeftMouseButton: function(e) {
    var button = e.button;
    return (button && (button !== 0 && button !== 1));
  },

  _handleGrabieMouseDown: function(e) {
    // This is some temporary disgusting way to make sure mouseUp is always called, so we can cancel events regardless
    $(document).bind("mouseup", this._handleGrabieMouseUp);

    if (this._isLeftMouseButton(e)) {
      return;
    }

    this.longDown = window.setTimeout(function() {
      oldGrabieMouse.mouseLongDown = true;
      this._handleGrabieMouseLongDown(e);
    }.bind(this), 200)

    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.mouseDown = true;
    oldGrabieMouse.grabStartX = e.pageX;
    oldGrabieMouse.grabStartY = e.pageY;
    oldGrabieMouse.grabX = e.pageX;
    oldGrabieMouse.grabY = e.pageY;
    this.setState({grabieMouse: oldGrabieMouse});

    this.handleGrabieGrab && this.handleGrabieGrab(this.state.grabieMouse);
    return false;
  },

  _handleGrabieMouseLongDown: function(e) {
    this.handleGrabieLongGrab && this.handleGrabieLongGrab(this.state.grabieMouse);
  },

  _handleGrabieMouseDrag: function(e) {
    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.dragging = true;
    this.setState({grabieMouse: oldGrabieMouse});

    this.handleGrabieDrag && this.handleGrabieDrag(this.state.grabieMouse);
  }
}
