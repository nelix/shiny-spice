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

      var scrollbarOffset = (scrollAmount / this.childrenHeight) * (this.wrapperHeight);

      this.setState({
          scrollbarOffset: scrollbarOffset,
          nativeScrollbarOffset: scrollAmount
      });
  },

  createScrollbar: function() {
      var scrollWrapper = this.refs.scrollWrapper.getDOMNode();
      var listWrapper = this.refs.listWrapper.getDOMNode();
      var children = this.refs.children.getDOMNode();
      var scrollbarHeight = scrollWrapper.clientHeight * (scrollWrapper.clientHeight / children.clientHeight);
      var scrollbarOffset = scrollWrapper.scrollTop;
      this.nativeScrollbarWidth = this.getNativeScrollbarWidth(scrollWrapper);

      // Check the top offset, larguly used for updating component
      if (this.childrenHeight && (this.childrenHeight !== children.clientHeight)) {
          this.setState({scrollbarOffset: (scrollbarOffset / children.clientHeight) * (scrollWrapper.clientHeight)})
      }

      this.childrenHeight = children.clientHeight;
      this.wrapperHeight = scrollWrapper.clientHeight;

      console.log({
        childrenHeight: this.childrenHeight,
        wrapperHeight: this.wrapperHeight
      })

      // Check if we should add some scrolls
      if (children.clientHeight > scrollWrapper.clientHeight) {
          if (this.state.scrollbarHeight !== scrollbarHeight) {
              this.setState({scrollbarHeight: scrollbarHeight});
          }

          // Scrolls are required, check if they dont exist
          if (!this.state.scrollable) {
              this.setState({scrollable: true});
              this.hideNativeScrollbar(scrollWrapper);
          };


          if (this.state.nativeScrollbarOffset !== scrollbarOffset) {
              newScrollOffset = (scrollbarOffset / children.clientHeight) * (scrollWrapper.clientHeight);
              this.setState({scrollbarOffset: newScrollOffset, nativeScrollbarOffset: scrollbarOffset});
          }

      } else {
          if (this.state.scrollable) {
              this.setState({scrollable: false});
          }
      };
  },

  render: function() {
    var scrollie = this.props.options;

    var thumbStyle = this.props.style || {};
        thumbStyle['height'] = this.state.scrollbarHeight;
        thumbStyle[transformProperty] = 'translate(0px, ' + this.state.scrollbarOffset + 'px)';

    if (this.state.scrollable) {
      return (
        <div ref="listWrapper" className={scrollie.prefix + '-container'} onScroll={this.handleScroll}>
          <div ref="scrollWrapper" className={scrollie.prefix + '-wrapper'} style={this.state.wrapperStyle}>
            <div className="children" ref="children">
              {this.props.children}
            </div>
          </div>
          <div className="scrollbar">
              <div className="scrollbar-thumb" style={thumbStyle} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div ref="listWrapper" className={scrollie.prefix + '-container'}>
          <div ref="scrollWrapper" className={scrollie.prefix + '-wrapper'}>
            <div className="children" ref="children">
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
