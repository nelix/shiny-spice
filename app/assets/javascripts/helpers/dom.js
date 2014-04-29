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

  var transformProperty = getStyleProperty('transform');
  var is3d = !!getStyleProperty('perspective');
  var translate = is3d ?
    function( x, y ) {
      return 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
    } :
    function( x, y ) {
      return 'translate( ' + x + 'px, ' + y + 'px)';
    };
    // publicize
    // TODO: namespace
    window.getStyleProperty = getStyleProperty;
    window.getStyle = getStyle;
    window.getBounds = getBounds;
    window.transformProperty = transformProperty;
    window.translate = translate;
    window.isTouch = !!('ontouchstart' in document.documentElement);
})(window);
