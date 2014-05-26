var ColumnHeightStore = Fluxxor.createStore({
  actions: {
    'ADD_COLUMN': 'handleAddColumn',
    'MOVE_ITEM': 'handleMoveTask',
    'ADD_ITEM': 'handleAddTask',
  },
  columnHashes: [],
  i: 0,
  get: function(id){
    for(var i =0; i< this.columnHashes.length; i++){
      if (this.columnHashes[i].columnId == id){
        return this.columnHashes[i];
      }
    }
    return null;
  },

  handleMoveTask: function(payload){
    //id, position, columnId
    var task = this.flux.store('TaskStore').get(payload.id);
    var i = this.get(task.columnId);
    i.hash = this.i++;
    this.get(payload.columnId).hash = this.i++;
    this.emit('change');

  },
  handleAddColumn: function(payload){
    this.columnHashes.push({columnId: payload.id, hash: this.i});
    this.i++;
    this.emit('change');
  },
  handleAddTask: function(payload){
    var c = this.get(payload.columnId)
    if (!c){
      this.columnHashes.push({columnId: payload.columnId, hash: this.i});
    }else{
      c.hash = this.i;
    }
    this.i++;
    this.emit('change');
  },
  getState: function(){
    var aa = {};
    for(var i =0; i< this.columnHashes.length; i++){
      aa[this.columnHashes[i].columnId] = this.columnHashes[i].hash;
    }
    return aa;
  },
});
