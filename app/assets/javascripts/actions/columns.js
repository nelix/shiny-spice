var ColumnActions = {
  addItem: function(text, id, columnId) {
    this.dispatch('ADD_ITEM', {text: text, id: id, columnId: columnId});
  },

  moveItem: function(id, columnId, position) {
    this.dispatch('MOVE_ITEM', {id: id, columnId: columnId, position: position});
  },

  addColumn: function(id, name){
    this.dispatch('ADD_COLUMN', {id: id, name: name, tasks:[]});
  }
};
