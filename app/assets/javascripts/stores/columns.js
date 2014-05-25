var ColumnStore = Fluxxor.createStore({
  actions: {
    'ADD_COLUMN': 'handleAddColumn',
    'MOVE_ITEM': 'handleMoveTask',
    'ADD_ITEM': 'handleAddTask',
  },

  columns: [],

  get: function(id){
    for(var i =0; i< this.columns.length; i++){
      if (this.columns[i].id == id){
        return this.columns[i];
      }
    }
    return null;
  },

  handleAddColumn: function(payload){
    var column = this.get(payload.id);
    if (column != null) {
      this.emit('error');
    } else {
      this.columns.push(payload);
    }
    this.emit('change');
  },

  handleAddTask: function(payload){
    this.waitFor(['TaskStore'], function(taskstore){
      var columnId = taskstore.get(payload.id).columnId;
      this.get(columnId).items.push(payload.id);
    }.bind(this));
    this.emit('change');
  },

  get: function(id){
    for(var i =0; i< this.columns.length; i++){
      if (this.columns[i].id == id){
        return this.columns[i];
      }
    }
    return null;
  },

  handleMoveTask: function(payload){
    //id, position, columnId
    this.waitFor(['TaskStore'], function(taskstore){
      var task = taskstore.get(payload.id);
      var i = this.get(task.columnId).items.indexOf(task.id);
      this.get(task.columnId).items.splice(i,1);
      this.get(payload.columnId).items.splice(payload.position,0,task.id);
    }.bind(this));
    this.emit('change');
  },

  getState: function(){
    return this.columns;
  }
});
