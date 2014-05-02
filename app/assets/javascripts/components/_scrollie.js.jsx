/** @jsx React.DOM */

function extend(a, b){
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

var Scrollie = React.createClass({
  getInitialState: function () {
    return {
      scrollable: false,
      scrolling: false,
      scrollbarHeight: 0,
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

  hideNativeScrollbar: function(scrollableElement) {
    var wrapperStyle = {
      right: '-' + this.nativeScrollbarWidth
    }

    this.setState({wrapperStyle: wrapperStyle});
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

    this.nativeScrollbarWidth = this.getNativeScrollbarWidth(scrollieWrapper);
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
        pendingState.wrapperStyle = {right: this.nativeScrollbarWidth};
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
  handleMouseDown: function(mouse) {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.startMouseY = mouse.nativeEvent.pageY;
    this.startScrollbarOffset = this.refs.scrollieWrapper.getDOMNode().scrollTop;
    this.setState({scrolling: true});
    document.body.classList.add('no-select');
  },

  handleMouseUp: function(mouse) {
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({scrolling: false});
    document.body.classList.remove('no-select');
  },

  handleMouseMove: function(e) {
    var mouseDelta = this.startMouseY - e.pageY;
    var moveAmount = mouseDelta * this.scrollieTrackingRatio;
    this.refs.scrollieWrapper.getDOMNode().scrollTop = this.startScrollbarOffset - moveAmount;
  },

  render: function() {
    var scrollie = this.props.options,
      thumbStyle = this.props.style || {height: this.state.scrollbarHeight},
      scrollieContainerClass = (scrollie.prefix + '-container');

    if (transformProperty) {
      thumbStyle[transformProperty] = translate(0, this.state.scrollbarOffset);
    } else {
      thumbStyle.top = this.state.scrollbarOffset;
    }

    if (!scrollie.persistant) {scrollieContainerClass += ' ' + scrollie.prefix + '-on-hover';}

    if (this.state.scrollable) {
      return (
        <div ref="scrollieContainer" className={scrollieContainerClass} onScroll={this.handleScroll}>
          <div ref="scrollieWrapper" className={scrollie.prefix + '-wrapper'} style={this.state.wrapperStyle}>
            <div ref="scrollieItems" className={scrollie.prefix + '-items has-scrollbar'}>
              {this.props.children}
            </div>
          </div>
          <div className={scrollie.prefix + '-scrollbar'}>
              <div className={scrollie.prefix + '-scrollbar-thumb'} style={thumbStyle} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div ref="scrollieContainer" className={scrollie.prefix + '-container'}>
          <div ref="scrollieWrapper" className={scrollie.prefix + '-wrapper'}>
            <div ref="scrollieItems" className={scrollie.prefix + '-items'}>
              {this.props.children}
            </div>
          </div>
        </div>
      )
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
