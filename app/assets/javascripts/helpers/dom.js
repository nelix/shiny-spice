(function (window) {

  'use strict';

  var prefixes = 'Webkit Moz ms Ms O'.split(' ');
  var docElemStyle = document.documentElement.style;

  function getStyleProperty(propName) {
    // test standard property first
    if (typeof docElemStyle[propName] === 'string') {
        return propName;
    }

    // capitalize
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    var prefixed;
    for (var i = 0, len = prefixes.length; i < len; i++) {
        prefixed = prefixes[i] + propName;
        if (typeof docElemStyle[prefixed] === 'string') {
            return prefixed;
        }
    }
  }
  var defView = document.defaultView;

  var getStyle = defView && defView.getComputedStyle ? function(elem) {
      return defView.getComputedStyle(elem, null);
    } : function(elem) {
      return elem.currentStyle;
    };

  var getBounds = function(el) {
      return el.getBoundingClientRect();
  };

  var dispatchPointerEventsFallback = pointerEventsAvailable ? function() {} :  function(mouseEvent, eventName) {
    // IE10

    if (msPointerEventsMethod && !mouseEvent.synthetic) {
      var underlyingNodeList = document.msElementsFromPoint(mouseEvent.pageX, mouseEvent.pageY);

      if (underlyingNodeList) {
        for (var i = 0; i < underlyingNodeList.length; i++) {
          if (window.getComputedStyle(underlyingNodeList[i]).getPropertyValue('pointer-events') !== 'none') {
            var event = document.createEvent('CustomEvent');

            //var e = {synthetic: true, screenX: mouseEvent.screenX, screenY: mouseEvent.screenY, clientX:mouseEvent.clientX, clientY: mouseEvent.clientY,

            event.initCustomEvent('mousemove', true, true, {});
            event.synthetic = true;
            event.screenX = mouseEvent.screenX;
            event.screenY = mouseEvent.screenY;
            event.clientX = mouseEvent.clientX;
            event.clientY = mouseEvent.clientY;
            event.pageX = mouseEvent.pageX;
            event.pageY = mouseEvent.pageY;
            underlyingNodeList[i].dispatchEvent(event);
            return underlyingNodeList[i];
          }
        }
      }
    }
  };

  var transformProperty = getStyleProperty('transform');

  var is3d = !!getStyleProperty('perspective');
  var translate = is3d ?
    function( x, y ) {
      return 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
    } :
    function( x, y ) {
      return 'translate( ' + x + 'px, ' + y + 'px)';
    };

  var pointerEventsAvailable = (function() {
    //https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
    var element = document.createElement('x');
    element.style.cssText = 'pointer-events:auto';
    return element.style.pointerEvents === 'auto';
  })();

  // publicize
  // TODO: namespace
  window.getStyleProperty = getStyleProperty;
  window.getStyle = getStyle;
  window.getBounds = getBounds;
  window.transformProperty = transformProperty;
  window.translate = translate;
  window.dispatchPointerEventsFallback = dispatchPointerEventsFallback;
  // Support
  window.msPointerEventsMethod = document.msElementsFromPoint;
  window.isTouch = !!('ontouchstart' in document.documentElement);
})(window);
