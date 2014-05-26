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

var Boardie = React.createClass({

  mixins: [autoScrollMixin],

  getInitialState: function() {
    return {
      dragColumnKey: null,
      overColumnPosition: null,
      dragColumnWidth: 0,
      dragColumnHeight: 0,

      dragItemKey: null,
      overItemKey: null,
      overItemPosition: null,
      overColumnKey: null,
      itemDragging: false
    };
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
    this.props.onSort(itemId, position, columnId);
  },

  handleItemHover: function(columnKey, itemKey, position, mouseEvent) {
    if (this.state.itemDragging) {
      var targetBoundingRect = getBounds(mouseEvent.target);
      mouseOverBottomHalf(mouseEvent, targetBoundingRect) && position++;

      this.setState({
        overItemKey: itemKey,
        overColumnKey: columnKey,
        overItemPosition: position,
        autoScrollSpeed: this.autoScrollSpeed(this.state.itemDragging, mouseEvent, getBounds(this.getDOMNode()))
      });
    }
  },

  handleItemDrop: function(key) {
    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false &&
        this.state.overColumnKey !== false && this.state.overItemPosition !== null) {

      this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    }

    this.setState({autoScrollSpeed:null, dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null, itemDragging: false});
  },

  handleColumnHover: function(columnKey, columnId, mouseEvent) {
    // Pop item into last position in column
    if (this.state.overColumnKey !== columnKey) {
      this.setState({overColumnKey: columnKey, overItemPosition: this.props.columns[columnId].items.length+1});
    }

    var position = columnId;

    var stateLeft = mouseOverRightHalf(mouseEvent, getBounds(mouseEvent.target));
    stateLeft && position++;

    this.setState({overColumnPosition: position});
  },

  handleGrab: function(thing, columnId, itemId, position, width, height) {
    if (thing == 'column') {
      this.setState({
        columnDragging: true,
        dragColumnKey: columnId,
        overColumnPosition: position,
        dragColumnWidth: width,
        dragColumnHeight: height
      });
    } else {
      this.setState({
        itemDragging: true,
        dragItemKey: itemId,
        overItemPosition: position,
        overColumnKey: columnId,
        dragItemWidth: width,
        dragItemHeight: height
      });
    }
  },

  handleColumnRelease: function() {
    this.setState({columnDragging: false, dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0});
  },

  buildColumn: function(column, i) {
    var items = this.getItems(column.items);
    var column =
      <Grabbable
          className="sortie-column"
          position={i}
          key={column.id}
          onGrabieLongGrab={this.handleGrab.bind(null, 'column', column.id, null)}
          onGrabieRelease={this.handleColumnRelease.bind(null, column.id)}
          onMouseMove={(this.state.columnDragging || this.state.itemDragging) && this.handleColumnHover.bind(null, column.id, i)}>
        <Stackable
            overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition}
            placeholderStyle={{height: this.state.dragItemHeight, width: this.state.dragItemWidth}}
            overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id}
            onGrabieRelease={this.handleItemDrop}
            onGrabieLongGrab={this.handleGrab.bind(null, 'card', column.id)}
            onGrabieMove={this.handleItemHover.bind(null, column.id)}
            dragging={this.state.itemDragging}
            autoScrollSpeed={this.state.overColumnKey === column.id ? this.state.autoScrollSpeed : null}>
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
