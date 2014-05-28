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
      scrollbarOffset: 0
    };
  },

  // Lifecycle
  componentDidMount: function() {
    this.updateScrollbar(this.scrollbarHeight());
    window.addEventListener('resize', this.updateScrollbar);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.autoScrollSpeed) {
      this.animationFrame = requestAnimationFrame(this.tick);
    } else {
      cancelAnimationFrame(this.animationFrame);
    }

    if(prevProps.hash != this.props.hash){
      var newScrollbarHeight = this.scrollbarHeight();
      if (this.state.scrollbarHeight !== newScrollbarHeight) {
        this.updateScrollbar(newScrollbarHeight);
      }
    }
  },

  scrollbarHeight: function() {
    var scrollieWrapper = this.refs.scrollieWrapper.getDOMNode();
    var scrollieItems = this.refs.scrollieItems.getDOMNode();
    this.scrollieItemsHeight = scrollieItems.clientHeight;
    this.scrollieWrapperHeight = scrollieWrapper.clientHeight;

    var scrollbarHeight = (this.scrollieWrapperHeight * (this.scrollieWrapperHeight / this.scrollieItemsHeight)) - (this.props.options.verticalOffset*2);

    this.originalScrollbarHeight = scrollbarHeight;

    if (scrollbarHeight < this.props.options.minHeight) {
      scrollbarHeight = this.props.options.minHeight;
    } else if (this.props.options.maxHeight && scrollbarHeight > this.props.options.maxHeight) {
      scrollbarHeight = this.props.options.maxHeight;
    }
    return scrollbarHeight;
  },

  tick: function() {
    if (this.props.autoScrollSpeed) {
      this.scroll(this.props.autoScrollSpeed * 10);
      this.animationFrame = requestAnimationFrame(this.tick);
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.createScrollbar);
  },

  getNativeScrollbarWidth: function() {
    var el = this.refs.scrollieWrapper.getDOMNode();
    return -Math.abs(el.offsetWidth - el.clientWidth);
  },

  handleScroll: function() {
    var scrollAmount = this.refs.scrollieWrapper.getDOMNode().scrollTop;
    var scrollbarOffset = scrollAmount / this.trackingRatio();

    if (this.state.scrollbarOffset !== scrollbarOffset) {
      this.setState({
        scrollbarOffset: scrollbarOffset
      });
    }
  },

  trackingRatio: function() {
    if (this.originalScrollbarHeight < this.state.scrollbarHeight || this.originalScrollbarHeight > this.state.scrollbarHeight) {
      return ((this.scrollieItemsHeight - this.scrollieWrapperHeight) / ((this.scrollieWrapperHeight - (this.props.options.verticalOffset * 2)) - this.state.scrollbarHeight));
    } else {
      return this.scrollieItemsHeight / this.scrollieWrapperHeight;
    }
  },

  updateScrollbar: function(scrollHeight) {

    var pendingState = this.state;

    var newScrollbarHeight = scrollHeight;
    if (this.state.scrollbarHeight !== newScrollbarHeight) {
      pendingState.scrollbarHeight = newScrollbarHeight;
    }

    // Check if we should add some scrolls
    if (this.scrollieItemsHeight > this.scrollieWrapperHeight) {
      // Scrolls are required, check if they dont exist
      if (!this.state.scrollable) {
        pendingState.scrollable = true;
        pendingState.nativeScrollbarWidth = this.getNativeScrollbarWidth();
      }
    } else if (this.state.scrollable) {
      pendingState.scrollable = false;
    }

    this.setState(pendingState);
  },

  scroll: function(n) {
    var scrollAmount = this.refs.scrollieWrapper.getDOMNode().scrollTop + n;
    this.scrollTo(scrollAmount);
  },

  scrollTo: function(n) {
    this.refs.scrollieWrapper.getDOMNode().scrollTop = n;
  },

  // Mouse events
  handleGrabieGrab: function(mouse) {
    this.startScrollbarOffset = this.refs.scrollieWrapper.getDOMNode().scrollTop;
    document.body.classList.add('no-select');
  },

  handleGrabieMove: function(e, mouse) {
    var mouseDelta = mouse.grabStartY - mouse.grabY;
    var moveAmount = mouseDelta * this.trackingRatio();
    this.scrollTo(this.startScrollbarOffset - moveAmount);
  },

  handleGrabieRelease: function(mouse) {
    document.body.classList.remove('no-select');
  },

  render: function() {
    var thumbStyle = {height: this.state.scrollbarHeight};
    var options = this.props.options;

    var scrollbarOffset = this.state.scrollbarOffset + this.props.options.verticalOffset;
    if (this.state.scrollable) {
      return (
        <div ref="scrollieContainer" className={options.prefix + '-container' + (options.persistant ? options.prefix + '-on-hover' : '')} onScroll={this.handleScroll}>
          <div ref="scrollieWrapper" className={options.prefix + '-wrapper'} style={{right: this.state.nativeScrollbarWidth}}>
            <div ref="scrollieItems" className={options.prefix + '-items has-scrollbar'}>
              {this.props.children}
            </div>
          </div>
          <div className={options.prefix + '-scrollbar'}>
            <Sprite y={scrollbarOffset} style={thumbStyle} className={options.prefix + '-scrollbar-thumb'} onMouseDown={this._handleGrabieMouseDown}/>
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
  attachScrollie: function(component, parameters, dragging, autoScrollSpeed) {
    var defaults = {
      maxHeight: null,
      minHeight: 100,
      persistant: true,
      prefix: 'scrollie',
      verticalOffset: 0
    };

    var options = extend(defaults, parameters);

    return (
      <Scrollie hash={this.props.hash} options={options} dragging={dragging} autoScrollSpeed={autoScrollSpeed}>{component}</Scrollie>
    );
  }
}
