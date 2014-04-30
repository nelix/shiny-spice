/** @jsx React.DOM */

var GrabMouseMixin = {
  getInitialState: function () {
    return {
      dragging: false,
      grabX: 0,
      grabY: 0,
      grabStartX: 0,
      grabStartY: 0
    };
  },

  grabStyle: function(style, rect) {
    style = style || {};

    style['position'] = 'absolute';

    if (this.state.dragging) {
      var x = this.state.grabX - (this.state.grabStartX - rect.left);
      var y = this.state.grabY - (this.state.grabStartY - rect.top );
      if (transformProperty) {
        style[transformProperty] = translate(x,y);
      } else {
        style.left = x;
        style.top = y;
      }
    }

    return style;
  },

  handleGrabieMouseUp: function (e) {
    window.removeEventListener('mouseup', this.handleGrabieMouseUp);
    this.state.dragging && this.setState({dragging: false});

    if (this.mightClick) {
      this.mightClick = false;
      this.props.onClick && this.props.onClick(e);
    } else {
      this.props.onDrop && this.props.onDrop();
    }
  },

  handleGrabieMouseMove: function (e) {
    if (!this.mightClick && this.state.dragging) {
      this.state.dragging && this.setState({
        grabX: e.pageX,
        grabY: e.pageY
      });
    }
  },

  handleGrabieMouseDown: function (e) {
    var button = e.button;
    if (button && (button !== 0 && button !== 1)) {
      return;
    }

    window.addEventListener('mouseup', this.handleGrabieMouseUp);
    this.mightClick = true;
    setTimeout(
      function() {
        if (this.mightClick) {
          this.mightClick = false;

          this.setState({
            dragging: true,
            grabStartX: e.pageX,
            grabStartY: e.pageY,
            grabX: e.pageX,
            grabY: e.pageY
          });

          this.props.onGrab && this.props.onGrab();
        }
      }.bind(this), 200
    );

    e.preventDefault();
  },

  // Lifecycle
  componentDidMount: function() {
    this.getDOMNode().addEventListener('mousedown', this.handleGrabieMouseDown);
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('mousedown', this.handleGrabieMouseDown);
  },

  componentDidUpdate: function () {
    this.getDOMNode().addEventListener('mousedown', this.handleGrabieMouseDown);
    if (this.state.dragging && !this.dragEventsAttached) {
      this.grabieEventsAttached = true;
      window.addEventListener('mousemove', this.handleGrabieMouseMove);
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (!nextState.dragging && this.dragEventsAttached) {
      this.grabieEventsAttached = false;
      window.removeEventListener('mousemove', this.handleGrabieMouseMove);
    }
  }

};

var RectMixin = {
  isEventInRect: function(e, rect) {
    return (e.pageX >= rect.left && e.pageX <= rect.right) && (e.pageY >= rect.top && e.pageY <= rect.bottom);
  },

  componentDidUpdate: function() {
    if (this.state.dragging) return;
    this.rect = getBounds(this.getDOMNode());
this.rect.innerHeight = document.defaultView.getComputedStyle(this.getDOMNode()).height;
this.rect.innerWidth = document.defaultView.getComputedStyle(this.getDOMNode()).width;
    this.props.onRect && this.props.onRect(this, this.rect);
  },

  componentDidMount: function() {
    if (this.state.dragging) return;
    this.rect = getBounds(this.getDOMNode());
    this.rect.innerHeight = document.defaultView.getComputedStyle(this.getDOMNode()).height;
    this.rect.innerWidth = document.defaultView.getComputedStyle(this.getDOMNode()).width;
    this.props.onRect && this.props.onRect(this, this.rect);
  }
};

var Grabber = React.createClass({
  mixins: [LayeredComponentMixin],
  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  renderLayer: function() {
    var style = this.props.styles;
    this.props.children.props.style = this.props.children.props.style || {};
    this.props.children.props.style['width'] = this.props.styles.width;

    return <div style={style} className="grabie-grabbable grabie-grabbing">{React.Children.only(this.props.children)}</div>;
  },
  render: function() {return <span style={{display:'none'}}/>}
});

var Grabbable = React.createClass({
  mixins: [GrabMouseMixin, RectMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  render: function () {
    if (!this.state.dragging) {
      return this.transferPropsTo(
        <div className="grabie-grabbable">{React.Children.only(this.props.children)}</div>
      );
    } else {
      return <Grabber styles={this.grabStyle({width: this.rect.innerWidth, height: this.rect.innerHeight}, this.rect)}>{React.Children.only(this.props.children)}</Grabber>
    }

  }
});


var Stackable = React.createClass({

  mixins: [ScrollieMixin],

  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired
  },

  handleClick: function(e) {
    console.log('click', e);
  },

  handleRect: function(a,b) {
    this.props.onRect && this.props.onRect(a,b, this.props.key);
  },

  render: function() {
    var items = this.props.children.map(function joinChildWithGrabbable(child, i) {
      var grabbableChild = <Grabbable position={i} key={child.props.key} onGrab={this.props.onGrab.bind(null, child.props.key)} onDrop={this.props.onDrop.bind(null, child.props.key)} onRect={this.handleRect} onClick={this.handleClick}>{child}</Grabbable>;
      return grabbableChild;
    },this);

    if (this.props.overItemPosition !== false) {
      items.splice(this.props.overItemPosition, 0,
        <span className="grabbie-placeholder" key={'gap'}></span>
      );
    }
    return this.attachScrollie(<div className="sortie-column">{items}</div>);
  }
});
