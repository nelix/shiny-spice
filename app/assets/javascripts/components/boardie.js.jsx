/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

function find(needle, haystack, attr) {
  attr = attr || 'id';

  return (haystack || []).filter(
    function(hay) {
      return (needle === hay[attr]);
    }
  )[0];
}

function findIndex(needle, haystack, attr) {
  attr = attr || 'id';
  var index;

  (haystack || []).forEach(
    function(hay, ind) {
      if (needle === hay[attr]) index = ind;
    }
  );

  return index;
}

function mouseOverBottomHalf(e, rect) {
  var clientYRel = e.pageY - rect.top;
  var isTop = (clientYRel <  rect.height/2);
  return !isTop;
}

function mouseOverRightHalf(e, rect) {
  var clientXRel = e.pageX - rect.left;
  var isLeft = (clientXRel <  rect.width/2);
  return !isLeft;
}

var StackieRectKeeperMixin = {
  getInitialState: function() {
    return {dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null, itemDragging: false};
  },

  handleTaskIeHover: function(columnId, taskKey, mouseEvent) {
    this.state.itemDragging && dispatchPointerEventsFallback(mouseEvent, 'data-grabie', 'mousemove');
  },

  handleTaskHover: function(columnKey, taskKey, position, mouseEvent) {
    if (this.state.itemDragging) {
      var targetBoundingRect = getBounds(mouseEvent.target);

      mouseOverBottomHalf(mouseEvent, targetBoundingRect) && position++
      this.setState({overItemKey: taskKey, overColumnKey: columnKey, overItemPosition: position});
    }
  },

  handleTaskGrab: function(columnKey, taskKey, position, width, height) {
    this.setState({dragItemKey: taskKey, overItemPosition: position, overColumnKey: columnKey, dragItemWidth: width, dragItemHeight: height});
    this.setState({itemDragging: true});
  },

  handleTaskDrop: function(key) {
    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false &&
        this.state.overColumnKey !== false && this.state.overItemPosition !== null) {

      this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    }

    this.setState({dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null});
  },

  handleTaskRelease: function() {
    this.setState({itemDragging: false});
  }

};


var Boardie = React.createClass({

  mixins: [StackieRectKeeperMixin, autoScrollMixin],

  getInitialState: function() {
    return {dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0}
  },

  getItems: function(ids) {
    return ids.map(
      function(id) {
        var item = find(id, this.props.items)
        return this.props.itemBuilder ? this.props.itemBuilder(item) : item;
      },this
    );
  },

  handleSort: function(itemId, position, columnId) {
    var columns = this.props.columns;

    var fromColumn;
    var fromPosition;

    if (position >= 0) {

      columns.forEach(
        function(column) {
          if (column.items.indexOf(itemId) !== -1) {
            fromColumn = column;
            fromPosition = column.items.indexOf(itemId);
            column.items.splice(column.items.indexOf(itemId), 1);
          }
        }
      );

      if ((fromColumn.id === columnId) && (fromPosition < position) ) {
        position--;
      }
      var columnIndex = findIndex(columnId, columns);
      var newColItems = columns[columnIndex].items;
      newColItems.splice(position, 0, itemId);

      this.setProps({columns: columns});
    }
  },

  handleIeHover: function(mouseEvent) {
    // IE10 fix
    var hoveredColumn = dispatchPointerEventsFallback(mouseEvent, 'data-grabie', 'mousemove');
    hoveredColumn && this.setState({handleColumnHoverPosition: !mouseOverRightHalf(mouseEvent, getBounds(hoveredColumn))});
  },

  handleColumnHover: function(columnKey, columnId, mouseEvent) {
    // Pop item into last position in column
    if (this.state.overColumnKey !== columnKey) {
      this.setState({overColumnKey: columnKey, overItemPosition: columns[columnId].items.length+1});
    }

    var position = columnId;

    if (this.state.handleColumnHoverPosition === false || this.state.handleColumnHoverLeft === true) {
      stateLeft = this.state.handleColumnHoverPosition;
    } else {
      stateLeft = mouseOverRightHalf(mouseEvent, getBounds(mouseEvent.target));
    }

    stateLeft && position++;
    
    this.setState({overColumnPosition: position});

    this.setState({autoScrollSpeed: this.autoScrollSpeed(this.state.itemDragging, mouseEvent, getBounds(this.getDOMNode()))});
  },

  handleColumnGrab: function(key, position, width, height) {
    this.setState({columnDragging: true, dragColumnKey: key, overColumnPosition: position, dragColumnWidth: width, dragColumnHeight: height});
  },

  handleColumnRelease: function() {
    this.setState({columnDragging: false, dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0});
  },

  buildColumn: function(column, i) {
    var items = this.getItems(column.items);
    var column =
      <Grabbable
          className="sortie-column"
          data-grabie="hover"
          position={i}
          key={column.id}
          onGrabieLongGrab={this.handleColumnGrab.bind(null, column.id)}
          onGrabieDragRelease={this.handleColumnRelease.bind(null, column.id)}
          onMouseMove={this.state.columnDragging && this.handleColumnHover.bind(null, column.id, i)}
          onGrabieMove={this.state.columnDragging && this.handleIeHover}
          onMouseOut={this.handleColumnLeave}>
        <Stackable
            overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition}
            placeholderStyle={{height: this.state.dragItemHeight, width: this.state.dragItemWidth}}
            overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id}
            onGrabieDragRelease={this.handleTaskDrop}
            onGrabieRelease={this.handleTaskRelease}
            onGrabieLongGrab={this.handleTaskGrab.bind(null, column.id)}
            onGrabieMove={this.handleTaskIeHover.bind(null, column.id)}
            onGrabieHover={this.handleTaskHover.bind(null, column.id)}
            dragging={this.state.itemDragging}
            autoScrollSpeed={this.state.autoScrollSpeed}>
          {items}
        </Stackable>
      </Grabbable>

    return column;
  },

  render: function() {
    var columns = this.props.columns.map(this.buildColumn, this);

  // this is an issue, as it's always moving with the mouse :/
    if (this.state.overColumnPosition !== null) {
      columns.splice(this.state.overColumnPosition, 0,
        <span style={{width: this.state.dragColumnWidth, height: this.state.dragColumnHeight}} className="grabbie-placeholder-sortie-column" key={'gap'}></span>
      );
    }

    return (
      <div className="boardie cf">
        {columns}
      </div>
    );
  }
});
