/** @jsx React.DOM */
var autoScrollMixin = {
  autoScrollSpeed: function(dragging, mouseEvent, rect) {
    var distanceForScrollStart = 100;

    var mouseY = mouseEvent.pageY;
    var elementTop = rect.top;
    var elementBottom = rect.bottom;
    var mouseFromElementTop = mouseY - elementTop;
    var mouseFromElementBottom = elementBottom -  mouseY;

    if (mouseY < (elementTop + distanceForScrollStart)) {
      var speed = (1 - (mouseFromElementTop / distanceForScrollStart)) * -1;
    }

    if (mouseY > (elementBottom - distanceForScrollStart)) {
      var speed = 1 - (mouseFromElementBottom / distanceForScrollStart);
    }

    speed = dragging ? speed : null;
    return speed;
  }
}
