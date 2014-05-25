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
    this.todos.push({text: payload.text, id: payload.id, column_id: payload.column_id});
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
