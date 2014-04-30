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

  grabStyle: function() {
    var style = this.props.style || {};

    style['position'] = 'relative';

    if (this.state.dragging) {
      var x = this.state.grabX - this.state.grabStartX;
      var y = this.state.grabY - this.state.grabStartY;
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
    this.rect = getBounds(this.getDOMNode());
    this.props.onRect && this.props.onRect(this, this.rect);
  },

  componentDidMount: function() {
    this.rect = getBounds(this.getDOMNode());
    this.props.onRect && this.props.onRect(this, this.rect);
  }
};

var Grabbable = React.createClass({
  mixins: [GrabMouseMixin, RectMixin],

  propTypes: {
    children: React.PropTypes.component.isRequired
  },

  render: function () {
    var style = this.grabStyle();

    var className = 'grabie-grabbable' + (this.state.dragging ? ' grabie-grabbing' : '');
    return this.transferPropsTo(
      <div onClick={null} style={style} className={className}>{React.Children.only(this.props.children)}</div>
    );
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

    var placeStyle = {display: 'block', height: '10px'}
    placeStyle[getStyleProperty('box-shadow')] = '3px 3px 5px 6px #ccc';

    if (this.props.overItemPosition !== false) {
      items.splice(this.props.overItemPosition, 0,
        <span style={placeStyle} key={'gap'}></span>
      );
    }
    return <div className="sortie-column">{items}</div>;
  }
});
