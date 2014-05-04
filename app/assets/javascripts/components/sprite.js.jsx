/** @jsx React.DOM */

/*
           .=.
           } {
          .' '.
         / (/) \
         ;'----';
         |SPRITE|
         |• • • |
         |• • • |
          |'--'|
         '.____.'
*/

var EMPTY_STYLE = {};

var Sprite = React.createClass({

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  getDefaultProps: function(){
    return {
      x: 0,
      y: 0
    };
  },

  // if we use 3dtranslate once we need to keep using it to avoid flickering
  componentWillMount: function() {
    this.everWas3d = false;
  },

  getStyle: function() {
    if (!this.props.x && !this.props.y && !this.everWas3d) {
      return EMPTY_STYLE;
    }

    var style = {};

    if (transformProperty) {
      this.everWas3d = true;
      style[transformProperty] = translate(this.props.x, this.props.y);
    } else {
      style.position = 'absolute';
      style.left = this.props.x;
      style.top = this.props.y;
    }
    return style;
  },

  render: function() {

    return this.transferPropsTo(
      <div style={this.getStyle()}>
        {React.Children.only(this.props.children)}
      </div>
    );
  }
});
