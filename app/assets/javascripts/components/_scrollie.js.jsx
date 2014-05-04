/** @jsx React.DOM */

function extend(a, b){
  for(var key in b)
    if(b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}

var Scrollie = React.createClass({
  mixins: [GrabieMouseMixin],

  getInitialState: function () {
    return {
      scrollable: false,
      scrollbarHeight: 0,
      nativeScrollbarWidth: 0,
      scrollbarOffset: this.props.options.verticalOffset
    };
  },

  // Lifecycle
  componentDidMount: function() {
    this.createScrollbar();
    window.addEventListener('resize', this.createScrollbar);
  },

  componentDidUpdate: function () {
    this.createScrollbar();
  },

  getNativeScrollbarWidth: function(scrollableElement) {
    return -Math.abs(scrollableElement.offsetWidth - scrollableElement.clientWidth);
  },

  handleScroll: function(scrollEvent) {
    var scrollAmount = scrollEvent.target.scrollTop;

    // Set the offset
    var scrollbarOffset = scrollAmount / this.scrollieTrackingRatio;

    this.setState({
      scrollbarOffset: scrollbarOffset + this.props.options.verticalOffset,
      nativeScrollbarOffset: scrollAmount
    });
  },

  createScrollbar: function() {
    var scrollieWrapper = this.refs.scrollieWrapper.getDOMNode();
    var scrollieContainer = this.refs.scrollieContainer.getDOMNode();
    var scrollieItems = this.refs.scrollieItems.getDOMNode();
    var scrollbarHeight = (scrollieWrapper.clientHeight * (scrollieWrapper.clientHeight / scrollieItems.clientHeight)) - (this.props.options.verticalOffset * 2);
    var scrollbarOffset = scrollieWrapper.scrollTop;
    var pendingState = {};

    this.originalScrollbarHeight = scrollbarHeight;

    if (scrollbarHeight < this.props.options.minHeight) {
      scrollbarHeight = this.props.options.minHeight;
    } else if (this.props.options.maxHeight && scrollbarHeight > this.props.options.maxHeight) {
      scrollbarHeight = this.props.options.maxHeight;
    }

    // Check the top offset, largly used for updating component
    if (this.scrollieItemsHeight && (this.scrollieItemsHeight !== scrollieItems.clientHeight)) {
        pendingState.scrollbarOffset = (scrollbarOffset / scrollieItems.clientHeight) * (scrollieWrapper.clientHeight);
    }

    this.scrollieItemsHeight = scrollieItems.clientHeight;
    this.scrollieWrapperHeight = scrollieWrapper.clientHeight;

    // Check if we should add some scrolls
    if (scrollieItems.clientHeight > scrollieWrapper.clientHeight) {
      if (this.state.scrollbarHeight !== scrollbarHeight) {
        pendingState.scrollbarHeight = scrollbarHeight;
      }

      // Scrolls are required, check if they dont exist
      if (!this.state.scrollable) {
        pendingState.scrollable = true;
        pendingState.nativeScrollbarWidth = this.getNativeScrollbarWidth(scrollieWrapper);
      }

      if (this.state.nativeScrollbarOffset !== scrollbarOffset) {
        newScrollOffset = (scrollbarOffset / scrollieItems.clientHeight) * (scrollieWrapper.clientHeight);
        pendingScrollbarOffset = newScrollOffset;
        pendingState.nativeScrollbarOffset = scrollbarOffset;
      }

      // Set the standard tracking ratio
      this.scrollieTrackingRatio = this.scrollieItemsHeight / this.scrollieWrapperHeight;

      // If the user has a min OR max scrollbar height set, we need to adjust tracking ratio
      if (this.originalScrollbarHeight < this.state.scrollbarHeight || this.originalScrollbarHeight > this.state.scrollbarHeight) {
        this.scrollieTrackingRatio = ((this.scrollieItemsHeight - this.scrollieWrapperHeight) / ((this.scrollieWrapperHeight - (this.props.options.verticalOffset * 2)) - this.state.scrollbarHeight));
      }

    } else if (this.state.scrollable) {
      pendingState.scrollable = false;
    }
    if (Object.keys(pendingState).length > 0) {
      this.setState(pendingState);
    }
  },

  // Mouse events
  handleGrabieGrab: function(mouse) {
    this.startScrollbarOffset = this.refs.scrollieWrapper.getDOMNode().scrollTop;
    document.body.classList.add('no-select');
  },

  handleGrabieMove: function(e, mouse) {
    if (this.state.grabieMouse.mouseDown) {
      var mouseDelta = mouse.grabStartY - mouse.grabY;
      var moveAmount = mouseDelta * this.scrollieTrackingRatio;
      this.refs.scrollieWrapper.getDOMNode().scrollTop = this.startScrollbarOffset - moveAmount;
    }
  },

  handleGrabieRelease: function(mouse) {
    document.body.classList.remove('no-select');
  },

  render: function() {
    var thumbStyle = this.props.style || {height: this.state.scrollbarHeight};
    var options = this.props.options;

    if (this.state.scrollable) {

      if (transformProperty) {
        thumbStyle[transformProperty] = translate(0, this.state.scrollbarOffset);
      } else {
        thumbStyle.top = this.state.scrollbarOffset;
      }

      return (
        <div ref="scrollieContainer" className={options.prefix + '-container' + (options.persistant ? options.prefix + '-on-hover' : '')} onScroll={this.handleScroll}>
          <div ref="scrollieWrapper" className={options.prefix + '-wrapper'} style={{right: this.state.nativeScrollbarWidth}}>
            <div ref="scrollieItems" className={options.prefix + '-items has-scrollbar'}>
              {this.props.children}
            </div>
          </div>
          <div className={options.prefix + '-scrollbar'}>
            <div className={options.prefix + '-scrollbar-thumb'} style={thumbStyle} onMouseDown={this._handleGrabieMouseDown}></div>
            {this.state.grabieMouse.mouseDown && <Overlay onMouseUp={this._handleGrabieMouseUp} onMouseMove={this._handleGrabieMouseMove}/>}
          </div>
        </div>
      );
    } else {
      return (
        <div ref="scrollieContainer" className={options.prefix + '-container'}>
          <div ref="scrollieWrapper" className={options.prefix + '-wrapper'}>
            <div ref="scrollieItems" className={options.prefix + '-items'}>
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }
  }
});

var ScrollieMixin = {
  attachScrollie: function(component, parameters) {
    var defaults = {
      maxHeight: null,
      minHeight: 100,
      persistant: true,
      prefix: 'scrollie',
      verticalOffset: 0
    };

    var options = extend(defaults, parameters)

    return (
      <Scrollie options={options}>{component}</Scrollie>
    );
  }
}
