var TaskStore = Fluxxor.createStore({
  actions: {
    'ADD_ITEM': 'handleAddTask',
    'MOVE_ITEM': 'handleMoveTask',
  },

  tasks:[],

  get: function(id){
    for(var i =0; i< this.tasks.length; i++){
      if (this.tasks[i].id == id){
        return this.tasks[i];
      }
    }
    return null;
  },

  handleAddTask: function(payload){
    var task = this.get(payload.id);
    if (task != null) {
      this.emit('error');
    } else {
      this.tasks.push(payload);
    }
    this.emit('change')
  },

  handleMoveTask: function(payload){
    this.waitFor(['ColumnStore'], function(){
      this.get(payload.id).columnId = payload.columnId;
      this.emit('change')
    });
  },

  getState: function(){
    return this.tasks;
  },
});
