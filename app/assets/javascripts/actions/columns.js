var ColumnActions = {
  addItem: function(text, id, columnId) {
    this.dispatch('ADD_ITEM', {text: text, id: id, columnId: columnId});
  },

  moveItem: function(itemId, position, columnId) {
    this.dispatch('MOVE_ITEM', {id: itemId, columnId: columnId, position: position});
  },

  addColumn: function(id, name){
    this.dispatch('ADD_COLUMN', {id: id, name: name, items:[]});
  }
};
