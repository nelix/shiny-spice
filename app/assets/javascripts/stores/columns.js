/*
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
*/

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

var ColumnStore = Fluxxor.createStore({
  actions: {
    'ADD_ITEM': 'handleAddItem',
    'MOVE_ITME': 'handleMoveItem'
  },

  initialize: function() {
    this.todos = [];
  },

  handleAddItem: function(payload) {
    this.todos.push({text: payload.text, id: payload.id, columnId: payload.columnId});
    this.emit('change');
  },

  handleMoveItem: function(payload) {
    // TODO
  },

  getState: function() {
    return {
      items: this.items
    };
  }
});
