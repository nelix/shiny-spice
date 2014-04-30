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
          scrollbarOffset: 0
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
          right: '-' + this.nativeScrollbarWidth + 'px'
      }

      this.setState({wrapperStyle: wrapperStyle});
  },

  getNativeScrollbarWidth: function(scrollableElement) {
      return scrollableElement.offsetWidth - scrollableElement.clientWidth;
  },

  handleScroll: function(scrollEvent) {
      var scrollAmount = scrollEvent.target.scrollTop;

      var scrollbarOffset = (scrollAmount / this.scrollieItemsHeight) * (this.scrollieWrapperHeight);

      this.setState({
          scrollbarOffset: scrollbarOffset,
          nativeScrollbarOffset: scrollAmount
      });
  },

  createScrollbar: function() {
      var scrollieWrapper = this.refs.scrollieWrapper.getDOMNode();
      var scrollieContainer = this.refs.scrollieContainer.getDOMNode();
      var scrollieItems = this.refs.scrollieItems.getDOMNode();
      var scrollbarHeight = scrollieWrapper.clientHeight * (scrollieWrapper.clientHeight / scrollieItems.clientHeight);
      var scrollbarOffset = scrollieWrapper.scrollTop;
      this.nativeScrollbarWidth = this.getNativeScrollbarWidth(scrollieWrapper);

      // Check the top offset, larguly used for updating component
      if (this.scrollieItemsHeight && (this.scrollieItemsHeight !== scrollieItems.clientHeight)) {
          this.setState({scrollbarOffset: (scrollbarOffset / scrollieItems.clientHeight) * (scrollieWrapper.clientHeight)})
      }

      this.scrollieItemsHeight = scrollieItems.clientHeight;
      this.scrollieWrapperHeight = scrollieWrapper.clientHeight;

      // Check if we should add some scrolls
      if (scrollieItems.clientHeight > scrollieWrapper.clientHeight) {
          if (this.state.scrollbarHeight !== scrollbarHeight) {
              this.setState({scrollbarHeight: scrollbarHeight});
          }

          // Scrolls are required, check if they dont exist
          if (!this.state.scrollable) {
              this.setState({scrollable: true});
              this.hideNativeScrollbar(scrollieWrapper);
          };


          if (this.state.nativeScrollbarOffset !== scrollbarOffset) {
              newScrollOffset = (scrollbarOffset / scrollieItems.clientHeight) * (scrollieWrapper.clientHeight);
              this.setState({scrollbarOffset: newScrollOffset, nativeScrollbarOffset: scrollbarOffset});
          }

      } else {
          if (this.state.scrollable) {
              this.setState({scrollable: false});
          }
      };
  },

  // Mouse events
  handleMouseDown: function(mouse) {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
      this.startMouseY = mouse.nativeEvent.pageY;
      this.startScrollbarOffset = this.refs.scrollieWrapper.getDOMNode().scrollTop;
      this.setState({scrolling: true});
      this.bodyClass = document.body.className;
      document.body.className = this.bodyClass + ' no-select';
  },

  handleMouseUp: function(mouse) {
      window.removeEventListener('mousemove', this.handleMouseMove);
      this.setState({scrolling: false});
      document.body.className = this.bodyClass;
  },

  handleMouseMove: function(e) {
      var mouseDelta = this.startMouseY - e.pageY
      this.refs.scrollieWrapper.getDOMNode().scrollTop = this.startScrollbarOffset - (mouseDelta * (this.scrollieItemsHeight / this.scrollieWrapperHeight));
  },

  render: function() {
    var scrollie = this.props.options;

    var thumbStyle = this.props.style || {};
        thumbStyle['height'] = this.state.scrollbarHeight;
        thumbStyle[transformProperty] = 'translate(0px, ' + this.state.scrollbarOffset + 'px)';

    if (this.state.scrollable) {
      return (
        <div ref="scrollieContainer" className={scrollie.prefix + '-container'} onScroll={this.handleScroll}>
          <div ref="scrollieWrapper" className={scrollie.prefix + '-wrapper'} style={this.state.wrapperStyle}>
            <div ref="scrollieItems" className={scrollie.prefix + '-items'}>
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
            <div className={scrollie.prefix + '-items'} ref="scrollieItems">
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
      prefix: 'scrollie'
    };

    var options = extend(defaults, parameters)

    return (
      <Scrollie options={options}>{component}</Scrollie>
    );
  }
}
