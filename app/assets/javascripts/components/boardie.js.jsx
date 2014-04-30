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
  var clientYRel = e.pageY - rect.top //- e.currentTarget.scrollTop;

  var isTop = (clientYRel <  rect.height/2);

  return !isTop;
}

var StackieRectKeeperMixin = {
  childRects: {},
  getInitialState: function() {
    return {dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null};
  },

  handleRect: function(component, rect, columnKey) {
    this.childRects[component.props.key] = {component: component, rect: rect, itemKey: component.props.key, columnKey: columnKey};
  },

  handleBoardieMove: function(e) {
    var matchKey = null;
    $.each(this.childRects, function(key, rect) {
      if (!rect.component.state.dragging && rect.component.isEventInRect(e, rect.rect)) {
        var position = rect.component.props.position;
        mouseOverBottomHalf(e, rect.rect) && position++
        if ((this.state.overItemKey !== rect.itemKey) || (this.state.overColumnKey !== rect.columnKey) || (this.state.overItemPosition !== position)) {
          this.setState({overItemKey: rect.itemKey, overColumnKey: rect.columnKey, overItemPosition: position});
          this.props.onGrabOver && this.props.onGrabOver(this.state);
        }
      }
    }.bind(this));
  },

  handleGrab: function(colId, key) {
    this.setState({dragItemKey: key});
    window.addEventListener('mousemove', this.handleBoardieMove);
  },

  handleDrop: function(key) {
    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false && this.state.overColumnKey !== false && this.state.overItemPosition !== null) this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    this.setState({dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null});
    window.removeEventListener('mousemove', this.handleBoardieMove);
  },
};


var Boardie = React.createClass({

  mixins: [StackieRectKeeperMixin],

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
    if (position >= 0) {


      columns.forEach(
        function(column) {
          if (column.items.indexOf(itemId) !== -1) {
            column.items.splice(column.items.indexOf(itemId), 1);
          }
        }
      );
      var columnIndex = findIndex(columnId, columns);
      var newColItems = columns[columnIndex].items;
      newColItems.splice(position, 0, itemId);


      this.setProps({columns: columns});
    }
  },

  buildColumn: function(column) {
    var items = this.getItems(column.items);
    var column = <Stackable overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition} overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id} onDrop={this.handleDrop} onGrab={this.handleGrab.bind(null, column.id)} onRect={this.handleRect}>{items}</Stackable>
    return column;
  },

  render: function() {
    var columns = this.props.columns.map(this.buildColumn, this);
    return (
      <div className="boardie cf">
        {columns}
      </div>
    );
  }
});
