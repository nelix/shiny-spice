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

  handleMouseUp: function (e) {
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.state.dragging && this.setState({dragging: false});

    if (this.mightClick) {
      this.mightClick = false;
      this.props.onClick && this.props.onClick(e);
    } else {
      this.props.onDrop && this.props.onDrop();
    }
  },

  handleMouseMove: function (e) {
    if (!this.mightClick && this.state.dragging) {
      this.state.dragging && this.setState({
        grabX: e.pageX,
        grabY: e.pageY
      });
    }
  },

  handleMouseDown: function (e) {
    var button = e.button;
    if (button && (button !== 0 && button !== 1)) {
      return;
    }

    window.addEventListener('mouseup', this.handleMouseUp);
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
    this.getDOMNode().addEventListener('mousedown', this.handleMouseDown);
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('mousedown', this.handleMouseDown);
  },

  componentDidUpdate: function () {
    if (this.state.dragging && !this.dragEventsAttached) {
      this.dragEventsAttached = true;
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (!nextState.dragging && this.dragEventsAttached) {
      this.dragEventsAttached = false;
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
  }

};

var RectMixin = {
  isEventInRect: function(e, rect) {
    return (e.pageX >= rect.left && e.pageX <= rect.right) && (e.pageY >= rect.top && e.pageY <= rect.bottom);
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


var StackieRectKeeperMixin = {
  childRects: {},
  getInitialState: function() {
    return {dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null};
  },

  handleRect: function(component, rect, columnKey) {
    this.childRects[component.props.key] = {component: component, rect: rect, itemKey: component.props.key, columnKey: columnKey};
  },

  handleMove: function(e) {
    var matchKey = null;
    $.each(this.childRects, function(key, rect) {
      if (!rect.component.state.dragging && rect.component.isEventInRect(e, rect.rect)) {
        this.setState({overItemKey: rect.itemKey, overColumnKey: rect.columnKey, overItemPosition: rect.component.props.position});
      }
    }.bind(this));


    this.props.onGrabOver && this.props.onGrabOver(this.state.dragItemKey, this.state.overItemKey, this.state.overColumnKey);
  },

  handleGrab: function(colId, key) {
    this.setState({dragItemKey: key});
    window.addEventListener('mousemove', this.handleMove);
  },

  handleDrop: function(key) {
    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false && this.state.overColumnKey !== false && this.state.overItemPosition !== null) this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    this.setState({dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null});
    window.removeEventListener('mousemove', this.handleMove);
  },
};

var Stackable = React.createClass({

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
        <br/>
      );
    }
    return <div className="sortie-column">{items}</div>;
  }
});
