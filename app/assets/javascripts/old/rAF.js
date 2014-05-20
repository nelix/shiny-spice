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
    for (var i = 0, len = velocity.length - 1; i < len; i++)
      velocity[i] = velocity[i + 1];
    velocity[velocity.length - 1] = val
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
var ticking = false;
var ev = {};
function vectorTick() {
  if (ticking) {
    var oldGrabieMouse = this.state.grabieMouse;
    oldGrabieMouse.grabX = velocity[velocity.length-1].x;
    oldGrabieMouse.grabY = velocity[velocity.length-1].y;
    ev.pageX = oldGrabieMouse.grabX;
    ev.pageY = oldGrabieMouse.grabY;
    this.setState({grabieMouse: oldGrabieMouse});
    this.handleGrabieMove  && this.handleGrabieMove(ev, this.state.grabieMouse, velocityR());
    requestAnimationFrame(vectorTick.bind(this));
  } else {

  }
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
    velocity = new Array(5);
    ticking = false;
    this.handleGrabieRelease && this.handleGrabieRelease(this.state.grabieMouse);
    return false;
  },




  _handleGrabieMouseMove: function (e) {
    addToV({x: e.pageX, y:e.pageY})

    if (ticking) {
      return false;
    } else {
      ticking = true;
      Function.prototype.apply.call(vectorTick, this);
    }

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
