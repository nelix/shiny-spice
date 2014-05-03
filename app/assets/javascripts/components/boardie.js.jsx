/** @jsx React.DOM */

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
  childRects: {},
  getInitialState: function() {
    return {dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null};
  },

  handleRect: function(component, rect, columnKey) {
    this.childRects[component.props.key] = {component: component, rect: rect, itemKey: component.props.key, columnKey: columnKey};
  },

  handleBoardieMove: function(a,e) {
    $.each(this.childRects, function(key, rect) {
      if (rect.component.isEventInRect(e, rect.rect)) {
        var position = rect.component.props.position;
        mouseOverBottomHalf(e, rect.rect) && position++
        if ((this.state.overItemKey !== rect.itemKey) || (this.state.overColumnKey !== rect.columnKey) || (this.state.overItemPosition !== position)) {
          this.setState({overItemKey: rect.itemKey, overColumnKey: rect.columnKey, overItemPosition: position});
          this.props.onGrabOver && this.props.onGrabOver(this.state);
        }
      }
    }.bind(this));
  },

  handleGrab: function(colId, key, position, width, height) {
    this.setState({dragItemKey: key, overItemPosition: position, overColumnKey: colId, dragItemWidth: width, dragItemHeight: height});
  },

  handleDrop: function(key) {
    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false &&
        this.state.overColumnKey !== false && this.state.overItemPosition !== null) {

      this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    }

    this.setState({dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null});
  },
};


var Boardie = React.createClass({

  mixins: [StackieRectKeeperMixin],

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

  handleColumnMove: function(a,e ) {
    $.each(this.columnRects, function(key, rect) {
      if (rect.component.isEventInRect(e, rect.rect)) {
        var position = rect.component.props.position;
        mouseOverRightHalf(e, rect.rect) && position++;
        if ( (this.state.overColumnPosition !== position)) {
          this.setState({overColumnPosition: position});
        }
      }
    }.bind(this));
  },

  handleColumnGrab: function(key, position, width, height) {
    this.setState({dragColumnKey: key, overColumnPosition: position, dragColumnWidth: width, dragColumnHeight: height});
  },

  handleColumnRelease: function() {
    this.setState({dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0});
  },

  columnRects: {},

  handleColumnRect: function(component, rect) {
    this.columnRects[component.props.key] = {component: component, rect: rect, columnKey: component.props.key};
  },

  buildColumn: function(column, i) {
    var items = this.getItems(column.items);
    var column =
      <Grabbable
          className="sortie-column"
          position={i}
          key={column.id}
          onGrabieGrab={this.handleColumnGrab.bind(null, column.id)}
          onGrabieRelease={this.handleColumnRelease.bind(null, column.id)}
          onGrabieMove={this.handleColumnMove.bind(null, column.id)}
          onRect={this.handleColumnRect}>
        <Stackable
            overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition}
            placeholderStyle={{height: this.state.dragItemHeight, width: this.state.dragItemWidth}}
            overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id}
            onGrabieRelease={this.handleDrop}
            onGrabieGrab={this.handleGrab.bind(null, column.id)}
            onGrabieMove={this.handleBoardieMove}
            onRect={this.handleRect}>
          {items}
        </Stackable>
      </Grabbable>

    return column;
  },

  render: function() {
    var columns = this.props.columns.map(this.buildColumn, this);

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
