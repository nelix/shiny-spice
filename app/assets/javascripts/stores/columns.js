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
    "ADD_COLUMN": "handleAddColumn",
    "MOVE_ITEM": "handleMoveTask",
    "ADD_ITEM":"handleAddTask",
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
      this.emit("error");
    } else {
      this.columns.push(payload);
    }
    this.emit("change");
  },
  handleAddTask: function(payload){
    this.waitFor(["TaskStore"], function(taskstore){
      var columnId = taskstore.get(payload.id).columnId;
      this.get(columnId).items.push(payload.id);
    }.bind(this));
    this.emit("change");
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
    //id, columnId, position
    this.waitFor(["TaskStore"], function(taskstore){
      var task = taskstore.get(payload.id);
      var i = this.get(task.columnId).items.indexOf(payload.task.id);
      this.get(task.columnId).items.splice(i,1);
      this.get(payload.columnId).items.splice(payload.position,0,payload.task.id);
    }.bind(this));
    this.emit("change");
  },
  getState: function(){
    return this.columns;
  }
});
